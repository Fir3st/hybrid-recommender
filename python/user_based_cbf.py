import sys
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import pairwise_distances
from sklearn.neighbors import NearestNeighbors

data = pd.read_json(sys.argv[3], orient = 'split')
n_users = data['userId'].unique().shape[0]
n_items = data['movieId'].unique().shape[0]
users = data['userId'].unique()
movies = data['movieId'].unique()
metric = 'cosine'

data_matrix = pd.DataFrame(np.zeros((n_users, n_items)), columns = movies, index = users)
for line in data.itertuples():
    data_matrix.at[line[4], line[1]] = line[2]

user_similarity = 1 - pairwise_distances(data_matrix, metric=metric)

def predict(ratings, similarity, type='user'):
    if type == 'user':
        mean_user_rating = ratings.mean(axis=1)
        ratings_diff = (ratings - mean_user_rating[:, np.newaxis])
        pred = mean_user_rating[:, np.newaxis] + similarity.dot(ratings_diff) / np.array([np.abs(similarity).sum(axis=1)]).T
    elif type == 'item':
        pred = ratings.dot(similarity) / np.array([np.abs(similarity).sum(axis=1)])
    return pred

user_prediction = pd.DataFrame(predict(data_matrix.values, user_similarity, type='user'), columns = movies, index = users)

def recommend(ratings, user, n = 10):
    user_movies = pd.DataFrame(data_matrix.loc[user])
    user_movies.columns = ['rating']
    viewed_movies = user_movies[user_movies['rating'] > 0].index
    predicted_ratings = pd.DataFrame(ratings.loc[user])
    predicted_ratings.columns = ['rating']
    recommended_movies = predicted_ratings.drop(viewed_movies).sort_values(['rating'], ascending=[0]).head(n).index.values

    return recommended_movies

print(recommend(user_prediction, int(sys.argv[1]), int(sys.argv[2])))

sys.stdout.flush()
