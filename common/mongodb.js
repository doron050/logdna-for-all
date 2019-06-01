const MongoClient = require('mongodb').MongoClient;
const constants = require('./constants');

const connectionString = constants.DB.urlPrefix + constants.DB.userName + ":" + constants.DB.password + "@" + constants.DB.url + constants.DB.scheme + constants.DB.connectionParamsString;
//const uri = "mongodb+srv://test:test123456@logz-for-all-wxd9m.mongodb.net/test?retryWrites=true&w=majority";
 
const client = new MongoClient(connectionString, {useNewUrlParser: true});
const connection = client.connect();

const getDoc = function (configurationId) {
    return new Promise((resolve, reject) => {
        connection.then(() => {
            const db = client.db(constants.DB.dbName);
            const coll = db.collection(constants.DB.collectionName);
            coll.findOne({configurationId: configurationId}, (err, result) => {
                if (err)
                    reject(err);

                resolve(result);
            });

        });
    });
};

const upsertDoc = async function (configurationId, object) {
    await connection;
    const db = client.db(constants.DB.dbName);
    const coll = db.collection(constants.DB.collectionName);
    await coll.updateOne({configurationId: configurationId}, {$set: object}, {upsert: true});
};

const getLogzCollection = function () {
    return new Promise((resolve, reject) => {
        connection.then(() => {
            const db = client.db(constants.DB.dbName);
            const coll = db.collection(constants.DB.collectionName);
            coll.find().toArray((err, result) => {
                if (err)
                    reject(err);

                resolve(result);
            });
        });
    });
};

const upsertLastSentLogTimestamp  = async function (configurationId,projectID, lastSentLogTimestamp ) {
    await connection;
    const db = client.db(constants.DB.dbName);
    const coll = db.collection(constants.DB.collectionName);
    await coll.updateOne(
        {configurationId: configurationId, 'projects.projectId': projectID},
        {$set: {'projects.$.lastSentLogTimestamp': lastSentLogTimestamp }},
        {upsert: true});
};


module.exports = {
    getDoc,
    upsertDoc,
    getLogzCollection,
    upsertLastSentLogTimestamp 
};