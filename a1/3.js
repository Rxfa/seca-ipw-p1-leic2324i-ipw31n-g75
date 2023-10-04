import assert from "assert";
import { copyProperties } from "./copyProperties.js";

Object.prototype.copyProperties = function(validators){
    return copyProperties(this, validators)
}

const validators = [
    {
        name: "p1", validators: [s => typeof s == 'string' && s.length > 2, s => s[0] == "a"]
    },
    {
        name: "p2", validators: [s => Number.isInteger(s)]
    }
]

const obj1 = { p1: "a" }
const obj2 = { p1: 123 }
const obj3 = { p1: "abc", p2: 123 }

/**
 * console.log(obj1.copyProperties(validators))  // {}
 * console.log(obj2.copyProperties(validators)) // {}
 * console.log(obj3.copyProperties(validators)) // { p1: 'abc', p2: 123 }
 */

assert.deepEqual(obj1.copyProperties(validators), {})
assert.deepEqual(obj2.copyProperties(validators), {})
assert.deepEqual(obj3.copyProperties(validators), { p1: 'abc', p2: 123 })