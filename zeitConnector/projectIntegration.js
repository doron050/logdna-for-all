const constants = require('../common/constants');
const httpClient = require('../common/httpClient');
const _ = require('lodash');

function createHeaders(token) {
    return {
        [constants.AUTH.HEADER]: 'Bearer ' + token
    }
}

async function getLogs(deploymentId, token) {

    try {
        const response = await httpClient.get(constants.ZEIT_API_ROUTES.LOGS_FOR_DEPLOYMENT(deploymentId), {
            headers: createHeaders(token)
        });
        console.log(constants.LOG_MESSAGES.SUCCESS_GET_LOGS);
        return response.data;
    } catch (error) {
        console.log(constants.LOG_MESSAGES.ERROR_GET_LOGS + error);
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
        console.log(constants.LOG_MESSAGES.SUCCESS_GET_INTEGRATIONS + response.data.deployments.length);

        //const filteredDeployments = _.filter(response.data.deployments, x => x.state === 'READY');
        return response.data.deployments;

    } catch (error) {
        console.log(constants.LOG_MESSAGES.ERROR_GET_INTEGRATIONS + error);
    }
}

async function getDeploymentsLogs(projectId, token, teamId, numOfDeployments) {

    // If no limit passed, get the last deployment
    if (!numOfDeployments) numOfDeployments = 1;

    let deployments = await getDeployments(projectId, token, teamId, numOfDeployments);
    let logs = [];


    for (let i=0; i< deployments.length; i++) {
        logs.push(...await getLogs(deployments[i].uid, token));
    }

    return logs;
}

module.exports = {
    getDeploymentsLogs,
};