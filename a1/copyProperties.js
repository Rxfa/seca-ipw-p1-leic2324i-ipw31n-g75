import assert from "assert";
import { validateProperty } from "./validateProperty.js";

function copyProperties(obj, propValidators){
    let newObj = {};
    propValidators.map(validator => {
        if(validateProperty(obj, validator)){
            newObj[validator.name] = obj[validator.name]
        }
    })
    return newObj
}

const validators = [
    {
       name: "p1", validators: [s => typeof s == 'string' && s.length > 2, s => s[0] == "a"]
    },
    {
       name: "p2", validators: [s => Number.isInteger(s)]
    }
 ]

const validators2 = [
    {
        name: "name", validators: [s => typeof s === 'string' && s.length > 2, s => Array.from(s).every(char => char.match(/[a-z]/i))]
    },
    {
        name: "age", validators: [s => typeof s === 'number', s => s >= 0 && s <= 120]
    }
]
 
const obj1 = { p1: "a" }
const obj2 = { p1: 123 }
const obj3 = { p1: "abc", p2: 123 }

const obj4 = { name: "Alice", age: 23 };
const obj5 = { name: "Alice", age: 119.4 };
const obj6 = { name: "Bob", age: -5};
const obj7 = { name: "Bob", age: "24"};
console.log(copyProperties(obj1, validators)) // {}
console.log(copyProperties(obj2, validators)) // {}
console.log(copyProperties(obj3, validators)) // { p1: 'abc', p2: 123 }   
console.log(copyProperties(obj4, validators2)) // { name: 'Alice', age: 23 }   
console.log(copyProperties(obj5, validators2)) // { name: 'Alice', age: 119.4 }   
console.log(copyProperties(obj6, validators2)) // { name: 'Bob' }   
console.log(copyProperties(obj7, validators2)) // { name: 'Bob' }   
 
assert.deepEqual(copyProperties(obj1, validators), {})
assert.deepEqual(copyProperties(obj2, validators), {})
assert.deepEqual(copyProperties(obj3, validators), { p1: 'abc', p2: 123 } )
assert.deepEqual(copyProperties(obj4, validators2), { name: 'Alice', age: 23 } )
assert.deepEqual(copyProperties(obj5, validators2), { name: 'Alice', age: 119.4 } )
assert.deepEqual(copyProperties(obj6, validators2), { name: 'Bob' } )
assert.deepEqual(copyProperties(obj7, validators2), { name: 'Bob' } )