import ContentBasedRecommender from './classes/ContentBasedRecommender';

const cbRecommender = new ContentBasedRecommender({
    minScore: 0.9,
    maxSimilarDocuments: 100,
    debug: true
});

const documents = [
    { id: '1000001', title: 'A', content: 'Why studying javascript is fun?' },
    { id: '1000002', title: 'B', content: 'The trend for javascript in machine learning' },
    { id: '1000003', title: 'C', content: 'The most insightful stories about JavaScript' },
    { id: '1000004', title: 'D', content: 'Introduction to Machine Learning' },
    { id: '1000005', title: 'E', content: 'Machine learning and its application' },
    { id: '1000006', title: 'F', content: 'Python vs Javascript, which is better?' },
    { id: '1000007', title: 'G', content: 'How Python saved my life?' },
    { id: '1000008', title: 'H', content: 'The future of Bitcoin technology' },
    { id: '1000009', title: 'I', content: 'Is it possible to use javascript for machine learning?' }
];

cbRecommender.train(documents);

const similarDocuments = cbRecommender.getSimilarDocuments('1000002', 0, 10);

console.log(similarDocuments);
