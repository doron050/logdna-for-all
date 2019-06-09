const axios = require('axios');

const sentLogs = function (loggerToken, logs) {
    axios.post('https://logs.logdna.com/logs/ingest?hostname=hostname&mac=mac&ip=ip&now=now', {
        lines: logs
    }, {
        auth:{
            'username': loggerToken
        },
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        }
    })
};


module.exports = {
    sentLogs,
};