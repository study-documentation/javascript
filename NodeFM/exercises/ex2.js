#!/user/bin/env node

"use strict";

var util = require('util') // oodles of utils
var path = require('path'); // local file paths
var fs = require('fs'); // access file system
var Transform = require("stream").Transform; // builtin. pick one off
var zlib = require("zlib"); // compress output. decompress input

var args = require("minimist")(process.argv.slice(2), {
    boolean: [ "help", "in", "out", "uncompress" ],
    string: [ "file" ]
});

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
    processFile(process.stdin)
}
//join used to be resolve. Check the docs. 
else if (args.file) {

    let stream = fs.createReadStream(path.join(BASE_PATH,args.file));
    processFile(stream);
}
else {
    error("Incorrect Usage", true);
}

//****************************/

function processFile(inStream) {
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
    console.log("ex2 usage:")
    console.log("     ex2.js --file={FILENAME}")
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

NOTES: Changing this whole jawn to be a stream handler

stream.pipe is a builtin method for readable streams. It pipes them into a writable stream and 
returns a readable which can them be piped into other writables and so on. Streams are more effiecient
than passing strings around. Streams, you will recall, are always binary data

Converting to a stream is done using the file system (fs) package. processFile has been updated to handle these
streams. These streams can be piped in and out of each other for the purposes of zipping or unzipping. But, the 
pattern of readables get piped into writables must be followed. processFile has gorwn significantly and ultimately
uses reassigning outStream to fulfill this pattern.

cat out.txt - print to terminal

Compressing and uncompressing are simple via zlib. zlib .createGzip(); and .createGunzip();

to uncompress and print in terminal:
cat out.txt.gz | node ./ex2.js --uncompress --in --out

to compress and create a new file:
node ./ex2.js --file=files/hello.txt --compress

*/