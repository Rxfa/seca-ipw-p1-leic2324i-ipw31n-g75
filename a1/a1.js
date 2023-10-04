const assert = require('node:assert').strict;

const validator = {name : "p1" , validators: [s => typeof s == 'string' && s.length > 2, s => s[0]=="a"]  }
const validator2 = {name : "age" , validators: [s => typeof s == 'number', s.age >= 0 && s.age <= 120]  }
const obj1 = { p1 : "abc" }
const obj2 = { p2 : 123 }
const obj3 = { p1 : "a" , p2 : 123 }

const obj4 = { p1: "cbaaaa" }
const obj5 = {name: "Bob", age: 23 }
const obj6 = {name: "Alice", age: -5 }

function validateProperty(obj, propValidator){
    if(
        propValidator.name in obj && 
        propValidator.validators.every(i => i(obj[propValidator.name]) === true
    )){
        return true
    }
    return false
}

/*
 *   validateProperty(obj1, validator) //true
 *   validateProperty(obj2, validator) //false
 *   validateProperty(obj3, validator) //false
 */

assert.deepEqual(validateProperty(obj1, validator), true)
assert.deepEqual(validateProperty(obj2, validator), false)
assert.deepEqual(validateProperty(obj3, validator), false)
assert.deepEqual(validateProperty(obj4, validator), false)
assert.deepEqual(validateProperty(obj5, validator2), true)
assert.deepEqual(validateProperty(obj6, validator2), false)

