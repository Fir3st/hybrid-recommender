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
        userId: parseInt(userId, 10),
        rating: parseFloat(rating),
        movieId: parseInt(id, 10)
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

export function sliceAndDice(recommendations, MOVIES_BY_ID, count, onlyTitle) {
    let recommends = recommendations.filter(recommendation => MOVIES_BY_ID[recommendation.movieId]);

    recommends = onlyTitle
        ? recommendations.map(mr => ({ title: MOVIES_BY_ID[mr.movieId].title, score: mr.score }))
        : recommendations.map(mr => ({ movie: MOVIES_BY_ID[mr.movieId], score: mr.score }));

    return recommendations
        .slice(0, count);
}
