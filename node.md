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
