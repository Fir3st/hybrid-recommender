import sys
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
tf = TfidfVectorizer(analyzer='word', ngram_range=(1, 3), min_df=0, stop_words='english')

data = pd.read_json(sys.argv[3], orient='split')
tfidf_matrix = tf.fit_transform(data['content'])
cosine_similarities = cosine_similarity(tfidf_matrix, tfidf_matrix)

ids = data['id']
indices = pd.Series(data.index, index=data['id'])

def recommend(id, k):
    idx = indices[int(id)]
    sim_scores = list(enumerate(cosine_similarities[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:int(k) + 1]
    movie_indices = [i[0] for i in sim_scores]

    return np.array(ids.iloc[movie_indices])

print(recommend(sys.argv[1], sys.argv[2]))

sys.stdout.flush()
