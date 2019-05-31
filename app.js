require('dotenv').config();
const express = require('express');
const constants = require('./common/constants');
require('./clientRetriver');
const app = express();


app.get('/hi', async (req, res) => {
    res.send('hello world');
    console.log("Done");
});

app.get('/keepalive', async (req, res) => {
    res.send("thank you");
});

app.get('/sync',async (req,res) => {
    
});

app.listen(constants.PORT, () => console.log(`app on port ${constants.PORT}`));