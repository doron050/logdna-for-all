const zeitAdapter = require('../common/zeitAdapter');
const constants = require('../common/constants');
const logger = require('../logger');

async function getLastLogs(projectToHandle) {
    // Get logs for this project
    if (!projectToHandle.lastSentLogTimestamp) {

        if (!projectToHandle.registrationDate) {
            const project = projectToHandle;
            logger.error(constants.LOG_MESSAGES.MISSING_REGISTRATION_DATE(projectToHandle.projectId, projectToHandle.configurationId), project.projectId, project.configurationId, project.active, project.teamId, null, project.registrationDate, null, null); //TODO: fill nulls with data
            // console.log(constants.LOG_MESSAGES.MISSING_REGISTRATION_DATE(projectToHandle.projectId, projectToHandle.configurationId));
            const tenMinutesInUnixTime = 60 * 10;
            projectToHandle.lastSentLogTimestamp = Date.now() - tenMinutesInUnixTime;
        } else
            projectToHandle.lastSentLogTimestamp = projectToHandle.registrationDate;

    }

    const allLogLines = await zeitAdapter.getDeploymentsLogs(projectToHandle.projectId, projectToHandle.zeitToken, projectToHandle.teamId, projectToHandle.lastSentLogTimestamp);
    return allLogLines;
}


module.exports = {
    getLastLogs
};