import ContentBasedRecommender from './classes/ContentBasedRecommender';
import CollaborativeFilteringRecommender from './classes/CollaborativeFilteringRecommender';
import { addUserRating, sliceAndDice } from './utils/common';
import { prepareRatings } from './utils/preparation';
const MOVIES_DATA = require('./data/movies_data.json').data;
const RATINGS_DATA = require('./data/ratings_data.json').data;
const ME_USER_ID = 0;

const cbRecommender = new ContentBasedRecommender({
    minScore: 0.5,
    maxSimilarDocuments: 100,
    debug: true,
    numberOfTopics: 20
});
const cbfRecommender = new CollaborativeFilteringRecommender();

const ME_USER_RATINGS = [
    addUserRating(ME_USER_ID, 'Terminator 3: Rise of the Machines', '5.0', MOVIES_DATA),
    addUserRating(ME_USER_ID, 'Jarhead', '4.0', MOVIES_DATA),
    addUserRating(ME_USER_ID, 'Back to the Future Part II', '3.0', MOVIES_DATA),
    addUserRating(ME_USER_ID, 'Jurassic Park', '4.0', MOVIES_DATA),
    addUserRating(ME_USER_ID, 'Reservoir Dogs', '3.0', MOVIES_DATA),
    addUserRating(ME_USER_ID, 'Men in Black II', '3.0', MOVIES_DATA)
];

const { ratingsByUser, ratingsByMovie } = prepareRatings([...ME_USER_RATINGS, ...RATINGS_DATA]);

console.log('Computing User-Based Cosine Similarity \n');

const cfUserBasedRecommendation = cbfRecommender.predictWithCfUserBased(
    ratingsByUser,
    ratingsByMovie,
    ME_USER_ID
);
console.log(sliceAndDice(cfUserBasedRecommendation, MOVIES_DATA, 10, true));

console.log('Computing Item-Based Cosine Similarity \n');

const cfItemBasedRecommendation = cbfRecommender.predictWithCfItemBased(
    ratingsByUser,
    ratingsByMovie,
    ME_USER_ID
);
console.log(sliceAndDice(cfItemBasedRecommendation, MOVIES_DATA, 10, true));

/* cbRecommender.train(MOVIES_DATA.data.slice(0, 500));

const similarDocuments = cbRecommender.getSimilarDocuments('110', 0, 10);

console.log('Content-based filtering', similarDocuments); */
