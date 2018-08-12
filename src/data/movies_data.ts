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
        const queue = new TaskQueue(Promise, 10);
        return Promise.all(data.map(queue.wrap((mov) => {
            const movie: any = {
                id: mov.movieId,
                imdbId: mov.imdbId
            };
            console.log(`Getting data for ${movie.id}`);
            return axios.get(`http://www.omdbapi.com/?i=tt${movie.imdbId}&apikey=${config.get('omdbApiKey')}&plot=full`).then((response) => {
                movie.title = response.data.Title;
                movie.genre = response.data.Genre;
                movie.content = response.data.Plot;
                movie.poster = response.data.Poster;
                movie.rating = response.data.imdbRating;
            }).then(() => {
                console.log(`Pushing ${movie.id} into array`);
                movies.data.push(movie);
            })
            .catch(error => console.log(error));
        })));
    })
    .then(() => {
        console.log('Writing to file');
        fs.writeFile('src/data/movies_data.json', JSON.stringify(movies), (err) => {
            if (err) {
                console.log(err);
            }
        });
    });
