import sys
import pandas as pd
import numpy as np
from sklearn import model_selection as cv
from sklearn.metrics.pairwise import pairwise_distances

data = pd.read_json(sys.argv[2], orient = 'split')
train_data, test_data = cv.train_test_split(data, test_size=0.25)
n_users = data['userId'].unique().shape[0]
n_items = data['movieId'].unique().shape[0]
users = data['userId'].unique()
movies = data['movieId'].unique()
print('Number of users = ' + str(n_users) + ' | Number of movies = ' + str(n_items))

train_data_matrix = pd.DataFrame(np.zeros((n_users, n_items)), columns = movies, index = users)
for line in train_data.itertuples():
    train_data_matrix.at[line[4], line[1]] = line[2]

test_data_matrix = pd.DataFrame(np.zeros((n_users, n_items)), columns = movies, index = users)
for line in test_data.itertuples():
    test_data_matrix.at[line[4], line[1]] = line[2]

user_similarity = pairwise_distances(train_data_matrix, metric='cosine')
#item_similarity = pairwise_distances(train_data_matrix.transpose(), metric='cosine')

def predict(ratings, similarity, type='user'):
    if type == 'user':
        mean_user_rating = ratings.mean(axis=1)
        # You use np.newaxis so that mean_user_rating has same format as ratings
        ratings_diff = (ratings - mean_user_rating[:, np.newaxis])
        pred = mean_user_rating[:, np.newaxis] + similarity.dot(ratings_diff) / np.array([np.abs(similarity).sum(axis=1)]).T
    elif type == 'item':
        pred = ratings.dot(similarity) / np.array([np.abs(similarity).sum(axis=1)])
    return pred

#item_prediction = predict(train_data_matrix, item_similarity, type='item')
user_prediction = predict(train_data_matrix.values, user_similarity, type='user')
print(pd.DataFrame(user_prediction, columns=movies, index=users))

sys.stdout.flush()
