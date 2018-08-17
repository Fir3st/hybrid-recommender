import * as csv from 'csvtojson';
import * as fs from 'fs';

const ratings = {
    data: {}
};

csv()
    .fromFile('src/data/ratings.csv')
    .then((data: any) => {
        data.forEach((element) => {
            if (element.userId in ratings.data) {
                ratings.data[element.userId][element.movieId] = {
                    rating: Number.parseFloat(element.rating)
                };
            } else {
                ratings.data[element.userId] = {};
                ratings.data[element.userId][element.movieId] = {
                    rating: Number.parseFloat(element.rating)
                };
            }
        });
    })
    .then(() => {
        console.log('Writing to file');
        fs.writeFile('src/data/ratings_data.json', JSON.stringify(ratings), (err) => {
            if (err) {
                console.log(err);
            }
        });
    });
