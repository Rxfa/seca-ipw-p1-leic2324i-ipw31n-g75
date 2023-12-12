import {randomUUID} from "crypto";

export const USERS = [
    {
        id: 1,
        name: `test`,
        token: "ef604e80-a351-4d13-b78f-c888f3e63b6"
    },
]

let user_size = 1

export async function getUser(token){
    return USERS.find(user => user.token === token)
}

export async function findUser(username){
    return USERS.find(user => user.username === username)
}

export async function createUser(username){
    const newUser = {
        id: nextId(),
        username: username,
        token: randomUUID()
    }
    USERS.push(newUser)
    return newUser.token
}

export async function listUsers(){
    return USERS
}

function nextId(){
    return ++user_size
}
