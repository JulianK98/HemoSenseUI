from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import time
import json
from werkzeug.utils import secure_filename

app = Flask(__name__)
# Only needed when frontend and backend run on same host
cors = CORS(app, resources={
    r"/upload": {"origins": "*"},
    r"/list_files": {"origins": "*"},
    r"/get_image": {"origins": "*"},
    r"/segmentation/datasets": {"origins": "*"},
    r"/segmentation/start-segmentation": {"origins": "*"},
    r"/classification/datasets": {"origins": "*"},
    r"/classification/data": {"origins": "*"},
    r"/classification/selectedData": {"origins": "*"},
    r"/classification/labeledImages": {"origins": "*"},
    r"/classification/start": {"origins": "*"},
    r"/performance": {"origins": "*"},
            r"/active-learning/datasets": {"origins": "*"},
            r"/active-learning/classify": {"origins": "*"},
            r"/active-learning/labels": {"origins": "*"},
            })


# Mock data
current_dir = os.path.dirname(os.path.abspath(__file__))
json_file = os.path.join(current_dir, 'data.json')
json_file2 = os.path.join(current_dir, 'data2.json')

with open(json_file2) as f:
    data2 = json.load(f)

with open(json_file) as f:
    data = json.load(f)

main_image1 = data['main_image1']
main_image2 = data['main_image2']
main_image3 = data['main_image3']
sub_image1_1 = data['sub_image1_1']
sub_image1_2 = data['sub_image1_2']
sub_image1_3 = data['sub_image1_3']
sub_image1_4 = data['sub_image1_4']
sub_image1_5 = data['sub_image1_5']
sub_image1_6 = data['sub_image1_6']

sub_image2_1 = data['sub_image2_1']
sub_image2_2 = data['sub_image2_2']
sub_image2_3 = data['sub_image2_3']
sub_image3_1 = data['sub_image3_1']
sub_image3_2 = data['sub_image3_2']
sub_image3_3 = data['sub_image3_3']

datasets = ['dataset1', 'dataset2', 'dataset3']
data1 = ['data11', 'data12', 'data13']
data2 = ['data21', 'data22', 'data23']
data3 = ['data31', 'data32', 'data33']
selected_data = [1, 2, 3]

images = [main_image1, main_image2, main_image3]
blood_cells = [
    [{'description': 'Nothing detected', 'b64': sub_image1_1}, {'description': 'White Blood Cell', 'b64': sub_image1_2}, {'description': 'Red Blood Cell', 'b64': sub_image1_3}, {
        'description': 'Red Blood Cell', 'b64': sub_image1_4}, {'description': 'Red Blood Cell', 'b64': sub_image1_5}, {'description': 'Red Blood Cell', 'b64': sub_image1_6}],
    [{'description': 'White Blood Cell', 'b64': sub_image2_1}, {'description': 'Red Blood Cell',
                                                                'b64': sub_image2_2}, {'description': 'Red Blood Cell', 'b64': sub_image2_3}],
    [{'description': 'Red Blood Cell', 'b64': sub_image3_1}, {'description': 'White Blood Cell',
                                                              'b64': sub_image3_2}, {'description': 'Red Blood Cell', 'b64': sub_image3_3}]
]


@app.route("/active-learning/datasets", methods=["GET"])
def get_al_datasets():
    # Simulate delay
    time.sleep(2)
    # Mock data
    datasets_object = {
        "datasets": [
            "SimpleSample1",
            "SimpleSample2",
            "SimpleSample3",
            "RealWorldSample1",
            "RealWorldSample2",
            "RealWorldSample3",
        ],
        "numTotalImages": [10000, 10000, 10000, 10000, 10000, 10000],
        "numUnlabeldImages": [5000, 5000, 5000, 5000, 5000, 5000],
    }
    return jsonify(datasets_object)


@app.route("/active-learning/classify", methods=["POST"])
def get_unlabeled_bc_images():
    # Access active learning loop config data
    dataset = request.json["dataset"]
    im_images = request.json["numImages"]

    # Simulate uncertainty sampling time
    time.sleep(2)
    mock_classify_data = json.load(open(json_file2))
    return jsonify(mock_classify_data)


@app.route("/active-learning/labels", methods=["POST"])
def store_blood_cell_labels():
    # Access blood cell labels object
    num_images = request.json["numImages"]
    index = request.json["index"]
    labels = request.json["labels"]

    # Send success message
    success_message = {"message": "Label data transfer success!"}
    return jsonify(success_message)


@app.route('/segmentation/datasets')
def get_segmentation_datasets():
    time.sleep(2)
    datasets_object = {
        "datasets": [
            "NewTestData",
            "SimpleSample1",
            "SimpleSample2",
            "SimpleSample3",
            "RealWorldSample1",
            "RealWorldSample2",
            "RealWorldSample3",
        ]
    }
    return jsonify(datasets_object)


@app.route('/segmentation/start-segmentation', methods=['POST'])
def start_segmentation():
    dataset = request.json['dataset']
    time.sleep(5)
    return jsonify({"message": "Segmentation complete! You can now use this dataset for active learning."})


@app.route('/classification/datasets')
def get_classification_datasets():
    return jsonify(datasets=datasets)


@app.route('/classification/data', methods=['POST'])
def fetch_c_data():
    selected_data = request.get_json()
    print(selected_data)
    return jsonify(data=data3)


@app.route('/classification/start', methods=['POST'])
def start_classification():
    time.sleep(5)
    selected_data = request.get_json()
    print(selected_data)
    return jsonify(images=images, bloodCells=blood_cells)


@app.route("/performance", methods=["GET"])
def get_performance_data():
    # Simulate delay
    time.sleep(2)
    # Mock performance data
    performance_object = {
        "time": [
            "2023-06-20T00:00:00",
            "2023-06-21T00:00:00",
            "2023-06-22T00:00:00",
            "2023-06-23T00:00:00",
            "2023-06-24T00:00:00",
            "2023-06-25T00:00:00",
            "2023-06-26T00:00:00",
            "2023-06-27T00:00:00",
            "2023-06-28T00:00:00",
            "2023-06-29T00:00:00",
            "2023-06-30T00:00:00",
            "2023-07-01T00:00:00",
        ],
        "accuracy": [
            0.7,
            0.75,
            0.73,
            0.78,
            0.82,
            0.83,
            0.85,
            0.80,
            0.83,
            0.89,
            0.87,
            0.93,
        ],
        "f1": [0.7, 0.75, 0.78, 0.81, 0.85, 0.82, 0.89, 0.90, 0.86, 0.90, 0.91, 0.90],
        "numLabels": [111, 136, 163, 182, 210, 229, 257, 307, 320, 386, 399, 430],
    }
    return jsonify(performance_object)


if __name__ == '__main__':
    app.run()
