const constants = require('../common/constants');

async function getLogs(deploymentId) {

    // Make a request for a user with a given ID
    try {
        const response = await axios.get(constants.ZEIT_API_ROUTES.DEPLOYMENTS + deploymentId + "/" + constants.ZEIT_API_ROUTES.LOGS)
        console.log(constants.LOG_MESSAGES.SUCCESS_GET_LOGS);
        return (response.data)
    } catch {

        console.log(constants.LOG_MESSAGES.ERROR_GET_LOGS + error);
    };
}

async function getDeployments(projectId, limit) {

    // If no limit passed, get the last deployment
    if (!limit) limit = 1;

    try {
        const response = await axios.get(constants.ZEIT_API_ROUTES.DEPLOYMENTS, {
            params: {
                limit: limit,
                projectId: projectId
            }
        });
        console.log(constants.LOG_MESSAGES.SUCCESS_GET_INTEGRATIONS + response.length);
        return (response.data);
    } catch {
        console.log(constants.LOG_MESSAGES.ERROR_GET_INTEGRATIONS + error);
    }
}

module.exports = {
    getLogs,
    getDeployments
};