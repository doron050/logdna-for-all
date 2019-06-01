require('dotenv').config();

require('./clientRetriver');

const constants = require('./common/constants');
// const nivus = require("./zeitConnector/projectIntegration");
 

const express = require('express');
const app = express();

app.get('/hi', async (req, res) => {
    res.send('hello world');
    console.log("Done");
});

app.get('/keepalive', async (req, res) => {
    res.send("thank you");
});

// console.log(nivus.getTeamProjects("1IrJD9uAK2jNiwA5vZKAWnDM"));

app.listen(constants.PORT, () => console.log(`app on port ${constants.PORT}`));