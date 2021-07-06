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

Promises work in both the web browser and in Javascript. The two prongs of a Promise 1) return an immediate value to Javascript and 2) spin up a web browser function and replace the initial value with its result after that process is completed and it is returned to the call stack. Promises can be in one of three states pending, fulfilled, rejected.

Fetch immediately returns an object with a property on it called `value` that is undefined with a hidden object called `on fulfillment`. `on fulfillment` is an array of functions that are triggered when `value` is updated with `value` as the argument. `value` will be updated when the web browser returns the result of the spun up function.

This object that contains `value` & `on fulfillment` is a Promise. Therefore, fetch returns a Promise.

The function that is spun up in the browser by fetch is XHR.

Given all this, if there is a block of code such that `const futureData = fetch('https://twitter.com/me/tweets/12')`, futureData.value is a valid entry later in the code.

`.then()` places a function into the `on fulfillment` array. For example, `futureData.then(diplay)` says place the function `display` into `futureData`'s `on fulfillment` array and use value as the argument. `.catch()` places a function into the `on rejection` array.

Job (aka microtask) queue is prioritized over the callback queue by the event loop. Call stack(all tasks) --> Job queue(all tasks) --> Callback queue. The microtask queue can, therefore, starve the task queue.

In the following block of code, ...

```
function display(data){console.log(data)};
function printHello(){console.log("Hello")};
function blockFor300ms(){some function that takes 300 ms to complete}

setTimeout(printHello(), 0);

const futureData = fetch('https://twitter.com/me/tweets/12');
futureData.then(display)

blockFor300ms();

console.log("Me first!!");
```

... in what order will these asynchronous functions run?
1 - blockFor300ms
2 - console.log("Me first!!");
3 - display(data); fetch returns an object and triggers in javascript
4 - printHello(); triggered directly by the browser time

But why? Java script first runs synchronous code. That accounts for `blockFor300ms` and `console.log("Me first!!");`. Next, `display(data)` is run followed by `printHello`. But, `printHello()` was ready to be run since 1 ms after the program started. So, why is display run first? Since setTimeout relies on the browser time `printHello()` is called from the browser. The call for `printHello()` is waiting in the Callback queue. Display on the other hand is called via `then`. `then` is an async function that updates the value of a promise inside Javascript, not inside the browser. `then`, therefore initiates native JS code not browser functions. The product of `then` is added to the job queue which is given prioroty in the event loop.

## Iterators

Code typically is meant to store data and apply functionality onto it. Accessing data from a data structure is a job in and of itself. How this data is accessed (i.e. for vs. while loops) is irrelevant in instances in which every element in a structure is needed.

NOTE: Javascript never returns to look at past lines. This is simple the-behavior-of-reference-type stuff.

Important to understanding Iterators is the concept of "backpacks" which hold the live data surrounding a function. The technical term for this concept is "closure". This information is stored in a attribute is called `[[scope]]`. Javascript is a lexically (statically) scoped language.

Persistant Lexical Scoped Reference Data.

Closed Over Variable Environment.

closure (i.e. put those values in the closure)

backpack

The only meaningful way to create a backpack is to return a function from where it was born.

This code snippet demostrate the creation of a backpack...

```
function createFunction(){
    function add2(num){
        return num+2;
    }
    return add2;
}

const returnNextElement = createFunction([4,5,6]);
const element1 = returnNextElement();
const element2 = returnNextElement();
```

NOTE: returnNextElement is an object.

Since `createFunction` returns another function it is possible to set up an interator. `newFunction` creates a new execution context by calling returnNextElement. Inside `returnNextElement`, `add2` is called and returned. Upon `return` the execution context is deleted. All of its local memory is erased. However, Javascript creates the closure or "a backpack" in which that local data is appended to and travels with the reference to `createFunction`.

Any function that when called returns the next element in a flow of data is an `iterator` and they turn collections into streams. That's fine.

`symbol.iterator` <-- built in iterator

## Generators

In the code above the assumption is made that the return values for element1 and element2 are 4, 5. However, Javascript actually returns an object which has 2 attributes - value and done. It looks like this...

```
{
    value: 4,
    done: false
}
```

once the iterator makes it to 6, this done attribute changes to true. The point is that iterators return objects AND built-in iterator methods such as returnNextElement.next() are in fact objects. These are similar to the wrapper classes of java. Objects that wrap around a function.

Generators are a kind of object that allows persistant state AND a tracker of where we are in a function's execution. To clarify, Iterators did not have this tracker only the persisted state.

```
function *createFlow(){
    yield 4
    yield 5
    yeild 6
}

const returnNextElement = createFlow();
const element1 = returnNextElement.next();
const element2 = returnNextElement.next();
```

Execution context is state (memory) and what line of code the program is on. What yeild does is store the backpack of data as well as what line in the function was just run or it stores the execution context.
`yield` can be treated just as a `return`.
`[[generatorLocation]]`

Why `returnNextElement = createFlow();` instead of `element1 = createFlow().next;`? It is not the function createFlow that holds the `.next` method. It is the object that stems from referencing a generator function.

```
function *createFlow(){
    const num = 10
    const newNum = yeild num
    yield 5 + newNum
    yeild 6
}

const returnNextElement = createFlow()
const element1 = returnNextElement.next()
const element2 = returnNextElement.next(2)
```

**Remember that returnNextElement.next() returns an object, not just the int 10 or whatever is next to yield.** Also recall that Iterators are created by calling a function from within another function. `yeild` is, in a manner of speaking, taking the place of this nested function and assuming the role of the code that initiates the beginning of an iteration. The difference, again, being that `yeild` add the ability to track where in the interal execution context we are between exits. `yeild` is a psuedo-pause to the execution context. The way to unpause the execution context is `.next()`.

## Asynchronous Generators

**_block 1_**

```
function doWhenDataReceived (value){
    returnNextElement.next(value);
}

function *createFlow(){
    const data = yield fetch('https://twitter.com/me/tweets/12')
    console.log(data)
}

const returnNextElement = createFlow()
const futureData = returnNextElement.next()

futureData.then(doWhenDataReceived)
```

is equal to...

**_block 2_**

```
async function createFlow(){
    console.log("Me first")
    const data = await fetch('https://twitter.com/me/tweets/12')
    console.log(data)
}

const futureData = createFlow()

console.log("Me second")
```

**_block 1_** is a demostration of building async/await from scratch. Note, once again, that the yield keyword allows a thread to exit and return to a particular execution context.
