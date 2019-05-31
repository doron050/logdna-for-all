const url = require('url');
const mongoClient = require('../common/mongodb');
const constants = require('../common/constants');
const httpClient = require('../common/httpClient')
const axios = require('axios');
const qs = require('qs');

// Saves this specific token for future use of the zeit api
async function saveToken(configurationId, access_token){
    await mongoClient.upsertDoc(configurationId, {zeitToken: access_token});
}

module.exports = async (req, res) => {

    let query = url.parse(req.url, true).query;

    const newIntegration = {
        teamId: query.teamId, //The teamId of the installation
        configurationId: query.configurationId, //The id of the related configuration
        code: query.code, //OAuth authorization code (you can exchange an accessToken using this)
        next: query.next //The installation URL of your Integration in the ZEIT Dashboard
    };

    try {

        const resAccess = await httpClient.post(constants.ZEIT_API_ROUTES.ACCESS_TOKEN, qs.stringify({
            client_id: constants.AUTH.CLIENT_ID, //ID of your application
            client_secret: constants.AUTH.CLIENT_SECRET, //Secret of your application
            code: newIntegration.code, //The code you received
            redirect_uri: constants.ZEIT_PROD_REDIRECT_URL //URL to redirect back
        }));

        const token = resAccess.data.access_token;

        await saveToken(newIntegration.configurationId, resAccess.data.access_token);

        console.log(constants.LOG_MESSAGES.SUCCESS_GET_ACCESS_TOKEN);

        // Redirects to the ui-hooks
        res.writeHead(302, {
            'Location': newIntegration.next
        });
        res.end();
    } catch (error) {
        console.log(constants.LOG_MESSAGES.ERROR_GET_ACCESS_TOKEN + error);
        res.end();
    };
};