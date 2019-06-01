const API_BASIC_ENDPOINT_URL = process.env.API_BASIC_ENDPOINT_URL;
const ZEIT_PROD_REDIRECT_URL = process.env.ZEIT_PROD_REDIRECT_URL;

const ZEIT_API_ROUTES = {
    LOGS_FOR_DEPLOYMENT: (deploymentId) => `/v2/now/deployments/${deploymentId}/events`,
    DEPLOYMENTS: "v4/now/deployments",
    ACCESS_TOKEN: "v2/oauth/access_token",
    PROJECTS: "v1/projects/list"
};

// const LOGZIO = {
//     LOGGER_TOKEN: process.env.LOGGER_TOKEN,
//     LOGGER_HOST: process.env.LOGGER_HOST
// }
//
// const LOG4JS = {
//     LOG_LEVEL: process.env.LOG_LEVEL
// }
const LOG_MESSAGES = {
    NEW_INTEGRATION: "New integration init: ",
    SUCCESS_GET_INTEGRATIONS: "Success get last integrations: ",
    ERROR_GET_INTEGRATIONS: "Error get last integrations: ",
    SUCCESS_GET_LOGS: "Success get logs: ",
    ERROR_GET_LOGS: "Error get logs: ",
    SUCCESS_GET_ACCESS_TOKEN: "Access token retrive: ",
    ERROR_GET_ACCESS_TOKEN: "Error! can't retrive access token: ",
    NEW_LOGGER: "Creating new logger for client with project ID: ",
    NEW_CLIENT: "Found new client with project ID: ",
    HANDLING_CLIENT: "Currently handling client with project ID: ",
    STATUS_CHANGE: "Change of status for Client with project ID: ",
    TERMINATION_NOTICE: "killing cycle for client with project ID: ",
    SUCCESS_GET_PROJECTS: "Success get projects: ",
    ERROR_GET_PROJECTS: "Error get projects: ",
    UPDATE_LASTID: "Updating lastSentLogId: ",
    INIT_DB_CONNECTION: "Init a new db connection",
    UPDATE_DNA_TOKEN_UDPATE: "Found change in DNAToken for project ID: ",
    NO_PROJECTS_FOUND: "Found new document without project, ConfigID:  ",
    DB_FAILED_TO_CONNECT_FIRST_TRY: "Can't connect to the mongo, will try again, error:",
    DB_FAILED_TO_CONNECT_SECOND_TRY: "Can't connect to the mongo!!! error:",
    MISSING_REGISTRATION_DATE: (projId, configId) => `No registration date found for project id:${projId} inside configuration id:${configId}`,
    MISSING_PARAMETERS_FROM_DB: (missingParams, configurationId) => `Missing the Following params (${missingParams}) form mongo document ${configurationId ? 'with configuration id: ' + configurationId : ''} `
};

const PORT = process.env.PORT || 9000;

const AUTH = {
    HEADER: "Authorization",
    CLIENT_ID: process.env.INTEGRATION_CLIENT_ID,
    CLIENT_SECRET: process.env.INTEGRATION_CLIENT_SECRET
};

const DB = {
    urlPrefix: "mongodb+srv://",
    url: process.env.DB_URL,
    userName: process.env.DB_USER_NAME,
    password: process.env.DB_PASSWORD,
    scheme: process.env.DB_SCHEME,
    dbName: process.env.DB_NAME,
    collectionName: process.env.DB_COLLECTION_NAME,
    connectionParamsString: "?retryWrites=true&w=majority"
};
const MONGO_CONNECTION_STRING = DB.urlPrefix + DB.userName + ":" + DB.password + "@" + DB.url + DB.scheme + DB.connectionParamsString;

const TIME_OUTS = {
    PROJECT_CYCLE: process.env.CONSUME_PROJECT_LOG_INTERVAL,
    SYNC_CYCLE: process.env.SYNC_SUBSCRIBER_WITH_DB_INTERVAL,
};

const ENVIRONMENT = process.env.ENVIRONMENT;

module.exports = {
    API_BASIC_ENDPOINT_URL,
    ZEIT_PROD_REDIRECT_URL,
    LOG_MESSAGES,
    ZEIT_API_ROUTES,
    PORT,
    AUTH,
    DB,
    MONGO_CONNECTION_STRING,
    TIME_OUTS,
    // LOG4JS,
    // LOGZIO,
    ENVIRONMENT
};