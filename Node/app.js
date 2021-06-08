//creating and calling modules

//var log = require('./logger')
//console.log(log)
//log.log('meeeeesssage');

//path module
const path = require('path');
var pathObj = path.parse(__filename);
console.log(pathObj)

//OS Module
const os = require('os');
const totalMemory = os.totalmem();
const freeMemory = os.freemem();
console.log(`Total Memory ${totalMemory}`);
console.log(`Free Memory ${freeMemory}`);

//file system module
const fs = require('fs');
const files = fs.readdirSync('./');
console.log(files);
const asyncFiles = fs.readdir('./', function(err, files){
    if(err) console.log('Error', err);
    else console.log('Result', files)
});

/*
    events module
*/
const EventEmitter = require('events');

const Logger = require('./logger');
const logger = new Logger();

logger.on('messageLogged', (arg) => {
    console.log('listener called', arg)
});

logger.log('message');

/*
    HTTP Module
*/
const http = require('http')

const server = http.createServer((req,res) => {
    if (req.url === '/') {
        res.write('7 Baconators, please and thank you');
        res.end();
    }
    if (req.url === '/baconators') {
        res.write(JSON.stringify(['baconator', 'baconator', 'baconator', 'baconator', 'baconator', 'baconator', ' last baconator']));
        res.end;
    }
});

server.listen(3000)

console.log('listening on port 3000...');


