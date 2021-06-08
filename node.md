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
