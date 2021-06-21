node app.js 1>/dev/null <-- prints to stdout
node app.js 2>/dev/null <-- prints to stderr

## Command Line Scripts
```
#!/user/bin/env node

"use strict";
```

The first line in the above code is call the hashbang line and it says hey go find node where ever it is on a given machine and run this script in it.

`chmod u+x <file name>` <-- gives executable permission to a file.

put help outputs into all scripts

The package `minimist` is used to parse out possible command line aruguments. Using this means we dont have to configure that `--help` and `-h` are both requests for help. 
```
var args = require("minimist")(process.argv.slice(2), {
    boolean: [ "help" ],
    string: [ "file" ]
})
```
`slice(2)` is added becasue we dont need the first to arguments. They are just rando paths. F'em. The second argument in the minimist config params alter the default minimist values as they apply to specific commands in the script that is being built. 

Note that we can now pass `args.help` and `args.file`. since they are params and members of the args array they can be called this way an dhave functions wired into them.


### Argument Handling

