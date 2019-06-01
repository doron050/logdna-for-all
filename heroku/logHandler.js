const zeitAdapter = require('../common/zeitAdapter');
const constants = require('../common/constants');

async function getLastLogs(projectToHandle) {
    // Get logs for this project
    if (!projectToHandle.lastSentLogTimestamp) {

        if (!projectToHandle.registrationDate) {
            console.log(constants.LOG_MESSAGES.MISSING_REGISTRATION_DATE(projectToHandle.projectId, projectToHandle.configurationId));
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