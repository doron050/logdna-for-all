const constants = require('../common/constants');
const httpClient = require('../common/httpClient')

async function getLogs(deploymentId, token) {

    try {
        const response = await httpClient.get(constants.ZEIT_API_ROUTES.DEPLOYMENTS + deploymentId + "/" + constants.ZEIT_API_ROUTES.LOGS, {
            headers: {
                [constants.AUTH.HEADER]: token
            }
        })
        console.log(constants.LOG_MESSAGES.SUCCESS_GET_LOGS);
        return (response.data)
    } catch {

        console.log(constants.LOG_MESSAGES.ERROR_GET_LOGS + error);
    };
}

async function getDeployments(projectId, token, limit) {

    // If no limit passed, get the last deployment
    if (!limit) limit = 1;

    try {
        const response = await httpClient.get(constants.ZEIT_API_ROUTES.DEPLOYMENTS, {
            params: {
                limit: limit,
                projectId: projectId
            },
            headers: {
                [constants.AUTH.HEADER]: token
            }
        });
        console.log(constants.LOG_MESSAGES.SUCCESS_GET_INTEGRATIONS + response.data.length);
        return (response.data);
    } catch {
        console.log(constants.LOG_MESSAGES.ERROR_GET_INTEGRATIONS + error);
    }
}

function getDeploymentsLogs(projectId, token, numOfDeployments) {

    // If no limit passed, get the last deployment
    if (!numOfDeployments) numOfDeployments = 1;

    let deployments = getDeployments(projectId, token, numOfDeployments);
    let logs = [];

    deployments.forEach(deploy => {

        logs.push(getLogs(deploy.name, token));
    });

    return (logs);
}

async function getTeamProjects(token){
    
    try {
        const response = await httpClient.get(constants.ZEIT_API_ROUTES.PROJECTS, {
            headers: {
                [constants.AUTH.HEADER]: token
            }
        });
        console.log(constants.LOG_MESSAGES.SUCCESS_GET_PROJECTS + response.data.length);
        return (response.data);
    } catch (error) {
        console.log(constants.LOG_MESSAGES.ERROR_GET_PROJECTS + error);
    }
}

module.exports = {
    getDeploymentsLogs,
    getTeamProjects
};