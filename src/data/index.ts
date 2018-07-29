import axios from 'axios';
import * as csv from 'fast-csv';
import * as fs from 'fs';
import * as config from 'config';

const movies = {
    data: []
};

csv
    .fromPath('src/data/links.csv')
    .on('data', (data) => {
        const movie = {
            id: data[0],
            imdbId: data[1]
        };
        /* axios.post('http://imdbapi.net/api', { key: config.get('imdbApiKey'), id: movie.imdbId }).then((response) => {
            console.log(response.data);
        }); */
        movies.data.push(movie);
    })
    .on('end', () => {
        fs.writeFile('src/data/data.json', JSON.stringify(movies), (err) => {
            if (err) {
                console.log(err);
            }
        });
    });
