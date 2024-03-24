import pandas as pd
import numpy as np
import h5py
import os
from skimage.measure import regionprops


def read_hdf5(file_path):
    os.environ["HDF5_USE_FILE_LOCKING"] = "FALSE"
    hf = h5py.File(file_path, 'r')
    # print(hf.keys())
    return hf


def hf_to_list(hf, labeled_data):
    if labeled_data:
        label = list(hf['label']['ground_truth'])
        phase = list(hf['phase']['images'])
        amplitude = list(hf['amplitude']['images'])
        mask = list(hf['mask']['images'])

        return label, phase, amplitude, mask
    else:
        phase = list(hf['phase']['images'])
        amplitude = list(hf['amplitude']['images'])

        return phase, amplitude

def extract_features_labeled_data(masks_list, labels_list, amp_list):
    # Initialize lists to store the extracted features
    area_list = []
    perimeter_list = []
    eccentricity_list = []
    circularity_list = []
    roundness_list = []

    mean_intensity_list = []
    std_intensity_list = []
    min_intensity_list = []
    max_intensity_list = []
    median_intensity_list = []
    percentile_intensity_list = []

    im_count = 0
    # Iterate over the masks and labels
    for mask, label, image in zip(masks_list, labels_list, amp_list):
        im_count = im_count + 1
        # Calculate region properties of the mask using skimage
        # Documentation: https://scikit-image.org/docs/stable/auto_examples/segmentation/plot_regionprops.html
        props = regionprops(mask)

        # Extract the features from region properties
        # For now we try area (size), perimeter, eccentricity, circularity and (roundness)
        # Reference: Classification of White Blood Cells Based on Morphological Features
        # https://ieeexplore.ieee.org/document/6968362
        # Area of the region i.e. number of pixels of the region scaled by pixel-area.
        area = props[0].area

        # Perimeter of object which approximates the contour as a line through the centers of border pixels
        # using a 4-connectivity.
        perimeter = props[0].perimeter

        # Eccentricity of the ellipse that has the same second-moments as the region.
        # The eccentricity is the ratio of the focal distance (distance between focal points)
        # over the major axis length.
        # The value is in the interval [0, 1). When it is 0, the ellipse becomes a circle.
        eccentricity = props[0].eccentricity

        circularity = 4 * np.pi * area / (perimeter ** 2)
        roundness = (perimeter ** 2) / (4 * np.pi * area)  # the same thing as circularity?

        area_list.append(area)
        perimeter_list.append(perimeter)
        eccentricity_list.append(eccentricity)
        circularity_list.append(circularity)
        roundness_list.append(roundness)

        masked_image = np.where(mask > 0, image, 0)

        mean_intensity_list.append(np.mean(masked_image))
        std_intensity_list.append(np.std(masked_image))
        min_intensity_list.append(np.amin(masked_image))
        max_intensity_list.append(np.amax(masked_image))
        median_intensity_list.append(np.median(masked_image))
        percentile_intensity_list.append(np.percentile(masked_image, q=50))

    # Create a dictionary of feature lists
    features_dict = {
        'image_name': f'Labeled_Image_{im_count}',
        'parent_image_name': 'none',
        'dateset_name': 'Labeled_dataset',
        'labeled': True,
        'area': area_list,
        'perimeter': perimeter_list,
        'eccentricity': eccentricity_list,
        'circularity': circularity_list,
        'roundness': roundness_list,
        'mean_intensity': mean_intensity_list,
        'std_intensity': std_intensity_list,
        'min_intensity': min_intensity_list,
        'max_intensity': max_intensity_list,
        'median_intensity': median_intensity_list,
        'percentile_intensity': percentile_intensity_list
    }

    # Create a dataframe from the features dictionary
    df = pd.DataFrame(features_dict)

    # Add the labels to the dataframe
    df['label'] = labels_list
    df['label'] = df['label'].str.decode('utf-8')

    return df


def extract_features_unlabeled_data(image, image_name, parent_image_name, dataset_name, labeled):
    mask = np.ceil(image).astype(int)
    props = regionprops(mask)

    area = props[0].area
    perimeter = props[0].perimeter
    eccentricity = props[0].eccentricity
    circularity = 4 * np.pi * area / (perimeter ** 2)
    roundness = (perimeter ** 2) / (4 * np.pi * area)

    masked_image = np.where(mask > 0, image, 0)

    mean_intensity = np.mean(masked_image)
    std_intensity = np.std(masked_image)
    min_intensity = np.amin(masked_image)
    max_intensity = np.amax(masked_image)
    median_intensity = np.median(masked_image)
    perc_intensity = np.percentile(masked_image, q=50)

    features_dict = {
        'image_name': image_name,
        'parent_image_name': parent_image_name,
        'dateset_name': dataset_name,
        'labeled': labeled,
        'area': area,
        'perimeter': perimeter,
        'eccentricity': eccentricity,
        'circularity': circularity,
        'roundness': roundness,
        'mean_intensity': mean_intensity,
        'std_intensity': std_intensity,
        'min_intensity': min_intensity,
        'max_intensity': max_intensity,
        'median_intensity': median_intensity,
        'percentile_intensity': perc_intensity,
        'label': ''
    }

    return features_dict
