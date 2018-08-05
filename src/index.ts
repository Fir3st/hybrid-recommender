import ContentBasedRecommender from './classes/ContentBasedRecommender';
const MOVIES_DATA = require('./data/movies_data.json');
const RATINGS_DATA = require('./data/ratings_data.json');

const cbRecommender = new ContentBasedRecommender({
    minScore: 0.5,
    maxSimilarDocuments: 100,
    debug: true,
    numberOfTopics: 20
});

cbRecommender.train(MOVIES_DATA.data.slice(0, 500));

const similarDocuments = cbRecommender.getSimilarDocuments('110', 0, 10);

console.log(similarDocuments);
