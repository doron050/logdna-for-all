require('dotenv').config();
const express = require('express');
const constants = require('../common/constants');

require('./clientRetriver');

const app = express();

app.get('/keepalive', async (req, res) => {
    res.send("thank you");
});

app.listen(constants.PORT, () => console.log(`app on port ${constants.PORT}`));