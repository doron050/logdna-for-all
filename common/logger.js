const constants = require('./constants');

let logzioLogger;
if (constants.ENVIRONMENT === "production") {
    logzioLogger = require('logzio-nodejs').createLogger({
        token: constants.LOGZIO_TOKEN
    });
}


const log4js = require('log4js');
log4js.configure({
    appenders: {
        console: {
            type: 'console'
        }
    },
    categories: {
        default: {
            appenders: ['console'],
            level: constants.LOG4JS_LEVEL
        }
    }
});
const log4jslogger = log4js.getLogger();

function debugLog(msg, projId, configId, active, teamId, teamName, registrationDate, userName, userEmail) {
    log4jslogger.debug(msg);
    if (constants.ENVIRONMENT === "production") {
        logzioLogger.log({
            message: msg,
            level: 'debug',
            projectId: projId,
            configurationId: configId,
            active: active,
            teamId: teamId,
            registrationDate: registrationDate,
            teamName: teamName,
            userName: userName,
            userEmail: userEmail
        });
    }
}

function infoLog(msg, projId, configId, active, teamId, teamName, registrationDate, userName, userEmail) {
    log4jslogger.info(msg);
    if (constants.ENVIRONMENT === "production") {
        logzioLogger.log({
            message: msg,
            level: 'info',
            projectId: projId,
            configurationId: configId,
            active: active,
            teamId: teamId,
            registrationDate: registrationDate,
            teamName: teamName,
            userName: userName,
            userEmail: userEmail
        });
    }
}

function errorLog(msg, projId, configId, active, teamId, teamName, registrationDate, userName, userEmail) {
    log4jslogger.error(msg);
    if (constants.ENVIRONMENT === "production") {
        logzioLogger.log({
            message: msg,
            level: 'error',
            projectId: projId,
            configurationId: configId,
            active: active,
            teamId: teamId,
            registrationDate: registrationDate,
            teamName: teamName,
            userName: userName,
            userEmail: userEmail
        });
    }
}

module.exports = {
    debug: debugLog,
    info: infoLog,
    error: errorLog
};