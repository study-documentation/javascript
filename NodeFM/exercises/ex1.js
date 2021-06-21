#!/user/bin/env node

"use strict";

var path = require('path'); // local file paths
var fs = require('fs'); // access file system

var args = require("minimist")(process.argv.slice(2), {
    boolean: [ "help" ],
    string: [ "file" ]
});

if (args.help){
    printHelp();
}
else if (args.file) {
    processFile(path.resolve(args.file));
    console.log(args.file)
}
else {
    error("Incorrect Usage", true);
}

//*************************** */

function processFile(filepath) {
    var contents = fs.readFile(filepath, function onContents(err, contents){
        if(err) {
            error(err.toString());
        } else {
            process.stdout.write(contents); 
            // console.log will print the binary buffer not the file contents as a string.
        }
    });
    
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
    console.log("")
    console.log("\"Don't ask me, cause I just don't know - Adrock\"")
}