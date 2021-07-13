# Typescript with friends

## Where Javascript ends and Typescript begins (a Javascript recap)

Type conversion and type cohersion

`30 + 7` = `37`
`'30' + 7` = `377`
`'30' - 7` = `30`
`(+ '37')` = `37`

`(+ <some input>)` this is called the unary + operator tries to convert things into a number. `+` the plus (concat) operator tries to convert things to strings. Thats confusing.

you need to use the typescript compiler side by side with babel. static analysis.

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

Typescript - structural type system. Shape refers to the names of the properties and the types of the property values. Objects have shape. Shape is the minimum required data for creating an object. Too few properties leads to an error. Additional properties are fine.

**fun facts**: `parseInt(124, 10).toString(16)` converts to a base 16, hexadecimal, number.
Here is a tidy way to confine inputs between two values `.map(<variable> => Math.max(0 , Math.min(255, <same variable>)).toString)`... Its cool.

## Interfaces and Excess Property Checking
