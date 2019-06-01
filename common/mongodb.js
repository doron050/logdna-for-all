const MongoClient = require('mongodb').MongoClient;
const constants = require('./constants');

const connectionString = constants.DB.urlPrefix + constants.DB.userName + ":" + constants.DB.password + "@" + constants.DB.url + constants.DB.scheme + constants.DB.connectionParamsString;
//const uri = "mongodb+srv://test:test123456@logz-for-all-wxd9m.mongodb.net/test?retryWrites=true&w=majority";

const client = new MongoClient(connectionString, {useNewUrlParser: true});
let connection = getConnection();

async function getConnection(){

    if (!connection || !connection.connectionStatus.ok){

        connection = await client.connect();

        console.log(constants.LOG_MESSAGES.INIT_DB_CONNECTION);
    }

    return (connection);
}

const getDoc = function (configurationId) {
    return new Promise((resolve, reject) => {
        getConnection().then(() => {
            const db = client.db(dbName);
            const coll = db.collection(collectionName);
            coll.findOne({configurationId: configurationId}, (err, result) => {
                if (err)
                    reject(err);

                resolve(result);
            });

        });
    });
};

const upsertDoc = async function (configurationId, object) {
    await getConnection();
    const db = client.db(dbName);
    const coll = db.collection(collectionName);
    await coll.updateOne({configurationId: configurationId}, {$set: object}, {upsert: true});
};

const getLogzCollection = function () {
    return new Promise((resolve, reject) => {
        getConnection().then(() => {
            const db = client.db(dbName);
            const coll = db.collection(collectionName);
            coll.find().toArray((err, result) => {
                if (err)
                    reject(err);

                resolve(result);
            });
        });
    });
};


const upsertLastLogID = async function (configurationId,projectID, lastLogID) {
    await connection;
    const db = client.db(dbName);
    const coll = db.collection(collecrtionName);
    await coll.updateOne(
        {configurationId: configurationId, 'projects.projectId': projectID},
        {$set: {'projects.$.lastSentLogId': lastLogID}},
        {upsert: true});
};

module.exports = {
    getDoc,
    upsertDoc,
    getLogzCollection,
    upsertLastLogID
};