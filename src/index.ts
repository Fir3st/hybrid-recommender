import CollaborativeFilteringRecommender from './classes/CollaborativeFilteringRecommender';
import { getMoviesByIds } from './utils/common';
const moviesData = require('./data/movies_data').data;

const cfRecommender = new CollaborativeFilteringRecommender();

const run = async () => {
    try {
        const movieIds = await cfRecommender.recommendUserBased(1, 5);
        console.log(getMoviesByIds(movieIds, moviesData));
    } catch (error) {
        console.log(error);
    }
};

run();
