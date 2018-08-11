/*
* Based on https://github.com/awaisathar/lda.js
*/
import * as natural from 'natural';
import * as sw from 'stopword';
import * as striptags from 'striptags';
import { Matrix } from 'ml-matrix';

const { PorterStemmer } = natural;
const tokenizer = new natural.WordTokenizer();

export class LDA {
    private documents = [];
    private z;
    private nw;
    private nd;
    private nwsum;
    private ndsum;
    private thetasum;
    private phisum;
    private V;
    private K;
    private alpha;
    private beta;
    private THIN_INTERVAL = 20;
    private BURN_IN = 100;
    private ITERATIONS = 1000;
    private SAMPLE_LAG;
    private dispcol = 0;
    private numstats = 0;

    private configure (v, iterations, burnIn, thinInterval, sampleLag) {
        this.ITERATIONS = iterations;
        this.BURN_IN = burnIn;
        this.THIN_INTERVAL = thinInterval;
        this.SAMPLE_LAG = sampleLag;
        this.V = v;
        this.dispcol = 0;
        this.numstats = 0;
    }

    private initialState (K) {
        const M = this.documents.length;
        this.nw = Matrix.zeros(this.V, K);
        this.nd = Matrix.zeros(M, K);
        this.nwsum = Matrix.zeros(K, 1);
        this.ndsum = Matrix.zeros(M, 1);
        this.z = Array(M).fill(null);

        for (let m = 0; m < M; m = m + 1) {
            const N = this.documents[m].length;
            this.z[m] = [];
            for (let n = 0; n < N; n++) {
                const topic = Math.random() * K;
                this.z[m][n] = topic;
                this.nw[this.documents[m][n]][topic]++;
                this.nd[m][topic]++;
                this.nwsum[topic]++;
            }
            this.ndsum[m] = N;
        }
    }

    private gibbs (K, alpha, beta) {
        let i;
        this.K = K;
        this.alpha = alpha;
        this.beta = beta;
        if (this.SAMPLE_LAG > 0) {
            this.thetasum = Matrix.zeros(this.documents.length, this.K);
            this.phisum = Matrix.zeros(this.K, this.V);
            this.numstats = 0;
        }
        this.initialState(K);
        for (i = 0; i < this.ITERATIONS; i++) {
            for (let m = 0; m < this.z.length; m++) {
                for (let n = 0; n < this.z[m].length; n++) {
                    const topic = this.sampleFullConditional(m, n);
                    this.z[m][n] = topic;
                }
            }
            if ((i < this.BURN_IN) && (i % this.THIN_INTERVAL === 0)) {
                this.dispcol++;
            }
            if ((i > this.BURN_IN) && (i % this.THIN_INTERVAL === 0)) {
                this.dispcol++;
            }
            if ((i > this.BURN_IN) && (this.SAMPLE_LAG > 0) && (i % this.SAMPLE_LAG === 0)) {
                this.updateParams();
                if (i % this.THIN_INTERVAL !== 0) {
                    this.dispcol++;
                }
            }
            if (this.dispcol >= 100) {
                this.dispcol = 0;
            }
        }
    }

    private sampleFullConditional (m, n) {
        let topic = this.z[m][n];
        this.nw[this.documents[m][n]][topic]--;
        this.nd[m][topic]--;
        this.nwsum[topic]--;
        this.ndsum[m]--;
        const p = Matrix.zeros(this.K, 1);
        for (let k = 0; k < this.K; k++) {
            p[k] = (this.nw[this.documents[m][n]][k] + this.beta) / (this.nwsum[k] + this.V * this.beta)
                * (this.nd[m][k] + this.alpha) / (this.ndsum[m] + this.K * this.alpha);
        }
        for (let k = 1; k < p.length; k++) {
            p[k] += p[k - 1];
        }
        const u = Math.random() * p[this.K - 1];
        for (topic = 0; topic < p.length; topic++) {
            if (u < p[topic]) {
                break;
            }
        }
        this.nw[this.documents[m][n]][topic]++;
        this.nd[m][topic]++;
        this.nwsum[topic]++;
        this.ndsum[m]++;

        return topic;
    }

    private updateParams() {
        for (let m = 0; m < this.documents.length; m++) {
            for (let k = 0; k < this.K; k++) {
                this.thetasum[m][k] += (this.nd[m][k] + this.alpha) / (this.ndsum[m] + this.K * this.alpha);
            }
        }
        for (let k = 0; k < this.K; k++) {
            for (let w = 0; w < this.V; w++) {
                this.phisum[k][w] += (this.nw[w][k] + this.beta) / (this.nwsum[k] + this.V * this.beta);
            }
        }
        this.numstats++;
    }

    private getTheta() {
        const theta = [];
        for (let i = 0; i < this.documents.length; i++) theta[i] = [];
        if (this.SAMPLE_LAG > 0) {
            for (let m = 0; m < this.documents.length; m++) {
                for (let k = 0; k < this.K; k++) {
                    theta[m][k] = this.thetasum[m][k] / this.numstats;
                }
            }
        } else {
            for (let m = 0; m < this.documents.length; m++) {
                for (let k = 0; k < this.K; k++) {
                    theta[m][k] = (this.nd[m][k] + this.alpha) / (this.ndsum[m] + this.K * this.alpha);
                }
            }
        }
        return theta;
    }

    private getPhi() {
        const phi = []; for (let i = 0; i < this.K; i++) phi[i] = [];
        if (this.SAMPLE_LAG > 0) {
            for (let k = 0; k < this.K; k++) {
                for (let w = 0; w < this.V; w++) {
                    phi[k][w] = this.phisum[k][w] / this.numstats;
                }
            }
        } else {
            for (let k = 0; k < this.K; k++) {
                for (let w = 0; w < this.V; w++) {
                    phi[k][w] = (this.nw[w][k] + this.beta) / (this.nwsum[k] + this.V * this.beta);
                }
            }
        }
        return phi;
    }

    public process(docs, numberOfTopics = 3, alpha = 0.1, beta = 0.1, topTerms = 30) {
        const result: any = {
            topics: [],
            docs: []
        };
        const f = {};
        const vocab = [];
        let docCount = 0;
        for (let i = 0; i < docs.length; i++) {
            console.log(`Processing document ${i + 1} of ${docs.length}`);
            const tmpString = striptags(docs[i].content, [], ' ').toLowerCase();
            // TODO: Add tf-idf
            if (tmpString === '') continue;
            const tokens = tokenizer.tokenize(tmpString);
            const words = sw.removeStopwords(tokens);
            const wordIndices = [];
            // TODO: Add NGrams
            for (const word of words) {
                const w = PorterStemmer.stem(word);
                if (f[w]) {
                    f[w] = f[w] + 1;
                } else if (w) {
                    f[w] = 1;
                    vocab.push(w);
                }
                wordIndices.push(vocab.indexOf(w));
            }
            if (wordIndices && wordIndices.length > 0) {
                this.documents[docCount++] = wordIndices;
            }
        }

        const V = vocab.length;
        const M = this.documents.length;
        const K = numberOfTopics;
        this.configure(V, 5000, 1000, 100, 10);
        this.gibbs(K, alpha, beta);
        const theta = this.getTheta();
        const phi = this.getPhi();
        // topics
        const topicText = [];
        for (let k = 0; k < phi.length; k++) {
            const tuples = [];
            for (let w = 0; w < phi[k].length; w++) {
                tuples.push('' + phi[k][w].toPrecision(2) + '_' + vocab[w]);
            }
            tuples.sort().reverse();
            topicText[k] = '';
            const topic = {
                number: k,
                terms: []
            };
            const size = (topTerms > vocab.length) ? topTerms : vocab.length;
            for (let t = 0; t < size; t++) {
                const topicTerm = tuples[t].split('_')[1];
                const prob = tuples[t].split('_')[0] * 100;
                if (prob < 0.0001) continue;
                topic.terms.push({ term: topicTerm, probability: prob });
            }
            result.topics.push(topic);
        }
        for (let m = 0; m < theta.length; m++) {
            const doc = {
                documentId: docs[m].id,
                topics: {
                }
            };
            for (let k = 0; k < theta[m].length; k++) {
                doc.topics[k] = theta[m][k] * 100;
            }
            result.docs.push(doc);
        }

        return result;
    }
}
