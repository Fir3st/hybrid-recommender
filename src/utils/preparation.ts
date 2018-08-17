export function prepareDataByUser(data) {
    const ratingsByUser = {
        data: {}
    };

    data.forEach((element) => {
        if (element.userId in ratingsByUser.data) {
            ratingsByUser.data[element.userId][element.movieId] = {
                rating: Number.parseFloat(element.rating),
                timestamp: element.timestamp
            };
        } else {
            ratingsByUser.data[element.userId] = {};
            ratingsByUser.data[element.userId][element.movieId] = {
                rating: Number.parseFloat(element.rating),
                timestamp: element.timestamp
            };
        }
    });

    return ratingsByUser;
}

export function prepareDataByMovie(data) {
    const ratingsByMovie = {
        data: {}
    };

    data.forEach((element) => {
        if (element.movieId in ratingsByMovie.data) {
            ratingsByMovie.data[element.movieId][element.userId] = {
                rating: Number.parseFloat(element.rating),
                timestamp: element.timestamp
            };
        } else {
            ratingsByMovie.data[element.movieId] = {};
            ratingsByMovie.data[element.movieId][element.userId] = {
                rating: Number.parseFloat(element.rating),
                timestamp: element.timestamp
            };
        }
    });

    return ratingsByMovie;
}
