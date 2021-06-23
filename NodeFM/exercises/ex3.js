#!/user/bin/env node

"use strict";

var util = require('util') // oodles of utils
var path = require('path'); // local file paths
var fs = require('fs'); // access file system
var Transform = require("stream").Transform; // builtin. pick one off
var zlib = require("zlib"); // compress output. decompress input

var CAF = require("caf");

var args = require("minimist")(process.argv.slice(2), {
    boolean: [ "help", "in", "out", "uncompress" ],
    string: [ "file" ]
});

processFile = CAF(processFile);

function streamComplete(stream) {
    return new Promise(function c(res){
        stream.on("end", res);
    });
}

var BASE_PATH = path.resolve(
    process.env.BASE_PATH || __dirname
);

var OUTFILE = path.join(BASE_PATH, "out.txt")

if (args.help){
    printHelp();
}

else if (
    args.in ||
    args._.includes('-')
){

    let tooLong = CAF.timeout(3)
    processFile(tooLong, process.stdin)
}
//join used to be resolve. Check the docs. 
else if (args.file) {

    let stream = fs.createReadStream(path.join(BASE_PATH,args.file));

    let tooLong = CAF.timeout(3, "Took too long");

    processFile(tooLong, stream)
    .then(function(){
        console.log("Complete!")
    })
    .catch(error);
}
else {
    error("Incorrect Usage", true);
}

//****************************/

function *processFile(signal, inStream) {
    var outStream = inStream;

    if (args.uncompress){
        let gunzipStream = zlib.createGunzip();
        outStream = outStream.pipe(gunzipStream);
    }

    var upperStream = new Transform ({
        transform(chunk,enc,cb){
            this.push(chunk.toString().toUpperCase());
            //setTimeout(cb,500); // <-- uncomment this line (and comment out the next line) to prove the chunkiness of this operation
            cb();
        }
    });

    outStream = outStream.pipe(upperStream)

    if(args.compress) {
        let gzipStream = zlib.createGzip();
        outStream = outStream.pipe(gzipStream)
        OUTFILE = `${OUTFILE}.gz`;
    }

    var targetStream; 
    if(args.out) {
        targetStream = process.stdout
    } else {
        targetStream = fs.createWriteStream(OUTFILE);
    }
    outStream.pipe(targetStream);

    signal.pr.catch(function f(){
        outStream.unpipe(targetStream);
        outStream.destroy();
    });

    yield streamComplete(outStream);
}

//note the use of a default value
function error(msg, includeHelp = false){
    console.error(msg);
    if (includeHelp) {
        console.log("");
        printHelp();
    }
}

function printHelp() {
    console.log("ex3 usage:")
    console.log("     ex3.js --file={FILENAME}")
    console.log("")
    console.log("--help                 print this help")
    console.log("--file={FILENAME}      process the file")
    console.log("--in, -                process stdIn")
    console.log("--out                  print to stdout")
    console.log("--compress             will gzip output")
    console.log("--uncompress           unzip an input")
    console.log("")
    console.log("\"Don't ask me, cause I just don't know - Adrock\"")
}

/*

NOTES: Determining the end of the stream. aka Async
async function processFile(inStream)
await streamComplete(outStream);

Dis cool but there is no way to stop midstream because Promises are a black box of who-knows-what

Async timeouts and cancellation


Generator vs. Async
async await
* yeild
*/