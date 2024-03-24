import h5py
import numpy as np
import base64
import io
import re
import matplotlib.pyplot as plt
import colormap


def array_to_base64_png(image_array):
    image_array = np.squeeze(image_array)
    #plt.imshow(image_array, norm = colormap.CellfaceStdNorm, cmap = colormap.CellfaceStdCMap)
    plt.imshow(image_array)
    plt.axis('off')

    image_buffer = io.BytesIO()
    plt.savefig(image_buffer, format = 'png')
    image_buffer.seek(0)
    plot_base64 = base64.b64encode(image_buffer.getvalue()).decode('utf-8')

    return plot_base64


def get_bbox_images_from_h5(path_to_h5_file, list_of_names):
    pattern = r'_\d_\d+'
    images = []
    with h5py.File(path_to_h5_file, 'r') as file:
        for name in list_of_names:
            index_for_image = re.search(pattern, name).group(0)
            image_with_bbox_name = "BBOX_Image" + index_for_image
            group_name = "Individual_Cell_Images_and_BBOX" + index_for_image
            arr_im_with_bbox = file[group_name][image_with_bbox_name][:]
            images.append(array_to_base64_png(arr_im_with_bbox))
    return images


def get_cell_images_from_h5(path_to_h5_file, list_of_cell_lists):
    pattern = r'_\d_\d+'
    cell_images = []
    with h5py.File(path_to_h5_file, 'r') as file:
        for list in list_of_cell_lists:
            cells = []
            for cell in list:
                index_for_image = re.search(pattern, cell).group(0)
                group_name = "Individual_Cell_Images_and_BBOX" + index_for_image
                arr_im_of_cell = file[group_name][cell][:]
                cells.append(array_to_base64_png(arr_im_of_cell))
            cell_images.append(cells)
    return cell_images
