const dna = require('logdna');
const zeit = require('./zeitConnector/projectIntegration');
const logConvertor = require('./common/zeitTOdna');
const consts = require('./common/constants');
const logHandler = require('./logHandler');
const mongo = require('./common/mongodb');


function handleProject(projectToHandle) {
    console.log(consts.LOG_MESSAGES.HANDLING_CLIENT + projectToHandle.ID);

    // Assign logger
    if (!projectToHandle.logger) {
        console.log(consts.LOG_MESSAGES.NEW_LOGGER + projectToHandle.ID);
        projectToHandle.logger = dna.createLogger(projectToHandle.logDnaToken, {});
    }

    // Get last logs
    const logLines = logHandler.getLastLogs(projectToHandle);

    // Send logs
    sendData(projectToHandle, logLines);

    // Save last index in DB
    updateLastLog(projectToHandle, logLines);
}

function sendData(projectToHandle, logLines) {
    logLines.forEach(zeitLogLine => {
        const dnaLog = logConvertor.convertToDNA(zeitLogLine, projectToHandle);
        projectToHandle.logger.log(dnaLog);
    });
}

async function updateLastLog(projectToHandle, logLines) {
    projectToHandle.lastSentLogId = logLines[logLines.length - 1];
    const docToUpdate = await mongo.getDoc(projectToHandle.relatedConfID);
    if (docToUpdate) {
        console.log(consts.LOG_MESSAGES.UPDATE_LASTID + projectToHandle.relatedConfID + " <---> " +projectToHandle.ID);     
        await mongo.upsertDoc(projectToHandle.relatedConfID, docToUpdate);
    }
}
module.exports = {
    handleProject
}