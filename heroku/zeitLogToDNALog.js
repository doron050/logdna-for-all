function convertToDNA(zeitLog,clientToHandle) {
    const dnaLog = {
        meta: {
            deploymentId: zeitLog.payload.deploymentId,
            id: clientToHandle.ID,
            logEntrypoint:zeitLog.payload.info.entrypoint
        },
        line: zeitLog.payload.text,
        env: "production",

    };

    return dnaLog;
}


module.exports = {
    convertToDNA
};