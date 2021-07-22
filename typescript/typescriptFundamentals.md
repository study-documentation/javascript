# Typescript with friends

## Where Javascript ends and Typescript begins (a Javascript recap)

Type conversion and type cohersion

`30 + 7` = `37`
`'30' + 7` = `377`
`'30' - 7` = `30`
`(+ '37')` = `37`

`(+ <some input>)` this is called the unary + operator tries to convert things into a number. `+` the plus (concat) operator tries to convert things to strings. Thats confusing.

you need to use the typescript compiler side by side with babel. static analysis.

# TYPES

## Implicit Typing

You dont need to assign the type at assignment. If a variable is defined such as `let teacherAge = 34` Typescript implicitly knows that this is a number and will not allow `teacherAge` to be resassigned as a string.

## Explicit Typing and Casting

`let teacherAge: number = 34;`

`let input = document.querySelector('input#name_field') as HTMLInputElement`
casting is done via the `as` keyword

functions are typed as follows...

```
function doSammy(username: string, password: string) : User {
    return a sammy;
}
```

Return type is after the variable declaration

`const doSammy = (username: string, password: string) : User => { do a sammy }`

## Object Shapes

Java - nominal type system. These systems care about what a class/type is named. Is it a String or Integer. Does the code declare a `new` instance of this type.

Typescript - structural type system. Shape refers to the names of the properties and the types of the property values. Objects have shape. Shape is the minimum required data for creating an object. Too few properties leads to an error. Additional properties are fine. `instanceOf` is not an option in Typescript because of this structural typing.

**fun facts**: `parseInt(124, 10).toString(16)` converts to a base 16, hexadecimal, number.
Here is a tidy way to confine inputs between two values `.map(<variable> => Math.max(0 , Math.min(255, <same variable>)).toString)`... Its cool.

## Interfaces and Excess Property Checking

When working with object literals only required properties can be specified. There is room for optional properties. But at its base Typescript is only interested in the known properties of of an object.

Outside of optional properties casting can be used as well. The Typescript compiler will throw an error using this method and the additional property will not be accessible. This is where interfaces come in to play.

```
interface Car {
    make: string;
    model: string;
    year: number;
};

let myCar: Car = { make: 'Subaru', model: 'Outback', year: 2018}
```

Similar to a Java interface **BUT** Java interfaces only allow method signatures whereas Typescript interfaces allow properties as well. Can be exported and consumed by other modules.

Interfaces can `extend` other interfaces.

## `never` and `any`

`any` allows for any data type to be assigned to a given variable. In a way this is indicating a return to standard Javascript for that block of code.

```
let age = 34;
let myAge = age as any;
myAge = '35';
```

'never' is the complete opposite. Nothing can be assigned to a `never`. This can be useful for blocks of code that must be unreachable. This is, in a way, the compile time equivalent of throw.

NOTE: The `problems` tab in the VSCode terminal is useful when working with Typescript.

# CLASSES

## Methods

There are static methods now! Thats so Java. Thats so nice!

Note: One way that protoypes and classes differ is that the attributes of prototypes are shared across all instances. So, all prototype attributes are like static fields in a Java class. Prototype is not like Class.

## Inheritance

```
class Employee extends Person {
    constructor(id, name) {
        super(name);git status
        this._employeeId = id
    }
    toJSON() {
        return {
            ...super.toJSON(),
            id: this._employeeId
        };
    }
}
```

Note that `super` is being used in 2 ways here once for calling the inherited constructor and once for the purpose of overriding a method this is how overriding is handle in JS & TS. Note to the different ways super is being called on as a method call and the other as a method call.

## Species

A species can be thought of as a string that will never collide with another string.

## Mixins

Mixins are abstract classes for TS

## Classes like interfaces need a defined shape

```
class Car {
    make: string
    model: string
    year: number
    constructor(make: string,
                model: string,
                year: number) {
        this.make = make;
        this.model = model;
        this.year = year;
    }
    startEngine() {
        return 'VROOOOOOM!';
    }
}

let myCar =
    new Car('Honda', 'Accord', 2017);
```

## ENUMS

```
enum AcctType {
    Checking,
    Saving,
    MoneryMarket
};

type Acct =
    [number, AcctType];

let account: Acct = [
    9142.14, AcctType.Checking
];
```

## Arrays and Tuples

this is an array...
`let nums: number[] = [1,2,3,4]`

this is a tuple...

```
let dependency: [string, number];
dependency = ['react', 16];
```

## Type Aliases

`type Color = [number, number, number];`
`let red: Color = [255, 0, 0];`

Tuples of a certain format can be given an alias. This makes identification much easier. The array above code easily be a set of coordinates OR an RBG color. Naming the tuple Color makes the whole lot easier. Like everyhting else these Aliased types can be exported and whatnot.

# Objects Literals

## Enhanced Object Literals

```
let company = 'upsie';
let ryan = {
    __proto__: MyObject.prototype,
    name: 'Ryan',
    age: 35,
    company,
    [`${company}Title`]: 'Staff Engineer',
    toString(){
        return `${super.toString()} + ${this.name} - ${this.age}`;
    }
}
```

Note that:

- prototypes can be declared inline in the object shape
- company is shorthand for company: company
- [`${company}Title`] is a dynamic property name
- this object contains a super call inside a method

## Destructured Assignment

```
let person = {
    name: {
        first: 'Ryan'
        last: 'Hufford'
    },
    langauges: {
        backend: {
            elixir: {
                experience: '3 years'
            }
        }
    };

    let {
        name: { first },
        languages: { backend: serverSkills }
    } = person;
}

console.log(``${first} - ${Object.keys(serverSkills)}');
```

This will log `Ryan - 3 Years`.

## Rest and Spread

Use these to avoid typecasting when creating new objects that build off of others.

**Rest**
Rest is a catch all for the remainder of the data in this object. So x is equal to x and ...other is equal to the rest of the atttributes in the object. Rest is on the left side of the equality operator.

```
let data = {x: 34, y: 21, z: 0.1};
let {x, ...other} = data;
console.log(others);
```

This returns `{ y: 21, z: 0.1 }`

**Spread**
Spread is an operator that places data from one object into another object or data structure. Spread is on the right side of the operator.

```
let values = { ...other, a: 97, b: 42 };
console.log(values);
```

This returns `{ y: 21, z: 0.1, a: 97, b: 42 }`

## Getters and Setters

```
let name = {
    first: 'Ryan',
    last: 'Hufford',
    get full() {
        return `${this.first} ${this.last}`;
    },
    set full(newVal) {
        let [a,b] = newVal.split(/\s+/g);
        this.first = a;
        this.last = b;
    }
}

console.log(name.first, name.last);
name.full = 'Glorbin Bjorbin'
console.log(name.first, name.last);
```

this will return `Ryan Hufford` and `Glorbin Bjorbin`.

## Function: Types

This is a function type...
`let login: (username: string, password: string) => User;`

This is a function value...
`login = (username, password) => {return new User(); };`

Interfaces can be used to frame out functions as well.

Good ahead and create arrays of functions. Why not?

## Function: Parameters

You must enter an argument for every parameter. There is a work around for this by using the optional operator (`?`)

`|` <-- union type aka a bitwise `or` operator. Such that...

`let criticalURL: URL | undefined` <-- allow for this variable to be undefined.
-or-
`criticalURL = imageURL || fallbackURL;` <-- if the `| undefined` was left out of the declaration above, this line would work. Here it is saying if critical URL is a parameter it must be assigned so give it this fallback value.
-or-
`function createTwitterPost(body: string, userName: string, imageURL?: URL){}` <-- add the optional operator.

```
funciton createTwitterPost(body: string,
                        username: string = 'computerDude42'),
                        imageURL?: URL) {
  // ....
}
```

Note above the the username param has a default value and the imageURL is an optional.

```
function doSammy(bread: string,
name: string,
...toppings: string[]) {
/_ do some sammy stuff! _/
}
```

Above a rest parameter is being used similar to a vararg in Java. It says this chunk of data is to be captured in a toppings array. Only one and always goes at the end for obvious reasons.

## Generics

```
function gimmieFive<T>(x: T): T[] {
    return [x, x, x, x, x]
}
```

`function midpoint<T extends Point2D>(p1: T, p2: T){}`
Generics behave the same way as in Java. They can be made more specific by using `extends`.

## Access Modifiers

- public - anyone can access
- protected - self and subclasses
- private - self reference only
- static - class referencing
- readonly - similar to final in Java

## Function Overloading

Again same as Java. create them most specific to least specific.

# Iterators & Generators

## Iterators

An object that has a function on it called next. The value this function returns has two properties on it (value and done). That next There you go.
