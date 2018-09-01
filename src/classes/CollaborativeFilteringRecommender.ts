import * as PythonShell from 'python-shell';

export default class CBFRecommender {
    public run() {
        const options = {
            args: [
                '1',
                `${process.cwd()}/src/data/ratings_data.json`
            ]
        };

        PythonShell.run('python/collaborative_filtering.py', options, (err, result) => {
            if (err) throw err;
            console.log(result);
        });
    }
}
