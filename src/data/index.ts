import axios from 'axios';
import * as csv from 'csvtojson';
import * as fs from 'fs';
import * as config from 'config';
import { TaskQueue } from 'cwait';

const movies = {
    data: []
};

csv()
    .fromFile('src/data/links.csv')
    .then((data) => {
        const queue = new TaskQueue(Promise, 5);
        return Promise.all(data.map(queue.wrap((mov) => {
            const movie: any = {
                id: mov.movieId,
                imdbId: mov.imdbId
            };
            console.log(`Getting data for ${movie.id}`);
            return axios.post('http://imdbapi.net/api', { key: config.get('imdbApiKey'), id: movie.imdbId }).then((response) => {
                movie.title = response.data.title;
                movie.genre = response.data.genre;
                movie.content = response.data.plot;
            }).then(() => {
                console.log(`Pushing ${movie.id} into array`);
                movies.data.push(movie);
            })
            .catch(error => console.log(error));
        })));
    })
    .then(() => {
        console.log('Writing to file');
        fs.writeFile('src/data/data.json', JSON.stringify(movies), (err) => {
            if (err) {
                console.log(err);
            }
        });
    });
