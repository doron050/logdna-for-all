
const axios = require('axios');
const constants = require('./constants');

const ZEIT_HTTP_INSTANCE = axios.create({
    baseURL: API_BASIC_ENDPOINT_URL
});

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

module.exports = ZEIT_HTTP_INSTANCE;