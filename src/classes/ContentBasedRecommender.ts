/*
* Based on https://github.com/stanleyfok/content-based-recommender
*/

import * as _ from 'lodash';
import * as similarity from 'compute-cosine-similarity';
import { LDA } from '../algorithms/lda';

interface IOptions {
    maxVectorSize?: number;
    maxSimilarDocuments?: number;
    minScore?: number;
    numberOfTopics?: number;
    debug?: boolean;
}

const defaultOptions: IOptions = {
    maxVectorSize: 100,
    maxSimilarDocuments: Number.MAX_SAFE_INTEGER,
    minScore: 0,
    numberOfTopics: 5,
    debug: false
};

export default class CBRecommender {
    private options: IOptions = null;
    private data = {};

    constructor(options: IOptions = null) {
        this.setOptions(options);
        this.data = {};
    }

    public setOptions(options: IOptions = null) {
        // validation
        if ((options.maxVectorSize !== undefined) &&
            (!Number.isInteger(options.maxVectorSize) || options.maxVectorSize <= 0)) {
            throw new Error('The option maxVectorSize should be integer and greater than 0');
        }

        if ((options.maxSimilarDocuments !== undefined) &&
            (!Number.isInteger(options.maxSimilarDocuments) || options.maxSimilarDocuments <= 0)) {
            throw new Error('The option maxSimilarDocuments should be integer and greater than 0');
        }

        if ((options.minScore !== undefined) &&
            (!_.isNumber(options.minScore) || options.minScore < 0 || options.minScore > 1)) {
            throw new Error('The option minScore should be a number between 0 and 1');
        }

        this.options = {
            ...defaultOptions,
            ...options
        };
    }

    public train(documents) {
        this.validateDocuments(documents);

        if (this.options.debug) {
            console.log(`Total documents: ${documents.length}`);
        }

        // step 1 - preprocess the documents
        const preprocessDocs = this.preprocessDocuments(documents, this.options);
        // step 2 - calculate similarities
        this.calculateSimilarities(preprocessDocs, this.options);
    }

    public validateDocuments(documents) {
        if (!_.isArray(documents)) {
            throw new Error('Documents should be an array of objects');
        }

        for (let i = 0; i < documents.length; i += 1) {
            const document = documents[i];

            if (!_.has(document, 'id') || !_.has(document, 'content')) {
                throw new Error('Documents should be have fields id and content');
            }
        }
    }

    public getSimilarDocuments(id, start = 0, size = undefined) {
        let similarDocuments = this.data[id];

        if (similarDocuments === undefined) {
            return [];
        }

        const end = (size !== undefined) ? start + size : undefined;
        similarDocuments = similarDocuments.slice(start, end);

        return similarDocuments;
    }

    private preprocessDocuments(documents, options) {
        if (options.debug) {
            console.log('Preprocessing documents');
        }
        const lda = new LDA();
        const ldaResult = lda.process(documents, options.numberOfTopics);

        return ldaResult.docs;
    }

    private calculateSimilarities(documents, options) {
        // initialize data hash
        for (let i = 0; i < documents.length; i += 1) {
            const document = documents[i];
            const { documentId } = document;

            this.data[documentId] = [];
        }

        // calculate the similar scores
        for (let i = 0; i < documents.length; i += 1) {
            if (options.debug) {
                console.log(`Calculating similarity score for document ${i}`);
            }

            for (let j = 0; j < i; j += 1) {
                const idi = documents[i].documentId;
                const di = Object.values(documents[i].topics);
                const idj = documents[j].documentId;
                const dj = Object.values(documents[j].topics);
                const sim = similarity(di, dj);
                if (options.debug) {
                    console.log(`Similarity: ${sim}`);
                }

                if (sim > options.minScore) {
                    this.data[idi].push({ movieId: idj, score: sim });
                    this.data[idj].push({ movieId: idi, score: sim });
                }
            }
        }

        // finally sort the similar documents by descending order
        Object.keys(this.data).forEach((id) => {
            this.data[id].sort((a, b) => b.score - a.score);

            if (this.data[id].length > options.maxSimilarDocuments) {
                this.data[id] = this.data[id].slice(0, options.maxSimilarDocuments);
            }
        });
    }
}
