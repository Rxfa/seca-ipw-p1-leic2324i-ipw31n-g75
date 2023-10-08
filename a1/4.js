import assert from "assert";

Array.prototype.associateWith = function(transformation){
    let obj = {}
    this.forEach(element => obj[element] = transformation(element))
    return obj
}


let numbers = ["one", "two", "three", "four"]
// console.log(numbers.associateWith( str => str.length )
// { one: 3, two: 3, three: 5, four: 4}

assert.deepEqual(numbers.associateWith( str => str.length ), { one: 3, two: 3, three: 5, four: 4})
assert.deepEqual(numbers.associateWith( str => str.includes("o") ), { one: true, two: true, three: false, four: true})
