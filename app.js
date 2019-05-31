const express = require('express');
const dotenv = require('dotenv');
const constants = require('./common/constants');
const _logdnaWinstonTransport = require('logdna-winston');
const _LogzioWinstonTransport = require('winston-logzio');
const winston = require('winston');

dotenv.config();
const app = express();
const logger = winston.createLogger({});
const logdnaWinstonTransport = new _logdnaWinstonTransport({
    key: constants.LOGSDNA_KEY
});
// const logzioWinstonTransport = new _LogzioWinstonTransport({
//     // level: 'info',
//     name: 'winston_logzio',
//     token: constants.LOGZIO_TOKEN
// });



logger.add(logdnaWinstonTransport);
// logger.add(logzioWinstonTransport);



app.get('/hi', async (req, res) => {

    logger.log("info", "logger.log this data");

    logger.log({
        level: "debug",
        message: "data2"
    });

    res.send('hello world');
});

app.listen(constants.PORT, () => console.log(`app on port ${constants.PORT}`));