
const axios = require('axios');
const constants = require('./constants');

let ZEIT_HTTP_INSTANCE = axios.create({
    baseURL: constants.API_BASIC_ENDPOINT_URL
});

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

module.exports = ZEIT_HTTP_INSTANCE;