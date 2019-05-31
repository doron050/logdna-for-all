const express = require('express');
const dotenv = require('dotenv');
const constants = require('./common/constants');
dotenv.config();
const app = express();

app.get('/hi', async (req, res) => {
    console.log('hi');
    res.send('hello world');
});


app.listen(constants.PORT, () => console.log(`app on port ${constants.PORT}`));