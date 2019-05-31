const dna = require('logdna');
const param = require('./constants');


var dnalog = dna.createLogger(param.LOGSDNA_KEY,{});

function log(data)
{
    dnalog.log(data);
    dnalog._flush();
}

module.exports = {
    log
}