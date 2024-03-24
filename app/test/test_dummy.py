import unittest
import pandas as pd


class Testing(unittest.TestCase):
    """_summary_

    Args:
        docstring created using cmd+shift+2 after installing autoDocString vscode extension
    """

    def test_string(self):
        """this is a dummy test"""
        a = "some"
        b = "some"
        self.assertEqual(a, b)

    def test_boolean(self):
        """this is another dummy test"""
        a = True
        b = True
        self.assertEqual(a, b)


if __name__ == "__main__":
    df = pd.read_json("app/test/individual_cells_and_boxes_vCompleteRealWorldDB.json")
    print(df)
