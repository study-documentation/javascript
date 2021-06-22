#!/user/bin/env node

"use strict";

var util = require('util') // oodles of utils
var path = require('path'); // local file paths
var fs = require('fs'); // access file system
var getStdIn = require('get-stdin'); // dont build your own logic if you dont have to dumby
const { connect } = require('http2');

var args = require("minimist")(process.argv.slice(2), {
    boolean: [ "help", "in" ],
    string: [ "file" ]
});

var BASE_PATH = path.resolve(
    process.env.BASE_PATH || __dirname
);

if (args.help){
    printHelp();
}

else if (
    args.in ||
    args._.includes('-')
){
    getStdIn().then(processFile).catch(error);
}
//join used to be resolve. Check the docs. 
else if (args.file) {
    fs.readFile(path.join(BASE_PATH,args.file), function onContents(err, contents){
        if(err) {
            error(err.toString());
        } else {
            processFile(contents.toString())
            // console.log will print the binary buffer not the file contents as a string.
        }
    });
}
else {
    error("Incorrect Usage", true);
}

//*************************** */

function processFile(contents) {
    contents = contents.toUpperCase();
    process.stdout.write(contents);
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
    console.log("ex1 usage:")
    console.log("     ex1.js --file={FILENAME}")
    console.log("")
    console.log("--help                 print this help")
    console.log("--file={FILENAME}      process the file")
    console.log("--in, -                process stdIn")
    console.log("")
    console.log("\"Don't ask me, cause I just don't know - Adrock\"")
}