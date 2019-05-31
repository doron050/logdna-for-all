const dna = require('logdna');

const zeit = require('./zeitConnector/projectIntegration');



// DEBUG ONLY
const mylog = [{
        "type": "stdout",
        "created": 1548675195849,
        "payload": {
            "deploymentId": "dpl_CyMsjjbZjkvMBom8ugeAWdKdcfQo",
            "info": {
                "type": "build",
                "name": "bld_j178cr7cm",
                "entrypoint": "package.json"
            },
            "text": "sandbox worker for deployment dpl_CyMsjjbZjkvMBom8ugeAWdKdcfQo build bld_j178cr7cm",
            "id": "34536610937913059182614073591023254523011083812228628481",
            "date": 1548675195849,
            "serial": "34536610937913059182614073591023254523011083812228628481"
        }
    },
    {
        "type": "stdout",
        "created": 1548675195854,
        "payload": {
            "deploymentId": "dpl_CyMsjjbZjkvMBom8ugeAWdKdcfQo",
            "info": {
                "type": "build",
                "name": "bld_j178cr7cm",
                "entrypoint": "package.json"
            },
            "text": "patching https://api-bru1.zeit.co/v2/now/deployments/dpl_CyMsjjbZjkvMBom8ugeAWdKdcfQo/builds/bld_j178cr7cm with {\"readyState\":\"BUILDING\",\"buildLambda\":{\"logGroupName\":\"/aws/lambda/sandbox-d4i4EBkDKEVMaFFEP0mlxBPo-01ba4f9c4f6b3608cc09eb61dedf90f\",\"logStreamName\":\"2019/01/28/[$LATEST]710fa0653de9434786b44bbe7274c611\",\"awsRequestId\":\"880e149d-2b24-434f-a218-b4a05e1d89b3\",\"startedAt\":1548675195849}}",
            "id": "34536610938024562908606726706730933114374325619758530562",
            "date": 1548675195854,
            "serial": "34536610938024562908606726706730933114374325619758530562"
        }
    }
];


function handleClient(clientToHandle) {
    // const testLog = zeit.getDeploymentsLogs(clientToHandle.projectId)[0];
    const logLines = mylog;
    console.log(`handling client, ID: ${clientToHandle.integrationId}`);

    if (!clientToHandle.logger) {
        console.log(`Creating new logger for client ID: ${clientToHandle.integrationId} , DNAkey: ${clientToHandle.logDnaToken}`);
        clientToHandle.logger = dna.createLogger(clientToHandle.logDnaToken, {});
    }
    logLines.forEach(currentLog => {
        const templog = {
            deploymentId: currentLog.payload.deploymentId,
            data: currentLog.payload.text,
            id: clientToHandle.integrationId
        }
        clientToHandle.logger.log(templog);
        console.log("log line sent");
    });
}

module.exports = {
    handleClient
}