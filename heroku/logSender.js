const axios = require('axios');
const os = require('os');

const sentLogs = function (loggerToken, logs) {
    return axios.post(`https://logs.logdna.com/logs/ingest?hostname=${os.hostname}&now=${Date.now()}`, {
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