# Javascript: the Hard Parts

## Standard Javscript Execution
variable environment - the variables stored in memory around what I am doing

excecution context the sum of the variable environment (memory) and the thread of execution equal the execution environment. There is both a global and local execition context. Global is catagorized by the global variables and functions. The local excecution context is generated to execute the contents of functions in memory. 

Inside each local execution context exists the same two feature - a variable environment (memory) and a thread of execution. The product of these local execution contexts is returned to the global execution context (or next layer up).

This all happens due to the fact that Javascript is single threaded. This takes places as a stack (Dijkstra's Algorithm / calculator). Push/Pop = add and remove from a stack.

## Asynchronicity

Simply put, single threaded execution is not viable for tasks that take a long time. 

The features that allow asynchronicity exist in the browser not in Javascript.

*These exist in the browser not in Javascript:*
- DOM
- Console
- XHR
- Local Storage

(background threads, APIs, browser features)

Javascript does not have a timer. setTimeout spins up a web browser feature called timer. setTimeout is a facade function and it does not, in any meaningful way, create a execution context. 

The callstack and all global synchronous code must be complete before the result of a background threads is allowed back into Javascript. The results of these background threads (aka APIs, browser features, etc) are placed in a queue (aka task queue, callback queue) which wait until Javascript allows them back into the stack. The checking of this rule and allowing of items back into Javascript from the task queue is called the Event Loop. This callback queue is a Javascript feature. 

The queue holds the address in memory of a function it does not hold the funciton. That means that the line `setTimeout(printHello, 1000)` is absolutely not running `printHello()`. 



