import numpy as np
import re

import pandas as pd
from sklearn.model_selection import train_test_split, StratifiedKFold, KFold, GridSearchCV, RandomizedSearchCV, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, f1_score
from sklearn.ensemble import RandomForestClassifier
from imblearn.combine import SMOTEENN
from sklearn.pipeline import make_pipeline
import pickle

from modAL.uncertainty import uncertainty_sampling, classifier_uncertainty, classifier_entropy

from . import create_tabular_data

class ActiveLearningLoop(object):
    def __init__(self, df_labeled, clf=None):
        self.df_labeled = df_labeled
        self.df_unlabeled = pd.DataFrame()
        self.df_unlabeled_name = ""
        self.clf = clf

    def train_model(self):
        # Model pretrained on the initial labeled dataset
        # Run at very beginning
        X_labeled = self.df_labeled[['area', 'eccentricity', 'circularity', 'mean_intensity', 'min_intensity',
                                     'max_intensity']]  # DataFrame containing feature columns
        y_labeled = self.df_labeled['label']

        # Resample the training data to address class imbalance
        X_resampled, y_resampled = SMOTEENN(random_state=42).fit_resample(X_labeled, y_labeled)

        # Step 1: Split the dataset into 2 parts: training set and independent test set
        X_train, X_test, y_train, y_test = train_test_split(X_resampled, y_resampled, test_size=0.2, random_state=42)

        # Stratified 5-fold cross-validation
        skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

        # Step 2: Initialize GridSearchCV
        if self.clf is None:
            self.clf = RandomForestClassifier()
        pipeline = make_pipeline(StandardScaler(), self.clf)
        param_grid = {
            'randomforestclassifier__n_estimators': [50, 100, 150],
            'randomforestclassifier__max_depth': [None, 10, 20],
            'randomforestclassifier__min_samples_split': [2, 5, 10],
            'randomforestclassifier__min_samples_leaf': [1, 2, 4]
        }
        grid_search = GridSearchCV(estimator=pipeline, param_grid=param_grid, cv=skf, n_jobs=-1)

        # Perform the grid search on the training data
        grid_search.fit(X_train, y_train)

        # Step 3: Taking the hyperparams that produced the best results in the k-fold CV
        clf_new = grid_search.best_estimator_
        self.clf = clf_new.steps[1][1]
        # print(grid_search.best_params_)
        # print(grid_search.cv_results_)
        y_pred = clf_new.predict(X_test)

        # scaler = StandardScaler()
        # X_train_scaled = scaler.fit_transform(X_train)
        # X_test_scaled = scaler.transform(X_test)

        # self.clf = RandomForestClassifier()
        # self.clf.fit(X_train_scaled, y_train)

        # y_pred = self.clf.predict(X_test_scaled)

        accuracy = accuracy_score(y_test, y_pred)
        f1 = f1_score(y_test, y_pred, average="weighted")
        print("Accuracy:", round(accuracy, 2))
        print("F1:", round(f1, 2))
        return accuracy, f1, y_labeled.count()

    def save_model(self, file_path = "clf.sav"):
        pickle.dump(self.clf, open(file_path, 'wb'))

    def load_model(self, file_path = "clf.sav"):
        self.clf = pickle.load(open(file_path, 'rb'))

    def append_label(self, labels_annotator, cell_names):
        #labels_annotator = [['wbc', 'oof', 'wbc', 'rbc', 'agg', 'wbc', 'wbc'],
        #                ['wbc', 'rbc', 'wbc', 'oof', 'wbc', 'rbc', 'agg', 'wbc', 'wbc']]
        cell_indices_list = []
        for cell_name_list in cell_names:
            indices = self.df_unlabeled.index[self.df_unlabeled['image_name'].isin(cell_name_list)].tolist()
            cell_indices_list.append(indices)
        for label_list, indices_list in zip(labels_annotator, cell_indices_list):
            for label, index in zip(label_list, indices_list):
                if label is not None:
                    print(label, index)
                    self.df_unlabeled['label'].loc[index] = label
                    self.df_unlabeled['labeled'].loc[index] = True
                    self.df_labeled.loc[self.df_labeled.index.max() + 1] = self.df_unlabeled.loc[index]
                else:
                    continue

    def uncertainty_sampling(self, query_num):
        # Input: classifier, unlabeled data
        filtered_df = self.df_unlabeled.copy()
        uncertainties = classifier_uncertainty(self.clf, filtered_df[
            ['area', 'eccentricity', 'mean_intensity', 'min_intensity',
             'max_intensity']])  # X_pool is the unlabeled dataset
        filtered_df['uncertainties'] = np.squeeze(uncertainties)
        df_sorted = filtered_df.sort_values(by='uncertainties', ascending=False)
        sample_for_annotator = df_sorted[:][['image_name', 'parent_image_name', 'uncertainties']]
        # print(sample_for_annotator)

        # sorted_uncertainty = uncertainties.argsort()[::-1]
        # index_user_annotation = sorted_uncertainty[:query_num]
        # print(f'According to uncertainty sampling, sample {index_user_annotation} should be labeled by the annotator.')

        return sample_for_annotator

    def uncertainty_sampling_output(self, num_images):
        # What we provide for the frontend
        sample_for_annotator = self.uncertainty_sampling(10)

        # print(sample_for_annotator.iloc[:10])

        # Number of images = 3
        # num_images = 3
        # Indices of the parent images
        parent_images_indices = sample_for_annotator['parent_image_name'].iloc[:num_images].apply(
            lambda x: re.findall(r'\d+$', x)[0]).to_list()

        # Names of the parent images
        parent_images_names = sample_for_annotator['parent_image_name'].iloc[:num_images].to_list()

        # Sorted order and uncertainties of the blood cells (here only for one parent image)
        # parent_name = sample_for_annotator['parent_image_name'].iloc[0]
        # segment_name = sample_for_annotator['image_name'].iloc[0]

        cell_names_list = [
            sample_for_annotator[sample_for_annotator['parent_image_name'] == parent_name]['image_name'].to_list() for
            parent_name in parent_images_names]
        cell_uncertainties_list = [
            sample_for_annotator[sample_for_annotator['parent_image_name'] == parent_name]['uncertainties'].to_list()
            for parent_name in parent_images_names]

        return parent_images_indices, parent_images_names, cell_names_list, cell_uncertainties_list


if __name__ == "__main__":
    # Load labeled dataset
    # It could be a preprocessed csv
    file_path_prediction = '/Users/dodo/Desktop/ss23_uni/AMI/prediction.seg'
    df_labeled = create_tabular_data.create_labeled_data(file_path_prediction)

    # Load unlabeled dataset
    # It could be a preprocessed csv
    dataset_name = 'individual_cells_and_boxes_vCompleteF1.h5'
    df_unlabeled = create_tabular_data.create_unlabeled_data(dataset_name)

    # Active learning loop
    # For testing purpose load the pretrained model from local folder
    clf = pickle.load(open(f'clf.sav', 'rb'))
    loop = ActiveLearningLoop(df_labeled, clf)

    # The information which needs to be sent to frontend
    parent_images_indices, parent_images_names, cell_names_list, cell_uncertainties_list = loop.uncertainty_sampling_output(2)

    # The information we get from frontend/annotator
    # For testing purpose just created some random dummy labels
    dummy_labels = [['wbc', 'oof', 'wbc', 'rbc', 'agg', 'wbc', 'wbc'],
                        ['wbc', 'rbc', 'wbc', 'oof', 'wbc', 'rbc', 'agg', 'wbc', 'wbc']]

    # Append labels to the training dataset for the model
    # Retrain the model based on the new dataset
    loop.append_label(dummy_labels)
    loop.train_model()
