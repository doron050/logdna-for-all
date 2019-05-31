function getLogsSince(logs, lastLogId) {

    let logsIdx = 0;
    let lastLogIdx = 0;

    do {

        if (logs[logsIdx].payload.id === lastLogId) {

            lastLogIdx = logsIdx;
        }

        logsIdx++;
    }
    while (!lastLogId || logsIdx < logs.length)

    return ({
        logs: logs.slice(lastLogIdx + 1),
        lastLogId: logs[logs.length - 1].payload.id
    });
}

module.exports = {
    getLogsSince
}