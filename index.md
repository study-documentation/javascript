# Javascript

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
Array.find( function(fruit) {
	return fruit.taste === ‘tart’;
});
```

`Array.findIndex()` - this finds the index of a desired object<br>

