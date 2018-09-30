import CollaborativeFilteringRecommender from './classes/CollaborativeFilteringRecommender';
import ContentBasedRecommender from './classes/ContentBasedRecommender';
import { getMoviesByIds, getMovieIndexByTitle } from './utils/common';
const moviesData = require('./data/movies_data').data;

const cfRecommender = new CollaborativeFilteringRecommender();
const cbRecommender = new ContentBasedRecommender();

const run = async () => {
    const userId = 1000;
    const numOfMovies = 10;
    const movieName = 'Jurassic Park';
    const movieId = getMovieIndexByTitle(moviesData, movieName).id;

    try {
        /* console.log('User-based collaborative filtering results:');
        const ubRecommends = await cfRecommender.recommendUserBased(userId, numOfMovies);
        console.log(getMoviesByIds(ubRecommends, moviesData));

        console.log('Item-based collaborative filtering results:');
        const ibRecommends = await cfRecommender.recommendItemBased(userId, numOfMovies);
        console.log(getMoviesByIds(ibRecommends, moviesData));

        console.log('SVD collaborative filtering results:');
        const svdRecommends = await cfRecommender.recommendSVDBased(userId, numOfMovies);
        console.log(getMoviesByIds(svdRecommends, moviesData)); */

        console.log(`Content-based (TF-IDF) results for movie ${movieName}:`);
        const tfidfRecommends = await cbRecommender.recommendTfIdfBased(movieId, numOfMovies);
        console.log(getMoviesByIds(tfidfRecommends, moviesData));

        console.log(`Content-based (LDA) results for movie ${movieName}:`);
        const ldaRecommends = await cbRecommender.recommendLDABased(movieId, numOfMovies);
        console.log(getMoviesByIds(ldaRecommends, moviesData));
    } catch (error) {
        console.log(error);
    }
};

run();
