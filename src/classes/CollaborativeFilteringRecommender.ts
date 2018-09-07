import * as PythonShell from 'python-shell';
import Recommender from './Recommender';

export default class CBFRecommender extends Recommender {
    private dataSource = `${process.cwd()}/src/data/ratings_data.json`;

    public recommendUserBased(id, count = 10) {
        const options = {
            args: [
                id,
                count,
                this.dataSource
            ]
        };

        return new Promise((resolve, reject) => {
            PythonShell.run('python/user_based_cf.py', options, (err, result) => {
                if (err) {
                    reject(err);
                }
                const movieIds = this.parseIds(result);
                resolve(movieIds);
            });
        });
    }

    public recommendItemBased(id, count = 10) {
        const options = {
            args: [
                id,
                count,
                this.dataSource
            ]
        };

        return new Promise((resolve, reject) => {
            PythonShell.run('python/item_based_cf.py', options, (err, result) => {
                if (err) {
                    reject(err);
                }
                const movieIds = this.parseIds(result);
                resolve(movieIds);
            });
        });
    }

    public recommendSVDBased(id, count = 10) {
        const options = {
            args: [
                id,
                count,
                this.dataSource
            ]
        };

        return new Promise((resolve, reject) => {
            PythonShell.run('python/svd_cf.py', options, (err, result) => {
                if (err) {
                    reject(err);
                }
                const movieIds = this.parseIds(result);
                resolve(movieIds);
            });
        });
    }
}
