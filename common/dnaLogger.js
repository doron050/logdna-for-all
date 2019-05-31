const dna = require('logdna');
const param = require('./constants');


// const dnalog = dna.createLogger(param.LOGSDNA_KEY,{});
const dnalog = {};

function log(data) {
    dnalog.log(data);
    dnalog._flush();
    dna.Logger()
}
module.exports = {
    log
};
