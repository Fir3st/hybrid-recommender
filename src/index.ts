import ContentBasedRecommender from './classes/ContentBasedRecommender';
const movies = require('./data/data.json');

const cbRecommender = new ContentBasedRecommender({
    minScore: 0.9,
    maxSimilarDocuments: 100,
    debug: true,
    numberOfTopics: 8
});

cbRecommender.train(movies.data);

const similarDocuments = cbRecommender.getSimilarDocuments('1', 0, 10);

console.log(similarDocuments);
