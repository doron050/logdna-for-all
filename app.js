require('dotenv').config();
const express = require('express');
const constants = require('./common/constants');
const dnaLogger = require('./common/dnaLogger');

const app = express();

const bla = require('./common/mongodb');

bla.getCollection().then((result) => {
    console.log('dasdas');
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