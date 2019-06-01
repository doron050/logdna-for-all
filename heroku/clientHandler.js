const dna = require('logdna');
const logConvertor = require('./zeitLogToDNALog');
const constants = require('../common/constants');
const logHandler = require('./logHandler');
const mongoClient = require('../common/mongodb');


async function handleProject(projectToHandle) {
    console.log(constants.LOG_MESSAGES.HANDLING_CLIENT + projectToHandle.projectId);

    // Assign logger
    if (!projectToHandle.logger) {
        console.log(constants.LOG_MESSAGES.NEW_LOGGER + projectToHandle.projectId);
        projectToHandle.logger = dna.createLogger(projectToHandle.logDnaToken, {});
    }

    // Get last logs
    const logLines = await logHandler.getLastLogs(projectToHandle);

    if (logLines.length > 0) {

        // Send logs
        sendData(projectToHandle, logLines);

        // Save last index in DB
        updateLastLog(projectToHandle, logLines);
    }
}

function sendData(projectToHandle, logLines) {
    logLines.forEach(zeitLogLine => {
        const dnaLog = logConvertor.convertToDNA(zeitLogLine, projectToHandle);
        projectToHandle.logger.log(dnaLog);
    });
}

async function updateLastLog(projectToHandle, logLines) {
    const lastCreatedDate = logLines[logLines.length - 1].created + 1;
    projectToHandle.lastSentLogTimestamp = lastCreatedDate;
    await mongoClient.upsertLastSentLogTimestamp(projectToHandle.configurationId, projectToHandle.projectId, lastCreatedDate)
    console.log(constants.LOG_MESSAGES.UPDATE_LASTID + lastCreatedDate + " For projectId: " + projectToHandle.projectId);
}

module.exports = {
    handleProject
};