require ('../logz-for-all/Common/Parameters');
const file = require('../Common/fileAdapter');

var logger = require('logzio-nodejs').createLogger({
    token: LOGZIO_TOKEN,
});

// sending text
logger.log('This is a log message');

// sending an object
var obj = {
    message: 'Some log message',
    param1: 'val1',
    param2: 'val2'
};
logger.log(obj);

function handleLog(msg)
{
    
}

module.export = {
    log
}