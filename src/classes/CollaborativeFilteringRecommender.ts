import * as PythonShell from 'python-shell';

export default class CBFRecommender {
    private dataSource = `${process.cwd()}/src/data/ratings_data.json`;

    public recommendUserBased(id): void {
        const options = {
            args: [
                id,
                this.dataSource
            ]
        };

        PythonShell.run('python/user_based_cbf.py', options, (err, result) => {
            if (err) throw err;
            console.log(result);
        });
    }
}
