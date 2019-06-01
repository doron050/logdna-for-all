const constants = require('./constants');
const httpClient = require('../zeit/zeitHttpClient');
const logger = require('../logger');

function createHeaders(token) {
    return {
        [constants.AUTH.HEADER]: 'Bearer ' + token
    }
}

async function getLogs(deploymentId, token, teamId, lastSentLogTimestamp) {

    try {
        const response = await httpClient.get(constants.ZEIT_API_ROUTES.LOGS_FOR_DEPLOYMENT(deploymentId), {
            headers: createHeaders(token),
            params: {
                teamId: teamId,
                since: lastSentLogTimestamp,
                direction: "forward"
            }
        });
        if (response.data.length > 0) {
            logger.info(constants.LOG_MESSAGES.SUCCESS_GET_LOGS + response.data.length, null, null, null, teamId);
            // console.log(constants.LOG_MESSAGES.SUCCESS_GET_LOGS + response.data.length);
        }
        return response.data;
    } catch (error) {
        logger.error(constants.LOG_MESSAGES.ERROR_GET_LOGS + error, null, null, null, teamId);
        // console.log(constants.LOG_MESSAGES.ERROR_GET_LOGS + error);
    }

}

async function getDeployments(projectId, token, teamId, limit) {

    const queryParam = {
        projectId: projectId,
    };
    // If no limit passed, get the last 10 deployment
    if (limit) queryParam.limit = limit;
    if (teamId) queryParam.teamId = teamId;

    try {
        const response = await httpClient.get(constants.ZEIT_API_ROUTES.DEPLOYMENTS, {
            params: queryParam,
            headers: createHeaders(token)
        });

        return response.data.deployments;

    } catch (error) {
        logger.error(constants.LOG_MESSAGES.ERROR_GET_INTEGRATIONS + error,projectId, null, null, teamId);
        // console.log(constants.LOG_MESSAGES.ERROR_GET_INTEGRATIONS + error);
    }
}

async function getDeploymentsLogs(projectId, token, teamId, lastSentLogTimestamp, numOfDeployments) {

    // If no limit passed, get the last deployment
    if (!numOfDeployments) numOfDeployments = 1;

    let deployments = await getDeployments(projectId, token, teamId, numOfDeployments);
    let logs = [];


    for (let i = 0; i < deployments.length; i++) {
        const currlog = await getLogs(deployments[i].uid, token, teamId, lastSentLogTimestamp);
        logs.push(...currlog);
    }

    return logs;
}

module.exports = {
    getDeploymentsLogs,
};