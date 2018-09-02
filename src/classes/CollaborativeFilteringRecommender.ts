import * as PythonShell from 'python-shell';

export default class CBFRecommender {
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
            PythonShell.run('python/user_based_cbf.py', options, (err, result) => {
                if (err) {
                    reject(err);
                }
                let movieIds = [];
                if (result && result.length === 1) {
                    let resultString = result[0].trim();
                    resultString = resultString.replace(/ +/g, ',');
                    resultString = resultString.replace('[,', '').replace(']', '');

                    movieIds = resultString.split(',');
                }
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
            PythonShell.run('python/item_based_cbf.py', options, (err, result) => {
                if (err) {
                    reject(err);
                }
                let movieIds = [];
                if (result && result.length === 1) {
                    let resultString = result[0].trim();
                    resultString = resultString.replace(/ +/g, ',');
                    resultString = resultString.replace('[,', '').replace(']', '');

                    movieIds = resultString.split(',');
                }
                resolve(movieIds);
            });
        });
    }
}
