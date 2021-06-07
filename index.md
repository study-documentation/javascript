# Javascript
What better way to refresh on syntax than by writing oneself a `Javascript` textbook?

## Basics of JavaScript

### Variables

var, let, cont

var - function scope
let - block scope
const - read only block scope

- Variables in Javascript default to undefined (different than null). 
- Cannot be a reserved keyword
- Meaningful descriptive
- Cannot start with a number, duh
- Cannot contain a space or hyphen
- They are case sensitive

`let var, var1, var2` <— this is legal but hella stupid.

---

### Primitive Types

Primitives are copied by value
- String - convention is to close in ‘’
- Number - includes both integers and floats
- Boolean - true or false (no caps)
- Undefined - yet to be initialized. Can be set explicitly. Both a value and type.
- Null - used to explicitly clear the value of a variable (i.e. if nothing selected set to null)
- Symbol - a unique value used as an identifier

---

### Reference Types

Objects are copied by their reference (location in memory)
- Object
- Function 
- Array

---

### Dynamic Typing

In dynamically typed languages the type of a variable can be changed.

`let name = ‘Duder’;` <br>
`name = 30;` <br>
This is valid in Javascript.

---

### Objects

Objects in JS are a collection of key value pairs

```
let person = {
	name: ‘sandwich’,
	age: 87
}
```

- console.log(person) will log the object properties to the console.
- person.age returns 87
- person[age] also returns 87 <— good for dynamic situations in which target property is selected by a user and unknown until runtime

---

### Arrays

`let foods = [];`<br>
Initialized as an empty array

`let foods = [‘burger’,’ice cream’,’generic food item’];`<br>
Initialized with values

`let foods = [‘burger’,true, 30];`<br>
This is fine

`let foods[3] = ‘more burgers’`<br>
Also fine, just go ahead and add stuff

---

### Functions

```
function addthings( value1, value2) {
	return value1 + value 2;
}
```

---

### Operators

=== - strict equality operator (same type and value)<br>
== - loose equality operator (converts the item on the right to the same type as the value on the left and then check the values) <br>

#### Ternary 

if this condition is true ? do this : else this;
If miles on fiat are above 50,000 engine is dead

`let miles = 51000`<br>
`let engine = miles > 50000 ? ‘not dead’ : ‘dead’;`<br>

---

### Control Flow

#### if ... else
```
if (condition) {
  action;
}
else if (condition) {
  action;
}
else
  action;
```

#### Switch Case
```
switch(uponSomeCondition) {
  case 'nameOfCase':
    actions;
    break;
  case 'nameOfSecondCase':
    actions;
    break;
  default:
    action if no cases are met;
}
```

#### For Loops
```
for (let i = 0; i < someValue; i++/--){
  actions upon iteration
}
```

#### While Loops
```
while(condition){
  actions
  maybe increment a counter. who knows.
}
```

#### Do ... While
```
do{
  some logic
} while (condition);
```

#### For ... In
Iterate over the properties of an object.
```
for (let key in object){
  some logic upon object[key];
}
```
(note: legit use of bracket notation)

#### For ... of
Iterate over the elements in an iterable (i.e arrays and maps). Objects are not iterable. That said, Object.keys IS iterable. So is Object.entries. 
```
for(let number of numbers){
  number ** 728;
}
```

---

### Arrays

#### Altering Arrays

`const numbers = [3, 4];`<br>
`numbers.push()` - add to the end<br>
`numbers.unshift()` - add to the beginning <br>
`numbers.splice(index to start adding, how many things to delete, stuff to add)`<br>


#### Finding Elements

##### Finding primitives
`numbers.indexOf(elementToFind, a second param is used to indicate where the search starts)`<br>
`numbers.lastIndexOf(someMess)`<br>
`numbers.includes(someKindOfThing)` - returns boolean<br>

##### Finding objects
Includes will not work since the address in memory of the object to be found and the address in memory of the actual object will differ.
Use `nameOfArray.find()`<br>

Array.find requires a predicate. So…
```
array.find( function(fruit) {
	return fruit.taste === ‘tart’;
});
```
Clean this up with an arrow function...<br>
`array.find(fruit => fruit.taste === ‘tart’)`<br>
`array.findIndex()` - this finds the index of a desired object<br>


#### Removing Elements
`array.pop` - removes AND returns the last element in an array.<br>
`array.shift` - removes first element<br>
`array.splice(2,1)` - this says delete 2 elements starting at index 1<br>

#### Eviserate an Array
`array = [];` <— reassign it as an empty array. Only works on arrays assigned with ‘let’. Also garbage collection will not remove the array if there are any other references to the original array.<br>
`array.length = 0` <— this will truncate the array<br>
`array.splice (0, array.length)` <— “slash it, slash it” - Ron Swanson<br>


#### Combining and Slicing Arrays
```
array1 = [1,2,3]
array2 = [4,5,6]
```
Combine via..
`const newArray = array1.concat(array2)`<br>
Better yet use the spread operator…<br>
`const muchArray = […array1, …array2];`<br>

Slice via…<br>
`const newerArray = newArray.slice(2)` <— places everything beginning at index 2 into this new array.<br>


#### Iterating over an Array
If some logic is to be applied to each element in an array. Use .forEach()<br>
`array.forEach( param => action);`<br>


#### Joining Arrays
`array.join()` <— returns a string and joins using some character
`string.split()` <— converts a string into an array
```
let message = “regex is dumb”;
let array = message.split(“ ”);
let urlSlug = array.join(‘-’)
```
The result of this is —> regex-is-dumb


#### Sorting Arrays
`array.sort()`
`array.reverse()`

In the params of sort a predicate can be built that assumes the role of compareTo in Java. This is the method for sorting objects in JavaScript. So…
```
objects.sort(function(a,b){
	if(a.name < b.name) return -1;
	if(a.name > b.name) return 1;
	return 0;
});
```
This sorting is done by ascii value. So, case sensitivity is an issue written this way. Add a.name.toUppercase and b.name.toUpperCase to avoid sorting issues related to case.


#### Inspecting the Contents of an Array
This can be done via `array.every` and `array.some`. These are used on conjunction with a callback function. 


#### Filtering an Array
`const filtered = numbers.filter(value => value >=0);`<br>

Filter creates a new array as opposed to altering the original. This arrow function states filter into a new array the values in the original array that are greater than or equal to 0.


#### Mapping an Array
`array.map` allows me to map the elements of an array into another object. That can be into some HTML markup or as  property in a new object.

`const items = filtered.map(n => ({value: n}) );`<br>
With that line of code the an array of objects is created each of which has a property called value that is set to n. Note the parenthesis around the curly braces. This is vital if passing an object through an arrow function.

#### Chaining
Just like streams in Java the above functions can be chained. This simplifies code.
For example…
```
const numbers = [1, -1, 2, 3]

const items = numbers
.filter(n => n >= 0)
.map(n => ({value: n}))
.filter(obj => obj.value > 1)
.map(obj => obj.value)
```
Logging items results in an output of [2,3]


#### Reducing an Array
`array.reduce((accumulator, currentValue) => {return accumulator + currentValue}, 0);`

The first param is callback function and the second param is the initial value of the accumulator. The accumulator defaults to a the first element in the array. Therefore, 0 is not necessary.




