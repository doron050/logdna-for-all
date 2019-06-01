require('dotenv').config();
require('./clientRetriver');

const constants = require('./common/constants');
const express = require('express');
const app = express();

app.get('/keepalive', async (req, res) => {
    res.send("thank you");
});

app.listen(constants.PORT, () => console.log(`app on port ${constants.PORT}`));