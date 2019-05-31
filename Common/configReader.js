var MongoClient = require('mongodb').MongoClient;
require('./constants');
var url = MONGO_URL;

var key = "null";
MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(MONGO_DB);
    var query = {
        address: "Park Lane 38"
    };
    dbo.collection("blabla").find(query).toArray(function (err, result) {
        if (err) throw err;
        console.log(result);

        key = result;

        db.close();
    });
});


function getAPI_Key() {
    return key;
}