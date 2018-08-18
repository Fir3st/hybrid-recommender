import * as similarity from 'compute-cosine-similarity';

export function sortByScore(recommendation) {
    return recommendation.sort((a, b) => b.score - a.score);
}

// X x 1 row vector based on similarities of movies
// 1 equals similar, -1 equals not similar, 0 equals orthogonal
// Whole matrix is too computational expensive for 45.000 movies
// https://en.wikipedia.org/wiki/Cosine_similarity
export function getCosineSimilarityRowVector(matrix, index) {
    return matrix.map((rowRelative, i) => {
        return similarity(matrix[index], matrix[i]);
    });
}

export function addUserRating(userId, searchTitle, rating, MOVIES_IN_LIST) {
    const { id } = getMovieIndexByTitle(MOVIES_IN_LIST, searchTitle);

    return {
        userId,
        rating,
        movieId: id
    };
}

export function getMovieIndexByTitle(MOVIES_IN_LIST, query) {
    const index = MOVIES_IN_LIST.map(movie => movie.title).indexOf(query);

    if (!index) {
        throw new Error('Movie not found');
    }

    const { title, id } = MOVIES_IN_LIST[index];
    return { title, id };
}

export function moviesById(movies) {
    const result = {};
    movies.map((movie) => {
        result[movie.id] = movie;
    });
    return result;
}

export function sliceAndDice(recommendations, MOVIES, count, onlyTitle) {
    const movies = moviesById(MOVIES);
    let recommends = recommendations.filter(recommendation => movies[recommendation.movieId]);

    recommends = onlyTitle
        ? recommends.map(mr => ({ title: movies[mr.movieId].title, score: mr.score }))
        : recommends.map(mr => ({ movie: movies[mr.movieId], score: mr.score }));

    return recommends
        .slice(0, count);
}
