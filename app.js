require('dotenv').config();
require('./clientRetriver');

const constants = require('./common/constants');
// const nivus = require("./zeitConnector/projectIntegration");
// const mongo = require('./common/mongodb');
//
// (async () => {
//     const list = await mongo.getLogzCollection();
//     const logs = await nivus.getDeploymentsLogs(list[0].projects[0].projectId, list[0].zeitToken, list[0].teamId);
// })();

const express = require('express');
const app = express();

app.get('/keepalive', async (req, res) => {
    res.send("thank you");
});

// console.log(nivus.getTeamProjects("1IrJD9uAK2jNiwA5vZKAWnDM"));

app.listen(constants.PORT, () => console.log(`app on port ${constants.PORT}`));