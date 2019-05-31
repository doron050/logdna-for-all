require('dotenv').config();
const express = require('express');
const constants = require('./common/constants');
const dnaLogger = require('./common/dnaLogger');
const clientRetriver = require('./clientRetriver');
const app = express();
const _clientRetriverPid = setInterval(() => clientRetriver.syncCollection(), 5000);


app.get('/hi', async (req, res) => {

    dnaLogger.log("hello world - dna log");


    res.send('hello world');
    console.log("Done");
});

app.get('/keepalive', async (req, res) => {
    res.send("thank you");
});

app.get('/sync',async (req,res) => {
    
});

app.listen(constants.PORT, () => console.log(`app on port ${constants.PORT}`));