# NODE

What better way to learn node.js than to write oneself a textbook.

## Intro

node is not a framework nor a language. It is a runtime environment. Specifically, a nonblocking asynchronous runtime environment. This means a single thread handles multiple requests. The single thread uses an event queue to move between tasks. This architecture makes Node great for I/O intensive apps and less ideal for CPU intensive apps.

## Node Module System

The node module system is the architecture in place which allows for inheritance between files that will be passed through the node runtime environment

### Creating a Module

`console.log(module)` reveals a JSON description of a given module. One of the properties is a list called `exports`. This list contains the members of that file which have been made public. This is accomplished via the following syntax.
`module.exports.<name to be displayed in exports> = <name of member to be exported>;`

This syntax provides a simplified means of exporting isngular methods.
`module.exports = <name of function to be exported>`

### Loading a Module

`const <some name> = require('./<name of file>')`
It is best to store this required module in constant so that accidental changes are not made to the root object which would cause a runtime error. Any changes will made when using this syntax will force a compile time error.

### Module Wrapper Function
