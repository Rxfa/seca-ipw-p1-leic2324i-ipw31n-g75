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
        return givenUsers.every(givenUser => 
            validUsers.find( validUser => validUser.id === givenUser.id) !== undefined
            )
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