// ** StoryTeller Server **
// 3rd Server dependencies
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const constants = require('./common/constants');

const app = express();


app.get('/hi', async (req, res) => {
    console.log('hi');
    res.send('hello world');
});

// Set the server to listen to requests
app.listen(constants.PORT, () => console.log(`app on`));