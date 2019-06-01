const zeit = require('./zeitConnector/projectIntegration');
const convertor = require('./convertors/logs');


const logs = zeit.getDeploymentsLogs(clientToHandle.projectId);
const result = convertor.getLogsSince(logs);


