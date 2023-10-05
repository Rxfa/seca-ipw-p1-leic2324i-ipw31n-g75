import assert from "assert";

var goodUsers = [
    { id: 1 },
    { id: 2 },
    { id: 3 }
 ]
 
 // `checkUsersValid` is the function you'll define
 var testAllValid = checkUsersValid(goodUsers)

 function checkUsersValid(validUsers){
    return function(givenUsers){
        const arr = validUsers.map(item => JSON.stringify(item))
        return givenUsers.every(user => arr.includes(JSON.stringify(user)))
    }
 }
 
 /*
    testAllValid([
        { id: 2 },
        { id: 1 }
    ])
    // => true
    
    testAllValid([
        { id: 2 },
        { id: 4 },
        { id: 1 }
    ])
    // => false
 */

assert.deepEqual( testAllValid([
    { id: 2 },
    { id: 4 },
    { id: 1 }
 ]), false)

assert.deepEqual( testAllValid([
    { id: 2 },
    { id: 1 }
 ]), true)