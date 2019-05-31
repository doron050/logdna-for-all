const constants = require('../Common/constants');
const winston = require('winston');

//DEBUG ONLY
// const dna = require('logdna');
// var dnalog = dna.createLogger(constants.LOGSDNA_KEY);


const _logdnaWinstonTransport = require('logdna-winston');
const _LogzioWinstonTransport = require('winston-logzio');
const logger = winston.createLogger({});
const logdnaWinstonTransport = new _logdnaWinstonTransport({
    key: constants.LOGSDNA_KEY
});
const logzioWinstonTransport = new _LogzioWinstonTransport({
    // level: 'info',
    name: 'winston_logzio',
    token: constants.LOGZIO_TOKEN
});

logger.add(logdnaWinstonTransport);
logger.add(logzioWinstonTransport);

function sendLog(level,message) {
    logger.log(level, message);
    // dnalog.log(message);
}


module.exports = {
    sendLog
}