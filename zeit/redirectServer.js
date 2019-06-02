const url = require('url');
const mongoClient = require('../common/mongodb');
const constants = require('../common/constants');
const httpClient = require('./zeitHttpClient');
const qs = require('qs');
const logger = require('../common/logger');

// Saves this specific token for future use of the zeit api
async function saveDataToMongo(configurationId, access_token, teamId) {
    const updatedFields = {};
    updatedFields.zeitToken = access_token;
    if (teamId)
        updatedFields.teamId = teamId;

    await mongoClient.upsertDoc(configurationId, updatedFields);
}

module.exports = async (req, res) => {
    console.log(`req.method = ${req.method}`);
    console.log(`req.query = ${req.query}`);
    console.log(`req.params = ${req.params}`);
    console.log(`req.body = ${req.body}`);

    if (req.method === 'OPTIONS') {
        const headers = {};
        headers["Access-Control-Allow-Origin"] = "*";
        headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
        headers["Access-Control-Allow-Credentials"] = false;
        headers["Access-Control-Max-Age"] = '86400'; // 24 hours
        headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
        res.writeHead(200, headers);
        res.end();
    }

    // if (req.method === 'DELETE') {
    //     const params = req.params;
    //     const query = req.query;
    //     console.log({params});
    //     console.log({query});
    //     res.end();
    //     return;
    // }

    let query = url.parse(req.url, true).query;

    const newIntegration = {
        teamId: query.teamId, //The teamId of the installation
        configurationId: query.configurationId, //The id of the related configuration
        code: query.code, //OAuth authorization code (you can exchange an accessToken using this)
        next: query.next //The installation URL of your Integration in the ZEIT Dashboard
    };

    console.log(query);
    try {
        console.log("client id: " + constants.AUTH.CLIENT_ID);
        console.log("client secret: " + constants.AUTH.CLIENT_SECRET);

        const resAccess = await httpClient.post(constants.ZEIT_API_ROUTES.ACCESS_TOKEN, qs.stringify({
            client_id: constants.AUTH.CLIENT_ID, //ID of your application
            client_secret: constants.AUTH.CLIENT_SECRET, //Secret of your application
            code: newIntegration.code, //The code you received
            redirect_uri: constants.ZEIT_PROD_REDIRECT_URL //URL to redirect back
        }));

        const token = resAccess.data.access_token;
        await saveDataToMongo(newIntegration.configurationId, token, newIntegration.teamId);
        logger.info(constants.LOG_MESSAGES.SUCCESS_GET_ACCESS_TOKEN + token,null,newIntegration.configurationId,null,newIntegration.teamId);

        // Redirects to the ui-hooks
        res.writeHead(302, {
            'Location': newIntegration.next
        });
        res.end();

    } catch (error) {
        logger.error(constants.LOG_MESSAGES.ERROR_GET_ACCESS_TOKEN + error,null,newIntegration.configurationId,null,newIntegration.teamId);
        res.end();
    }
};