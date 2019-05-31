const {
    parse
} = require('url');
const constants = require('../common/constants');

module.exports = (req, res) => {

    const newIntegration = {
        teamId: res.teamId, //The teamId of the installation
        configurationId: res.configurationId, //The id of the related configuration
        code: res.code, //OAuth authorization code (you can exchange an accessToken using this)
        next: res.next //The installation URL of your Integration in the ZEIT Dashboard
    };

    constants.ZEIT_HTTP_INSTANCE.post(constants.ZEIT_API_ROUTES.ACCESS_TOKEN, {
        clinet_id: constants.AUTH.CLIENT_ID, //ID of your application
        client_secret: constants.AUTH.CLIENT_SECRET, //Secret of your application
        code: newIntegration.code, //The code you received
        redirect_uri: newIntegration.next //URL to redirect back
    }).then(function (res) {

        console.log(constants.LOG_MESSAGES.SUCCESS_GET_ACCESS_TOKEN)
        let token = res.accessToken;
    }).catch(function (error) {
        console.log(constants.LOG_MESSAGES.ERROR_GET_ACCESS_TOKEN + error);
    });

    res.end();
};