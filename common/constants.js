const axios = require('axios');

const API_BASIC_ENDPOINT_URL = "https://api.zeit.co/v2/now/";
const LOGZIO_TOKEN = "037b265e-c010-49f6-9a99-ecfe29d5adb8"; // Moshe Basher
const LOGSDNA_KEY = "33bc25c119324ac7341346450188cbc4"; // Moshe Basher
const ZEIT_API_ROUTES = {
    LOGS: "/events",
    DEPLOYMENTS: "/deployments"
};

const LOG_MESSAGES = {

    NEW_INTEGRATION: "New integration init: ",
    SUCCESS_GET_INTEGRATIONS: "Success get last integrations: ",
    ERROR_GET_INTEGRATIONS: "Error get last integrations: ",
    SUCCESS_GET_LOGS: "Success get logs: ",
    ERROR_GET_LOGS: "Error get logs: "
};

const ZEIT_HTTP_INSTANCE = axios.create({
    baseURL: API_BASIC_ENDPOINT_URL
});

const PORT = process.env.PORT || 9000;

module.exports = {
    API_BASIC_ENDPOINT_URL,
    LOG_MESSAGES,
    LOGZIO_TOKEN,
    LOGSDNA_KEY,
    ZEIT_API_ROUTES,
    ZEIT_HTTP_INSTANCE,
    PORT
};