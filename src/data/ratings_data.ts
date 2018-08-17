import * as csv from 'csvtojson';
import * as fs from 'fs';

const ratingsByUser = {
    data: {}
};
const ratingsByMovie = {
    data: {}
};

csv()
    .fromFile('src/data/ratings.csv')
    .then((data: any) => {
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
    })
    .then(() => {
        console.log('Writing to files');
        fs.writeFile('src/data/ratings_data_by_user.json', JSON.stringify(ratingsByUser), (err) => {
            if (err) {
                console.log(err);
            }
        });
        fs.writeFile('src/data/ratings_data_by_movie.json', JSON.stringify(ratingsByMovie), (err) => {
            if (err) {
                console.log(err);
            }
        });
    });
