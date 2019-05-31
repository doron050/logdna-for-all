require('dotenv').config()

const axios = require('axios');

const API_BASIC_ENDPOINT_URL = "https://api.zeit.co/";
const API_AUTH_ENDPOINT_URL = "https://zeit.co/oauth/authorize";

const LOGZIO_TOKEN = "037b265e-c010-49f6-9a99-ecfe29d5adb8"; // Moshe Basher

const ZEIT_API_ROUTES = {
    LOGS: "v2/now/events",
    DEPLOYMENTS: "v2/now/deployments",
    ACCESS_TOKEN: "/v2/oauth/access_token"
};

const LOG_MESSAGES = {

    NEW_INTEGRATION: "New integration init: ",
    SUCCESS_GET_INTEGRATIONS: "Success get last integrations: ",
    ERROR_GET_INTEGRATIONS: "Error get last integrations: ",
    SUCCESS_GET_LOGS: "Success get logs: ",
    ERROR_GET_LOGS: "Error get logs: ",
    SUCCESS_GET_ACCESS_TOKEN: "Access token retrive: "
};

const ZEIT_HTTP_INSTANCE = axios.create({
    baseURL: API_BASIC_ENDPOINT_URL
});

const PORT = process.env.PORT || 9000;

const AUTH = {
    HEADER: "Authorization",
    CLIENT_ID: process.env.INTEGRATION_CLIENT_ID,
    CLIENT_SECRET: process.env.INTEGRATION_CLIENT_SECRET
}

module.exports = {
    API_BASIC_ENDPOINT_URL,
    LOG_MESSAGES,
    LOGZIO_TOKEN,
    ZEIT_API_ROUTES,
    ZEIT_HTTP_INSTANCE,
    PORT,
    AUTH
};