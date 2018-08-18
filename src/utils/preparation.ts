export function prepareDataByUser(data) {
    const ratingsByUser = {
    };

    data.forEach((element) => {
        if (element.userId in ratingsByUser) {
            ratingsByUser[element.userId][element.movieId] = {
                rating: Number.parseFloat(element.rating),
                timestamp: element.timestamp
            };
        } else {
            ratingsByUser[element.userId] = {};
            ratingsByUser[element.userId][element.movieId] = {
                rating: Number.parseFloat(element.rating),
                timestamp: element.timestamp
            };
        }
    });

    return ratingsByUser;
}

export function prepareDataByMovie(data) {
    const ratingsByMovie = {
    };

    data.forEach((element) => {
        if (element.movieId in ratingsByMovie) {
            ratingsByMovie[element.movieId][element.userId] = {
                rating: Number.parseFloat(element.rating),
                timestamp: element.timestamp
            };
        } else {
            ratingsByMovie[element.movieId] = {};
            ratingsByMovie[element.movieId][element.userId] = {
                rating: Number.parseFloat(element.rating),
                timestamp: element.timestamp
            };
        }
    });

    return ratingsByMovie;
}

export function prepareRatings(data) {
    return {
        ratingsByUser: prepareDataByUser(data),
        ratingsByMovie: prepareDataByMovie(data)
    };
}
