const express = require('express');
const dotenv = require('dotenv');
const constants = require('./common/constants');
const logger = require('./Common/logger');


dotenv.config();
const app = express();


app.get('/hi', async (req, res) => {

    logger.log("hello world - dna log");
        
    
    res.send('hello world');
    console.log("Done");
});

app.listen(constants.PORT, () => console.log(`app on port ${constants.PORT}`));