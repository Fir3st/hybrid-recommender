import * as PythonShell from 'python-shell';
import Recommender from './Recommender';

export default class CBRecommender extends Recommender {
    private dataSource = `${process.cwd()}/src/data/movies_data.json`;

    public recommendTfIdfBased(id, count = 10) {
        const options = {
            args: [
                id,
                count,
                this.dataSource
            ]
        };

        return new Promise((resolve, reject) => {
            PythonShell.run('python/tfidf_cbf.py', options, (err, result) => {
                if (err) {
                    reject(err);
                }
                const movieIds = this.parseIds(result);
                resolve(movieIds);
            });
        });
    }
}
