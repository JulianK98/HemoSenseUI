import pandas as pd
import numpy as np
from . import preprocessing


def create_labeled_data(file_path_prediction):
    # file_path_prediction = '/Users/dodo/Desktop/ss23_uni/AMI/prediction.seg'
    hf_prediction = preprocessing.read_hdf5(file_path_prediction)
    label, phase, amplitude, mask = preprocessing.hf_to_list(hf_prediction, True)
    df_labeled = preprocessing.extract_features_labeled_data(mask, label, amplitude)

    return df_labeled


def create_unlabeled_data(dataset_name):
    # Create the unlabeled dataset
    # dataset_name = 'individual_cells_and_boxes_vCompleteF1.h5'
    hf = preprocessing.read_hdf5(dataset_name)
    df_unlabeled = pd.DataFrame(
        columns=['image_name', 'parent_image_name', 'dateset_name', 'labeled', 'area', 'perimeter', 'eccentricity',
                 'circularity', 'roundness', 'mean_intensity', 'std_intensity', 'min_intensity', 'max_intensity',
                 'median_intensity', 'percentile_intensity', 'label'])
    for parent_name in list(hf.keys())[:1000]:
        for segment_name in list(hf[parent_name]):
            if 'BBOX' in segment_name:
                continue
            else:
                # print(parent_name, segment_name)
                # Read segmented individual cell image from each group
                segment_image = np.squeeze(hf[parent_name][segment_name][:])

                # Extract features
                features_dict = preprocessing.extract_features_unlabeled_data(segment_image, segment_name, parent_name, dataset_name, False)
                # TODO: Change append
                df_unlabeled = df_unlabeled.append(features_dict, ignore_index=True)
                # print(features_dict)

                # Plot the segmented cell
                # fig, ax = plt.subplots(1, 1)
                # ax.imshow(segment_image, norm=CellfaceStdNorm ,cmap=CellfaceStdCMap)

    return df_unlabeled