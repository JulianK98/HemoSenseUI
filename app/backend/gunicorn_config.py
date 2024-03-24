import os

from training import create_tabular_data

AMI_SHARE_DIR = "/data/ami/"
GROUP_SHARE_DIR = "/data/group/"
LABELED_DF_FILE = GROUP_SHARE_DIR + "dataframes/labeled_df.json"


def filename_without_extension(file_path):
    return os.path.splitext(os.path.basename(file_path))[0]


def on_starting(server):
    file_path_prediction = AMI_SHARE_DIR + 'prediction.seg'
    if not os.path.exists(LABELED_DF_FILE):
        df_labeled = create_tabular_data.create_labeled_data(file_path_prediction)
        df_labeled.to_json(LABELED_DF_FILE)
    DATASET_DIR = GROUP_SHARE_DIR + "datasets/"
    for dataset in os.listdir(DATASET_DIR):
        if dataset.startswith("."):
            continue
        json_file = GROUP_SHARE_DIR + "dataframes/" + filename_without_extension(dataset) + ".json"
        if not os.path.exists(json_file):
            df_unlabeled = create_tabular_data.create_unlabeled_data(os.path.join(DATASET_DIR,dataset))
            df_unlabeled.to_json(json_file)


bind = '0.0.0.0:5001'
workers = 1
worker_class = 'sync'
preload_app = True
keepalive = 300


on_starting = on_starting
