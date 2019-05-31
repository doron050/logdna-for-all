
const axios = require('axios');
const constants = require('./constants');

let zeitHttpInstance = axios.create({
    baseURL: constants.API_BASIC_ENDPOINT_URL
});

//zeitHttpInstance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

module.exports = zeitHttpInstance;