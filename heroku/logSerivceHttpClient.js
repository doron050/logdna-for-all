const axios = require('axios/index');
const constants = require('../common/constants');
const logServiceConstants = require('../common/logServiceConstants');
const logger = require('../common/logger');

const logServiceHttpInstance = axios.create({
    baseURL: logServiceConstants.ENDPOINT_URL
});

const sendLogs = async function (log, authToken) {

    let writeLogRequest;

    try {
        if (logServiceConstants.AUTH.IS_HEADER) {

            writeLogRequest = await logServiceHttpInstance.get({
                params: {
                    [logServiceConstants.LOG_FIELD_NAME]: log
                },
                headers: {
                    [logServiceConstants.AUTH.FIELD_OR_HEADER_NAME]: logServiceConstants.AUTH.PREFIX + authToken
                }
            })
        } else {

            writeLogRequest = await logServiceHttpInstance.get({
                params: {
                    [logServiceConstants.LOG_FIELD_NAME]: log,
                    [logServiceConstants.AUTH.FIELD_OR_HEADER_NAME]: logServiceConstants.AUTH.PREFIX + authToken
                }
            })
        }

        return (true);

    } catch (error) {

        logger.error(constants.LOG_MESSAGES.ERROR_SEND_LOGS);

        return (false);
    }
}

module.exports = sendLogs;