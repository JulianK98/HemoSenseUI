import pickle


class Model:
    def __init__(self, path_of_model) -> None:
        self.model_path = path_of_model
        self.sample_dict = {"key1": "value1", "key2": "value2", "key3": "value3"}

    def save(self, name="dictionary.pkl"):
        final_path = self.model_path + "/{}".format(name)
        with open(final_path, "wb") as file:
            pickle.dump(self.sample_dict, file)
        return final_path

    def load(self, name="dictionary.pkl"):
        with open(self.model_path + "/{}".format(name), "rb") as file:
            loaded_dict = pickle.load(file)
        return loaded_dict

    def train(self):
        pass
