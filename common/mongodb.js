const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://test:test123456@logz-for-all-wxd9m.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, {useNewUrlParser: true});
const connection = client.connect();

const dbName = 'logz';
const collecrtionName = 'logz';


const getDoc = function (integrationId, callback) {
    connection.then(() => {
        const db = client.db(dbName);
        const coll = db.collection(collecrtionName);
        coll.findOne({integrationId: integrationId}, (err, result) => {
            if (err)
                console.log(err);

            callback(result);
        });
    });
};

const setDoc = function(integrationId, object) {
    connection.then(() => {
        const db = client.db(dbName);
        const coll = db.collection(collecrtionName);
        coll.findOne({integrationId: integrationId}, (err, result) => {
            if (err)
                console.log(err);

            callback(result);
        });
    });
};

module.exports = {
    getDoc,
    setDoc,
};