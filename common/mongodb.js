const MongoClient = require('mongodb').MongoClient;
const constants = require('./constants');


const uri = "mongodb+srv://test:test123456@logz-for-all-wxd9m.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, {useNewUrlParser: true});
const connection = client.connect();

const dbName = 'logz';
const collecrtionName = 'logz';


const getDoc = function (integrationId) {
    return new Promise((resolve, reject) => {
        connection.then(() => {
            const db = client.db(dbName);
            const coll = db.collection(collecrtionName);
            coll.findOne({integrationId: integrationId}, (err, result) => {
                if (err)
                    reject(err);

                resolve(result);
            });

        });
    });
};

const setDoc = async function (integrationId, object) {
    connection.then(async () => {
        const db = client.db(dbName);
        const coll = db.collection(collecrtionName);
        await coll.findOneAndUpdate({}, {$set: object});
    });
};

const getLogzCollection = function () {
    return new Promise((resolve, reject) => {
        connection.then(() => {
            const db = client.db(dbName);
            const coll = db.collection(collecrtionName);
            coll.find().toArray((err, result) => {
                if (err)
                    reject(err);

                resolve(result);
            });
        });
    });
};

module.exports = {
    getDoc,
    setDoc,
    getLogzCollection
};