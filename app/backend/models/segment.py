from enum import Enum


class Label(Enum):
    NO_LABEL = 0
    RED_BLOOD_CELL = 1
    WHITE_BLOOD_CELL = 2
    PLATELET = 3
    AGGREGATE = 4
    OUT_OF_FOCUS = 5


class Segment:
    def __init__(self,
                 id : str,
                 parent_image_id  : str,
                 dataset_name : str,
                 uncertainty : float,
                 label : Label,
                 in_training: bool):
        self.dataset_name = dataset_name
        self.parent_image_id = parent_image_id
        self.id = id
        self.uncertainty = uncertainty
        self.label = label
        self.in_training = in_training


def convert_row_to_segment(row):
    return Segment(row.id, row.parent_image_id, row.dataset_name, row.uncertainty, Label(row.label), row.in_training)