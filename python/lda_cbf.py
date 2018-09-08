import sys
import pandas as pd
from sklearn.metrics.pairwise import pairwise_distances
import warnings
warnings.filterwarnings(action='ignore', category=UserWarning, module='gensim')
import gensim
from gensim import corpora, models
from nltk.stem import WordNetLemmatizer
from nltk.stem.porter import *
import numpy as np
import nltk
from sklearn.neighbors import NearestNeighbors

nltk.download('wordnet', quiet=True)
np.random.seed(2018)
stemmer = PorterStemmer()
metric = 'cosine'
k = 10

def lemmatize_stemming(text):
    return stemmer.stem(WordNetLemmatizer().lemmatize(text, pos='v'))

def preprocess(text):
    result = []
    for token in gensim.utils.simple_preprocess(text):
        if token not in gensim.parsing.preprocessing.STOPWORDS and len(token) > 3:
            result.append(lemmatize_stemming(token))
    return result

data = pd.read_json(sys.argv[3], orient='split')
data.set_index('id', inplace=True)
documents = data['content']

processed_docs = documents.map(preprocess)

dictionary = gensim.corpora.Dictionary(processed_docs)
dictionary.filter_extremes(no_below=15, no_above=0.5, keep_n=100000)
corpus = [dictionary.doc2bow(doc) for doc in processed_docs]

lda = gensim.models.ldamodel.LdaModel(corpus, num_topics=30, id2word=dictionary, passes=2, minimum_probability=0.0)
docs_topics = np.array([[tup[1] for tup in lst] for lst in lda[corpus]])
df_docs_topics = pd.DataFrame(docs_topics, index=data.index)

def recommend(item_id, matrix, metric = metric, k=k):
    similarities=[]
    indices=[]
    model_knn = NearestNeighbors(metric = metric, algorithm = 'brute') 
    model_knn.fit(matrix)

    distances, indices = model_knn.kneighbors(matrix.iloc[item_id, :].values.reshape(1, -1), n_neighbors = k+1)
    similarities = 1 - distances.flatten()
            
    return similarities, indices

similarities, indices = recommend(item_id=int(sys.argv[1]), matrix=df_docs_topics, k=int(sys.argv[2]))
recommended = indices.flatten()

print(np.delete(recommended, np.where(recommended == int(sys.argv[1]))))

