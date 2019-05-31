
const API_BASIC_ENDPOINT_URL = "https://api.zeit.co/";
const API_AUTH_ENDPOINT_URL = "https://zeit.co/oauth/authorize";
const ZEIT_PROD_REDIRECT_URL = "https://logz-for-all.logz-for-all.now.sh/redirect";

const LOGZIO_TOKEN = "yyxbNlmITKFCAHGBfFtFfoHKWyFJAXiS"; // Moshe Basher
const LOGSDNA_KEY = "33bc25c119324ac7341346450188cbc4"; // Moshe Basher
const ZEIT_API_ROUTES = {
    LOGS: "v2/now/events",
    DEPLOYMENTS: "v2/now/deployments",
    ACCESS_TOKEN: "v2/oauth/access_token"
};

const LOG_MESSAGES = {

    NEW_INTEGRATION: "New integration init: ",
    SUCCESS_GET_INTEGRATIONS: "Success get last integrations: ",
    ERROR_GET_INTEGRATIONS: "Error get last integrations: ",
    SUCCESS_GET_LOGS: "Success get logs: ",
    ERROR_GET_LOGS: "Error get logs: ",
    SUCCESS_GET_ACCESS_TOKEN: "Access token retrive: ",
    ERROR_GET_ACCESS_TOKEN: "Error! can't retrive access token: "
};

const PORT = process.env.PORT || 9000;

const AUTH = {
    HEADER: "Authorization",
    CLIENT_ID: process.env.INTEGRATION_CLIENT_ID,
    CLIENT_SECRET: process.env.INTEGRATION_CLIENT_SECRET
};

module.exports = {
    API_BASIC_ENDPOINT_URL,
    ZEIT_PROD_REDIRECT_URL,
    LOG_MESSAGES,
    LOGZIO_TOKEN,
    LOGSDNA_KEY,
    ZEIT_API_ROUTES,
    PORT,
    AUTH
};