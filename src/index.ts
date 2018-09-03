import CollaborativeFilteringRecommender from './classes/CollaborativeFilteringRecommender';
import { getMoviesByIds } from './utils/common';
const moviesData = require('./data/movies_data').data;

const cfRecommender = new CollaborativeFilteringRecommender();

const run = async () => {
    const userId = 1;
    const numOfMovies = 10;
    try {
        console.log('User-based collaborative filtering results:');
        console.log(getMoviesByIds(await cfRecommender.recommendUserBased(userId, numOfMovies), moviesData));

        console.log('Item-based collaborative filtering results:');
        console.log(getMoviesByIds(await cfRecommender.recommendItemBased(userId, numOfMovies), moviesData));

        console.log('SVD collaborative filtering results:');
        console.log(getMoviesByIds(await cfRecommender.recommendSVDBased(userId, numOfMovies), moviesData));
    } catch (error) {
        console.log(error);
    }
};

run();
