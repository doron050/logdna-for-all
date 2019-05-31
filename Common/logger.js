const dna = require('logdna');
const constants = require('./constants');

var dnalog = dna.createLogger(constants.LOGSDNA_KEY,{});

function log(data)
{
    dnalog.log(data);
    dnalog._flush();
}

module.exports = {
    log
}