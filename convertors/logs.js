function getLogsSince(logs, lastLogId) {

    let foundFlag = false;
    let logsIdx = 0;
    let lastLogIdx = 0;

    if (lastLogId) {

        do {

            if (logs[logsIdx].payload.id === lastLogId) {

                lastLogIdx = logsIdx;
                foundFlag = true;
            }

            logsIdx++;
        }
        while (!foundFlag && logsIdx < logs.length)
    }

    if (!lastLogId || !foundFlag) {

        // If no last log exists or found, it should return at the end all the logs
        lastLogIdx = -1;
    }

    return ({
        logs: logs.slice(lastLogIdx + 1),
        lastLogId: logs[logs.length - 1].payload.id
    });
}

module.exports = {
    getLogsSince
}