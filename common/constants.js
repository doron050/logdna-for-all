const API_BASIC_ENDPOINT_URL = "https://api.zeit.co/v2/now/";
const LOGZIO_TOKEN = "037b265e-c010-49f6-9a99-ecfe29d5adb8";
const MONGO_URL = "mongodb://localhost:27017/";
const MONGO_DB = "mydb";

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

module.exports = {
    API_BASIC_ENDPOINT_URL,
    LOG_MESSAGES,
    LOGZIO_TOKEN,
    MONGO_URL,
    ZEIT_API_ROUTES,
    ZEIT_HTTP_INSTANCE
};