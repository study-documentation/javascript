# NODE

What better way to learn node.js than to write oneself a textbook.

## Intro

node is not a framework nor a language. It is a runtime environment. Specifically, a nonblocking asynchronous runtime environment. This means a single thread handles multiple requests. The single thread uses an event queue to move between tasks. This architecture makes Node great for I/O intensive apps and less ideal for CPU intensive apps.

## Node Module System

The node module system is the architecture in place which allows for inheritance between files that will be passed through the node runtime environment

### Creating a Module

`console.log(module)` reveals a JSON description of a given module. One of the properties is a list called `exports`. This list contains the members of that file which have been made public. This is accomplished via the following syntax. <br>
`module.exports.<name to be displayed in exports> = <name of member to be exported>;`<br>

This syntax provides a simplified means of exporting singular methods.<br>
`module.exports = <name of function to be exported>`<br>

### Loading a Module

`const <some name> = require('./<name of file>')`<br>
It is best to store this required module in constant so that accidental changes are not made to the root object which would cause a runtime error. Any changes will made when using this syntax will force a compile time error.

### Module Wrapper Function

Node does not execute code directly. It wraps the code in each module in one of many global functions.<br>
`(function(exports, require, module, __filename, __dirname))`<br>

## Built-in Node Modules

The list of built-in node modules and in [nodes documentation](https://nodejs.org/dist/latest-v14.x/docs/api/)

### Path module

Begin with the statement `const path = require('path');`<br>
The code below will display what exactly a path object contains...<br>

```
var pathObj = path.parse(__filename);
console.log(pathObj)
```

this code returns...

```
{
  root: '/',
  dir: '/Users/ryanmhufford/Programming/JavaScript, HTML, CSS/Javascript/Node',
  base: 'app.js',
  ext: '.js',
  name: 'app'
}
```

### OS Module

The OS module is a means for inspecting the state of the operating system. The code below checks and logs the total and free memory of a machine. Do you have enough space to complete this download?

```
const os = require('os');
const totalMemory = os.totalmem();
const freeMemory = os.freemem();
console.log(`Total Memory ${totalMemory}`);
console.log(`Free Memory ${freeMemory}`);
```

### File System Module

The methods available to the file system module come in pairs. Each method has an asychronous and synchronous option. Node is built upon a nonblocking asynchronous architecture, so use that. The code below demonstrates a simple directory read as both synchronous and asynchronous calls. The result is the same as `ls` in command line.

```
const fs = require('fs');
const files = fs.readdirSync('./');
console.log(files);
const asyncFiles = fs.readdir('./', function(err, files){
    if(err) console.log('Error', err);
    else console.log('Result', files)
});
```

Note: this is not proper error handling. It is just a demonstration of the fact that asynchronous methods require a callback method as the second argument.

### Events Module

Events are a core concept to the node architecture. Events are a signal that somehting has happened. For example, every HTTP request to a given port is an event. Responding to these events is the purpose of this module. The order of creation is important in calling listening and raising. Listeners must be declared first as the emit method iterates through the list of all existing listeners.

```
const EventEmitter = require('events');
const emitter = new EventEmitter();

//register a listener
emitter.on('messageLogged', function(){
    console.log('listener called')
})

//raise an event
emitter.emit('messageLogged')
```

Note: `EventEmitter` is written in pascal notation becuase it is a class not a function or value. Thus why a `new` EventEmitter must be created.

#### Event Aruguments

It is often the case that information must be created about an event or include. The code below demonstrates how this is completed. Note the addition of an arrow function to `.on` to handle the arg and the arg object added to `.emit`. The arg object added to emit is a better option than arbitrary arguments of the form `emitter.emit('messageLogged', 1, 'http://')`

```
emitter.on('messageLogged', (arg) => {
    console.log('listener called', arg)
});

emitter.emit('messageLogged', { id: 1, url: 'http://'})
```

#### Extending EventEmitter

In real applications it is more practical to build a utility EventEmitter class and call it throughout a program.

The log file used early should be updated.

```
const EventEmitter = require('events')

var url = 'http://mylogger.io/log'

class Logger extends EventEmitter{
    log(message) {
        //Send an HTTP request
        console.log(message);

        //Raise an event
        this.emit('messageLogged', {id: 1, url: 'http://'})
    }
}

module.exports = Logger;
```

(Note: emitter is deleted and references to it are changed to `this`.)

Now in the app.js file.

```
const EventEmitter = require('events');

const Logger = require('./logger');
const logger = new Logger();

logger.on('messageLogged', (arg) => {
    console.log('listener called', arg)
});

logger.log('message');
```

(Note: emitter is deleted and replaced by logger as it is now the source for all event methods.)

### HTTP Module

EventEmitter is baked into the HTTP module. HTTP objects inherit all event methods.

```
const http = require('http')

const server = http.createServer();

server.on('connection', (socket) => {
    console.log('New Connection...')
});

server.listen(3000)

console.log('listening on port 3000...');
```

Given the code above entering `node app.js` into the terminal and then `localhost:3000` into a browser will result in `new connection...` appearing in the terminal.
Typically, a callback function will be placed directly into the `http.createServer()` method. For example,

```
const server = http.createServer((req,res) => {
    if (req.url === '/') {
        res.write('7 Baconators, please and thank you');
        res.end();
    }
});

server.listen(3000)

console.log('listening on port 3000...');
```

Now, `7 Baconators, please and thank you` appears in the browser. Additionally, inside this createServer method is where routing of endpoints can be handled, such that...

```
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
```

All of this said, this is a low level view of HTTP req/res in Node. It is typically via `express` that this work takes place.

## Node Package Manager

The heaviest thing in outter space.

### package.json

Given a framework that automatically creates the package.json is not being used the following commands will create it. This should be completed prior to installing npm.
`npm init` <br>
or <br>
`npm init --yes` <br>

### Installing a Node Package

adding a third party library to a node project.
The library of third party libraries is [available here.](https://www.npmjs.com) Install instructions are available with each item.
That said, its `npm i <name of the thing>`
`--save` is no longer needed but it was a thing.

### Using a Package

pop this familiar duder at the top of the file.<br>
`var _ = require('underscore');`<br>
where<br>
`var <assigned name> = require(<name of module in dependencies>)`v

### Version Control

Make sure that all projects have a `.gitignore` with `node_modules/_`.

### Semantic Versioning

`major version . minor version . patch release`<br>

- Major - Addition of a feature which might break an older API
- Minor - Addition of a feature without breaking the existing API
- Patch - Fix of a bug with in a minor version
  `"^1.4.8"` <-- any minor version within 1<br>
  `"~1.4.8"` <-- any patch release within 1.4<br>

### List the Installed Packages

`npm list` will display a tree with all dependencies.
`npm list --depth=0` will list just application dependencies.

### Viewing Registry Info for a Package

`npm view <name of package>` will display all the meta data about a package.
The following flags will narrow the results of this view.

- `dependencies`
- `versions`

### Upgrading/Downgrading a Package

`npm i <name of package@x.y.z>`

To find out if a certain dependency is out-of-date run...<br>
`npm outdated` <-- this will display the Current, Wanted and Latest

To update...<br>
`npm update` <-- this will only update within the current major version so the app does not break
`npm i <name of package>@<x.y.z>` <-- to update to the latest version. However, this would take a long time to complete for multiple dependencies.

To update for an entire project.
`npm i -g npm-check-updates` <-- this is a command line tool that will check for and update to latest version.
`ncu -u` <-- this will update the package.json.
`npm i` <-- run this next to bring node modules up-to-date with the package.json

### DevDependencies

Certain dependencies should not be included in production. Testing and such.
`npm i <name of package> --save-dev`

### Uninstalling a Package

`npm un <name of package>`

### Working with Global Packages

pop a `-g` in there. Bada Bing.

### Publishing Packages to the Registry

Create a project via the steps outlined above.
An npm.js account is necessary and can be created in the command line via...  
`npm adduser`<br>
Or login via...  
`npm login`<br>
Then run...  
`npm publish`<br>

Now in other projects this package will be available in other projects via...<br>
`npm i <name of package>`

### Updating a Published Package

`npm version <major, minor or patch>` <-- the given version will be incremented
