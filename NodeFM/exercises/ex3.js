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

NOTES: Determining the end of the stream. aka Async.
As the project stands in ex2.js, if I add a console log at the end of processStream that prints "Complete!"
that log will print before the stream is processed for all the reasons that you already now about threads
in Java. This needs controlled for real world applications.

Adding the 
async function processFile(inStream)
await streamComplete(outStream);

By changing the processFile function to be async and awaiting a streamComplete, a Promise is being added 
to the process. streamComplete is a help function on lines 20 - 25. It takes a stream, returns a new Promise 
the callback function of which looks for a response (the first param "end") and a callback of what to do with that 
res (in this case it just returns the response no callback is necessary).

This streamComplete helper is awaited at the end of the processFile function to tell the function to wait
for the "end" response from the stream.

This cool but there is no way to stop midstream because async and fs.read are optimistic function. Furthermore,
Promises are a black box of who-knows-what. Someone knows what, right? 

Async operations can be timed-out and cancelled using Generators and a package or two.

This whole second step hinges on the 'caf' package but above the following changes are used to create a async
function that can respond to interuptions
line 11 - caf is imported
line 18 - processFile is reassigned as caf(processFile)
lines 41-42 - a timeout is added to the --in command and the signal param is present.
line 49 - timeout duration set. this is the signal
line 51 - signal added to params
line 63 - The function is changed to a generator and a signal is added as a parameter.
lines 95-97 - What the signal actually does is set. Disconnect and destroy the pipe.
line 100 - awiat changed to yeild

Syntax of Generator vs. Async
async and await === * and yeild
*/