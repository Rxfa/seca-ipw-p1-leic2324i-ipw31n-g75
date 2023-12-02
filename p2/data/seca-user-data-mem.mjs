import {randomUUID} from "crypto";

export const USERS = [
    {
        id: 1,
        username: "test1",
        token: randomUUID()
    },
    {
        id: 2,
        username: "test2",
        token: randomUUID()
    }
]

let user_size = 2

export async function getUser(token){
    return USERS.find(user => user.token === token)
}

export async function createUser(username){
    let newUser = {
        id: nextId(),
        username: username,
        token: randomUUID()
    }
    USERS.push(newUser)
    return newUser.token
}

export async function findUser(username){
    return USERS.find(user => user.username === username)
}

export async function listUsers(){
    return USERS
}

function nextId(){
    return ++user_size
}
