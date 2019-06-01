const logzioLogger = require('logzio-nodejs').createLogger({
    token: process.env.LOGGER_TOKEN
});

const constants = require('./constants');

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
            level: "info"
        }
    }
});
const log4jslogger = log4js.getLogger("default");


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