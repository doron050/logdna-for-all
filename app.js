require('dotenv').config();
const express = require('express');
const constants = require('common/constants');
const logger = require('common/logger');

const app = express();

app.get('/hi', async (req, res) => {

    logger.log("hello world - dna log");
        
    
    res.send('hello world');
    console.log("Done");
});

app.get('/keepalive',async (req,res) => {
    res.send("thank you");
});

app.listen(constants.PORT, () => console.log(`app on port ${constants.PORT}`));