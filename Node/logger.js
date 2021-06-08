var url = 'http://mylogger.io/log'

function log(message) {
    //send a request
    console.log(message);
}

module.exports.log = log;