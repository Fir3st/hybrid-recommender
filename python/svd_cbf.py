import sys
import pandas as pd
import numpy as np
from scipy.sparse.linalg import svds

data = pd.read_json(sys.argv[3], orient='split')
n_users = data['userId'].unique().shape[0]
n_items = data['movieId'].unique().shape[0]
users = data['userId'].unique()
movies = data['movieId'].unique()

data_matrix = pd.DataFrame(np.zeros((n_users, n_items)), columns=movies, index=users)
for line in data.itertuples():
    data_matrix.at[line[4], line[1]] = line[2]

data_matrix_mean = np.mean(data_matrix.values, axis=1)
data_matrix_demeaned = data_matrix.values - data_matrix_mean.reshape(-1, 1)
U, sigma, Vt = svds(data_matrix_demeaned, k=20)
sigma = np.diag(sigma)

all_user_predicted_ratings = np.dot(np.dot(U, sigma), Vt) + data_matrix_mean.reshape(-1, 1)

print(all_user_predicted_ratings)
