import ContentBasedRecommender from './classes/ContentBasedRecommender';
const movies = require('./data/data.json');

const cbRecommender = new ContentBasedRecommender({
    minScore: 0.5,
    maxSimilarDocuments: 100,
    debug: true,
    numberOfTopics: 20
});

cbRecommender.train(movies.data.slice(0, 500));

const similarDocuments = cbRecommender.getSimilarDocuments('110', 0, 10);

console.log(similarDocuments);
