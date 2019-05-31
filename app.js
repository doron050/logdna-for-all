const express = require('express');
const dotenv = require('dotenv');
const constants = require('./common/constants');
const logger = require('./logSender/winston');

dotenv.config();
const app = express();


app.get('/hi', async (req, res) => {

    logger.sendLog('debug',"This is a test log by Moshe");
    res.send('hello world');
});

app.listen(constants.PORT, () => console.log(`app on port ${constants.PORT}`));