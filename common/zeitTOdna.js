function convertToDNA(zeitLog,clientToHandle) {
    const dnaLog = {
        deploymentId: zeitLog.payload.deploymentId,
        data: zeitLog.payload.text,
        id: clientToHandle.ID
    }

    return dnaLog;
}


module.exports = {
    convertToDNA
}