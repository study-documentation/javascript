# Javascript: the Hard Parts

## Standard Javscript Execution

variable environment - the variables stored in memory around what I am doing

excecution context the sum of the variable environment (memory) and the thread of execution equal the execution environment. There is both a global and local execition context. Global is catagorized by the global variables and functions. The local excecution context is generated to execute the contents of functions in memory.

Inside each local execution context exists the same two feature - a variable environment (memory) and a thread of execution. The product of these local execution contexts is returned to the global execution context (or next layer up).

This all happens due to the fact that Javascript is single threaded. This takes places as a stack (Dijkstra's Algorithm / calculator). Push/Pop = add and remove from a stack.

## Asynchronicity

Simply put, single threaded execution is not viable for tasks that take a long time.

The features that allow asynchronicity exist in the browser not in Javascript.

_These exist in the browser not in Javascript:_

- DOM
- Console
- XHR
- Local Storage

(background threads, APIs, browser features)

Javascript does not have a timer. setTimeout spins up a web browser feature called timer. setTimeout is a facade function and it does not, in any meaningful way, create a execution context.

The callstack and all global synchronous code must be complete before the result of a background threads is allowed back into Javascript. The results of these background threads (aka APIs, browser features, etc) are placed in a queue (aka task queue, callback queue) which wait until Javascript allows them back into the stack. The checking of this rule and allowing of items back into Javascript from the task queue is called the Event Loop. This callback queue is a Javascript feature.

The queue holds the address in memory of a function it does not hold the funciton. That means that the line `setTimeout(printHello, 1000)` is absolutely not running `printHello()`.

- fetch is also a facade function

## Promises

Promises work in both the web browser and in Javascript. The two prongs of a Promise 1) return an immediate value to Javascript and 2) spin up a web browser function and replace the initial value with its result after that process is completed and it is returned to the call stack.

Fetch immediately returns an object with a property on it called `value` that is undefined with a hidden object called `on fulfillment`. `on fulfillment` is an array of functions that are triggered when `value` is updated with `value` as the argument. `value` will be updated when the web browser returns the result of the spun up function.

This object that contains `value` & `on fulfillment` is a Promise. Therefore, fetch returns a Promise.

The function that is spun up in the browser by fetch is XHR.

Given all this, if there is a block of code such that `const futureData = fetch('https://twitter.com/me/tweets/12')`, futureData.value is a valid entry later in the code.

`.then()` places a function into the `on fulfillment` array. For example, `futureData.then(diplay)` says place the function `display` into `futureData`'s `on fulfillment` array and use value as the argument. `.catch()` places a function into the `on rejection` array.

microtask (aka job) queue supercedes the task queue. Call stack(all tasks) --> Microtask queue(all tasks) --> task queue. The microtask queue can, therefore, starve the task queue.

In the following block of code:

```

```
