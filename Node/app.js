//creating and calling modules

var log = require('./logger')
console.log(log)
log.log('meeeeesssage');

//path module
const path = require('path');
var pathObj = path.parse(__filename);
console.log(pathObj)