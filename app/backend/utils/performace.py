from datetime import datetime


class Performance:
    def __init__(self):
        self.metrics = []

    def update_metrics(self, accuracy, f1, num_of_labels):
        self.metrics.append(
                {
                    "time"     : datetime.now(),
                    "accuracy" : float(round(accuracy, 2)),
                    "f1"       : float(round(f1, 2)),
                    "numLabels": int(num_of_labels)
                }
        )

    def get_metrics(self):
        formatted_metrics = {
            "time"     : [],
            "accuracy" : [],
            "f1"       : [],
            "numLabels": []
        }

        for item in self.metrics:
            formatted_metrics["time"].append(item["time"])
            formatted_metrics["accuracy"].append(item["accuracy"])
            formatted_metrics["f1"].append(item["f1"])
            formatted_metrics["numLabels"].append(item["numLabels"])

        return formatted_metrics
