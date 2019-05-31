const dna = require('logdna');
// const constants = require('./constants');

var dnalog = dna.createLogger("33bc25c119324ac7341346450188cbc4",{});

function log(data)
{
    dnalog.log(data);
    dnalog._flush();
}

module.exports = {
    log
}