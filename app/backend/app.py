import os
from os.path import isfile, join
from apscheduler.schedulers.background import BackgroundScheduler
import h5py
import pandas as pd
from flask_cors import CORS
from flask import Flask, jsonify, request, render_template
from apscheduler.triggers.cron import CronTrigger
from utils.h5_to_image import get_bbox_images_from_h5, get_cell_images_from_h5
from utils.performace import Performance
from training.active_learning import ActiveLearningLoop

template_dir = os.path.abspath("./templates")
app = Flask(__name__, template_folder=template_dir)

cors = CORS(
    app,
    resources={
        r"/upload": {"origins": "*"},
        r"/list_files": {"origins": "*"},
        r"/get_image": {"origins": "*"},
        r"/segmentation/datasets": {"origins": "*"},
        r"/segmentation/start-segmentation": {"origins": "*"},
        r"/classification/datasets": {"origins": "*"},
        r"/classification/data/*": {"origins": "*"},
        r"/classification/selectedData": {"origins": "*"},
        r"/classification/labeledImages": {"origins": "*"},
        r"/classification/start": {"origins": "*"},
        r"/performance": {"origins": "*"},
        r"/active-learning/datasets": {"origins": "*"},
        r"/active-learning/classify": {"origins": "*"},
        r"/active-learning/labels": {"origins": "*"},
    },
)

performance = Performance()

AMI_SHARE_DIR = os.environ.get("AMI_SHARE_DIR")
GROUP_SHARE_DIR = os.environ.get("GROUP_SHARE_DIR")
MODEL_FILE = GROUP_SHARE_DIR + "model/clf.sav"
LABELED_DF_FILE = GROUP_SHARE_DIR + "dataframes/labeled_df.json"
DATAFRAMES_DIR = GROUP_SHARE_DIR + "dataframes/"
DATASETS_DIR = GROUP_SHARE_DIR + "datasets/"


@app.route("/", methods=["GET"])
def get_index():
    return render_template("index.html")


def filename_without_extension(file_path):
    return os.path.splitext(os.path.basename(file_path))[0]


def get_dataframes():
    df_labeled = pd.read_json(LABELED_DF_FILE)
    return df_labeled


df_labeled = get_dataframes()
loop = ActiveLearningLoop(df_labeled)
loop.load_model(MODEL_FILE)


@app.route("/active-learning/datasets")
def files():
    datasets = [
        f
        for f in os.listdir(DATAFRAMES_DIR)
        if isfile(join(DATAFRAMES_DIR, f)) and f != "labeled_df.json"
        if not f.startswith("._")
    ]
    response = {"datasets": [], "numTotalImages": [], "numUnlabeledImages": []}
    for dataset in datasets:
        response["datasets"].append(filename_without_extension(dataset))
    # response["numTotalImages"].append(df.shape[0])
    # response["numUnlabeledImages"].append(df[-df["labeled"]].shape[0])
    return jsonify(response)


@app.route("/classification/datasets")
def classification_files():
    datasets = [
        f
        for f in os.listdir(DATAFRAMES_DIR)
        if isfile(join(DATAFRAMES_DIR, f)) and f != "labeled_df.json"
        if not f.startswith("._")
    ]
    response = {"datasets": [], "numTotalImages": [], "numUnlabeledImages": []}
    for dataset in datasets:
        response["datasets"].append(filename_without_extension(dataset))
    return jsonify(response)


@app.route("/classification/data", methods=["POST"])
def fetch_c_data():
    selected_data = request.json
    dataset_name = selected_data["selectedDataset"]
    dataframe = join(DATAFRAMES_DIR, dataset_name + ".json")

    loop.df_unlabeled = pd.read_json(dataframe)
    image_name_list = list(loop.df_unlabeled["parent_image_name"].unique())
    list_dummy = ["data1", "data2", "data3"]
    return jsonify(data=list_dummy)


@app.route("/active-learning/classify", methods=["POST"])
def active_learning():
    data = request.json
    dataset_name = data["dataset"]
    num_of_images = data["numImages"]

    dataframe = join(DATAFRAMES_DIR, dataset_name + ".json")

    loop.df_unlabeled = pd.read_json(dataframe)
    loop.df_unlabeled_name = dataset_name
    image_indices, image_names, cell_names, cell_uncertainties = loop.uncertainty_sampling_output(
        num_of_images
    )

    images = get_bbox_images_from_h5(join(DATASETS_DIR, dataset_name + ".h5"), image_names)
    cell_images = get_cell_images_from_h5(join(DATASETS_DIR, dataset_name + ".h5"), cell_names)
    cell_certainties = [
        [1 - uncertainty for uncertainty in inner_list] for inner_list in cell_uncertainties
    ]

    response = {
        "numImages": num_of_images,
        "cellNames": cell_names,
        "images": images,
        "bloodCells": cell_images,
        "certainty": cell_certainties,
    }
    return jsonify(response)


@app.route("/classification/start", methods=["POST"])
def start_classification():
    data = request.json
    dataset_name = data["selectedDataset"]
    indices = data["selectedIndices"]
    num_of_images = len(indices)

    dataframe = join(DATAFRAMES_DIR, dataset_name + ".json")

    loop.df_unlabeled = pd.read_json(dataframe)
    loop.df_unlabeled_name = dataset_name
    image_indices, image_names, cell_names, cell_uncertainties = loop.uncertainty_sampling_output(
        num_of_images
    )

    images = get_bbox_images_from_h5(join(DATASETS_DIR, dataset_name + ".h5"), image_names)
    cell_images = get_cell_images_from_h5(join(DATASETS_DIR, dataset_name + ".h5"), cell_names)

    selected_images = [images[i] for i in indices]
    classified_images = []
    for idx, img in enumerate(selected_images):
        image_df = loop.df_unlabeled[loop.df_unlabeled["parent_image_name"] == img]
        temp_img = []
        for c_indx, cell in enumerate(cell_names[idx]):
            temp_dict = {}
            cell_df = image_df[image_df["image_name"] == cell]
            cell_features = cell_df[
                ["area", "eccentricity", "mean_intensity", "min_intensity", "max_intensity"]
            ]
            cell_type, proba = loop.classify(cell_features)

            temp_dict.update({"descption": cell_type, "b64": cell_images[idx][c_indx]})
            temp_img.append(temp_dict)
        classified_images.append(temp_img)

    response = {
        "images": images,
        "bloodCells": classified_images,
    }
    return jsonify(response)


@app.route("/active-learning/labels", methods=["POST"])
def annotate_active_learning():
    data = request.json
    cell_names = data["cellNames"]
    labels = data["labels"]

    loop.append_label(labels, cell_names)

    accuracy, f1, num_labels = loop.train_model()
    performance.update_metrics(accuracy, f1, num_labels)
    return jsonify(performance.get_metrics())


@app.after_request
def save_model_after_training(response):
    if request.path == "/active-learning/labels" and response.status_code == 200:
        loop.save_model(MODEL_FILE)
        loop.df_labeled.to_json(LABELED_DF_FILE)
        loop.df_unlabeled.to_json(DATAFRAMES_DIR + loop.df_unlabeled_name + ".json")
    return response


@app.route("/performance")
def metrics():
    return jsonify(performance.get_metrics())


scheduler = BackgroundScheduler()
# scheduler.add_job(func=train_active_learning, trigger=CronTrigger(hour=0, minute=0, second=0))
scheduler.start()

if __name__ == "__main__":
    app.run(host="0.0.0.0")
