const axios = require('axios/index');
const constants = require('../common/constants');

const zeitHttpInstance = axios.create({
    baseURL: constants.API_BASIC_ENDPOINT_URL
});

module.exports = zeitHttpInstance;