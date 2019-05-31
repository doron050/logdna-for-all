const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://test:test123456@logz-for-all-wxd9m.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, {useNewUrlParser: true});
const connection = client.connect();


// connection.then(() => {
//     const doc = {id: 3};
//     const db = client.db('database_name');
//     const coll = db.collection('collection_name');
//     coll.insertOne(doc, (err, result) => {
//         if (err) throw err
//     })
// });
//

// const getDoc = async function (integrationId) {
//     await connection;
//     const doc = {id: 3};
//     const db = client.db('logz');
//     const coll = db.collection('collection_name');
//     coll.insertOne(doc, (err, result) => {
//         if (err) throw err
//     })
// };

module.exports = {
    getDoc,
};