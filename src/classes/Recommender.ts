export default class Recommender {
    protected parseIds(result): number[] {
        let movieIds = [];
        if (result && result.length === 1) {
            let resultString = result[0].trim();
            resultString = resultString.replace(/ +/g, ',');
            resultString = resultString
                .replace('[,', '')
                .replace('[', '')
                .replace(']', '');

            movieIds = resultString.split(',');
        }
        return movieIds;
    }
}
