const url = require('url');
const mongoClient = require('../common/mongodb');
const constants = require('../common/constants');
const httpClient = require('../common/httpClient')
const axios = require('axios');
const qs = require('qs');

module.exports = async (req, res) => {

    let query = url.parse(req.url, true).query;

    console.log(query);

    console.log(constants.AUTH.CLIENT_ID);
    console.log(constants.AUTH.CLIENT_SECRET);

    const newIntegration = {
        teamId: query.teamId, //The teamId of the installation
        configurationId: query.configurationId, //The id of the related configuration
        code: query.code, //OAuth authorization code (you can exchange an accessToken using this)
        next: query.next //The installation URL of your Integration in the ZEIT Dashboard
    };

    //console.log(constants.AUTH.CLIENT_ID + " | " + constants.AUTH.CLIENT_SECRET + " | " + newIntegration.code + " | " + newIntegration.next); 

    try {

        console.log(constants.ZEIT_API_ROUTES.ACCESS_TOKEN);
        console.log(constants.AUTH.CLIENT_ID);
        console.log(constants.AUTH.CLIENT_SECRET);
        console.log(newIntegration.code);
        console.log(constants.ZEIT_PROD_REDIRECT_URL);
        const resAccess = await axios.post("https://api.zeit.co/v2/oauth/access_token", qs.stringify({ //constants.ZEIT_API_ROUTES.ACCESS_TOKEN
            client_id: constants.AUTH.CLIENT_ID, //ID of your application
            client_secret: constants.AUTH.CLIENT_SECRET, //Secret of your application
            code: newIntegration.code, //The code you received
            redirect_uri: constants.ZEIT_PROD_REDIRECT_URL //URL to redirect back
        }));

        console.log({
            resAccess
        });
        const token = resAccess.access_token;

        //  mongoClient.upsertDoc()

        console.log(constants.LOG_MESSAGES.SUCCESS_GET_ACCESS_TOKEN + token);

        // Redirects to the ui-hook
        res.writeHead(302, {
            'Location': newIntegration.next
        });
        res.end();
    } catch (error) {
        console.log(constants.LOG_MESSAGES.ERROR_GET_ACCESS_TOKEN + error);
        res.end();
    };
};