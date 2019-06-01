const MongoClient = require('mongodb').MongoClient;
const constants = require('./constants');

const client = new MongoClient(constants.MONGO_CONNECTION_STRING, {useNewUrlParser: true});
let connection = client.connect();

function isConnected() {
    return !!client && !!client.topology && client.topology.isConnected()
}

function initConnction() {
    return new Promise((resolve, reject) => {
        if (isConnected()) {
            resolve();
            return;
        }

        connection.then(() => {
            resolve();
        }).catch((e) => {
            console.log(constants.LOG_MESSAGES.DB_FAILED_TO_CONNECT_FIRST_TRY, e);
            connection = client.connect();

            connection.then(() => {
                resolve();
            }).catch((e) => {
                console.log(constants.LOG_MESSAGES.DB_FAILED_TO_CONNECT_SECOND_TRY, e);
            });
        });
    });
}


const getDoc = function (configurationId) {
    return new Promise((resolve, reject) => {
        initConnction().then(() => {
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
    await initConnction();
    const db = client.db(constants.DB.dbName);
    const coll = db.collection(constants.DB.collectionName);
    await coll.updateOne({configurationId: configurationId}, {$set: object}, {upsert: true});
};

const getLogzCollection = function () {
    return new Promise((resolve, reject) => {
        initConnction().then(() => {
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

<<<<<<< HEAD
const upsertLastSentLogTimestamp  = async function (configurationId,projectID, lastSentLogTimestamp ) {
    await connection;
=======
const upsertLastLogID = async function (configurationId, projectID, lastLogID) {
    await initConnction();
>>>>>>> a4ae09799bf763e2e2fe112e74ee125c1cfd0a6e
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