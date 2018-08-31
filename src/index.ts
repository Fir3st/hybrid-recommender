import ContentBasedRecommender from './classes/ContentBasedRecommender';
import CollaborativeFilteringRecommender from './classes/CollaborativeFilteringRecommender';
import { addUserRating, sliceAndDice, getMovieIndexByTitle } from './utils/common';
import { prepareRatings } from './utils/preparation';
const MOVIES_DATA = require('./data/movies_data.json').data;
const RATINGS_DATA = require('./data/ratings_data.json').data;
const ME_USER_ID = 0;

const cbRecommender = new ContentBasedRecommender({
    minScore: 0.5,
    maxSimilarDocuments: 50,
    debug: false,
    numberOfTopics: 34
});
const cbfRecommender = new CollaborativeFilteringRecommender();

const ME_USER_RATINGS = [
    addUserRating(ME_USER_ID, 'Jurassic Park', '5.0', MOVIES_DATA),
    addUserRating(ME_USER_ID, 'Men in Black II', '4.0', MOVIES_DATA),
    addUserRating(ME_USER_ID, 'Harry Potter and the Deathly Hallows: Part 1', '1.0', MOVIES_DATA),
    addUserRating(ME_USER_ID, 'Harry Potter and the Deathly Hallows: Part 2', '1.0', MOVIES_DATA),
    addUserRating(ME_USER_ID, 'Kung Fu Panda 2', '5.0', MOVIES_DATA),
    addUserRating(ME_USER_ID, 'Hotel Transylvania', '5.0', MOVIES_DATA),
    addUserRating(ME_USER_ID, 'How to Train Your Dragon', '5.0', MOVIES_DATA),
    addUserRating(ME_USER_ID, 'Rise of the Guardians', '5.0', MOVIES_DATA),
    addUserRating(ME_USER_ID, 'Abraham Lincoln: Vampire Hunter', '3.0', MOVIES_DATA),
    addUserRating(ME_USER_ID, 'The Dictator', '4.0', MOVIES_DATA),
    addUserRating(ME_USER_ID, 'Prince of Persia: The Sands of Time', '3.0', MOVIES_DATA)
];

const { ratingsByUser, ratingsByMovie } = prepareRatings([...ME_USER_RATINGS, ...RATINGS_DATA]);

console.log('User-Based Cosine Similarity \n');

const cfUserBasedRecommendation = cbfRecommender.predictWithCfUserBased(
    ratingsByUser,
    ratingsByMovie,
    ME_USER_ID
);
console.log(sliceAndDice(cfUserBasedRecommendation, MOVIES_DATA, 10, true));

console.log('Item-Based Cosine Similarity \n');

const cfItemBasedRecommendation = cbfRecommender.predictWithCfItemBased(
    ratingsByUser,
    ratingsByMovie,
    ME_USER_ID
);
console.log(sliceAndDice(cfItemBasedRecommendation, MOVIES_DATA, 10, true));

/* cbRecommender.train(MOVIES_DATA.slice(0, 6000));

const similarDocuments = cbRecommender.getSimilarDocuments(
    getMovieIndexByTitle(MOVIES_DATA, 'Jurassic Park').id,
    0,
    10
);

console.log('Content-based filtering');

console.log(sliceAndDice(similarDocuments, MOVIES_DATA, 10, true)); */
