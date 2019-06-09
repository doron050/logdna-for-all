const dna = require('logdna');
const logConvertor = require('./zeitLogToDNALog');
const constants = require('../common/constants');
const logHandler = require('./logHandler');
const mongoClient = require('../common/mongodb');
const logger = require('../common/logger');
const logSender = require('./logSender');

async function handleProject(projectToHandle) {
    // console.log(constants.LOG_MESSAGES.HANDLING_CLIENT + projectToHandle.projectId);
    logger.info(constants.LOG_MESSAGES.HANDLING_CLIENT + projectToHandle.projectId, projectToHandle.projectId, projectToHandle.configurationId, projectToHandle.active, projectToHandle.teamId, projectToHandle.teamName, projectToHandle.registrationDate, projectToHandle.userName, projectToHandle.userEmail, projectToHandle.projectName);
    // Assign logger
    if (!projectToHandle.logger) {
        logger.debug(constants.LOG_MESSAGES.NEW_LOGGER + projectToHandle.projectId, projectToHandle.projectId, projectToHandle.configurationId, projectToHandle.active, projectToHandle.teamId, projectToHandle.teamName, projectToHandle.registrationDate, projectToHandle.userName, projectToHandle.userEmail, projectToHandle.projectName);
        // console.log(constants.LOG_MESSAGES.NEW_LOGGER + projectToHandle.projectId);
        projectToHandle.logger = dna.createLogger(projectToHandle.loggerToken, {});
    }

    // Get last logs
    const logLines = await logHandler.getLastLogs(projectToHandle);

    if (logLines.length > 0) {

        logger.info(constants.LOG_MESSAGES.SUCCESS_GET_LOGS + logLines.length, projectToHandle.projectId, projectToHandle.configurationId, projectToHandle.active, projectToHandle.teamId, projectToHandle.teamName, projectToHandle.registrationDate, projectToHandle.userName, projectToHandle.userEmail, projectToHandle.projectName);

        // Send logs
        const res = await sendData(projectToHandle, logLines);

        if (res.status === 200) {
            // Save last index in DB
            await updateLastLog(projectToHandle, logLines);
        }
        else {
            logger.error('cant send logs to logdna service! will retry soon');
        }
    }
}

async function sendData(projectToHandle, logLines) {
    const newLogs = logLines.map(x=> logConvertor.convertToDNA(x, projectToHandle));
    return await logSender.sentLogs(projectToHandle.loggerToken, newLogs);
}

async function updateLastLog(projectToHandle, logLines) {
    const lastCreatedDate = logLines[logLines.length - 1].created + 1;
    projectToHandle.lastSentLogTimestamp = lastCreatedDate;
    await mongoClient.upsertLastSentLogTimestamp(projectToHandle.configurationId, projectToHandle.projectId, lastCreatedDate)
    logger.info(constants.LOG_MESSAGES.UPDATE_LASTID + lastCreatedDate + " For projectId: " + projectToHandle.projectId, projectToHandle.projectId, projectToHandle.configurationId, projectToHandle.active, projectToHandle.teamId, projectToHandle.teamName, projectToHandle.registrationDate, projectToHandle.userName, projectToHandle.userEmail, projectToHandle.projectName);
}

module.exports = {
    handleProject
};