require('dotenv').config();
const express = require('express');
const constants = require('./common/constants');
const dnaLogger = require('./common/dnaLogger');

const app = express();

const mongo =require('./common/mongodb');

mongo.getDoc('asd').then((sd) => {
    console.log(sd ? 'yes' : 'no');
    const a=1;
});

app.get('/hi', async (req, res) => {

    dnaLogger.log("hello world - dna log");


    res.send('hello world');
    console.log("Done");
});

app.get('/keepalive', async (req, res) => {
    res.send("thank you");
});

app.listen(constants.PORT, () => console.log(`app on port ${constants.PORT}`));