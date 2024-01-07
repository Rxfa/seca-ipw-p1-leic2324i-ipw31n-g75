import {randomUUID} from "crypto";
import {GROUPS} from "./seca-group-data-mem.js";

export const USERS = [
    {
        id: 1,
        username: `test`,
        password: "test",
        token: "ef604e80-a351-4d13-b78f-c888f3e63b6"
    },
]

let user_size = 1

export function getUser(token){
    return USERS.find(user => user.token === token)
}

export function getUserByUsername(username){
    return USERS.find(user => user.username === username)
}

export function getUserByToken(token){
    return USERS.find(user => user.token === token)
}


export function createUser(username, password){
    const newUser = {
        id: nextId(),
        username: username,
        password: password,
        token: randomUUID()
    }
    USERS.push(newUser)
    return newUser
}

export function updateUser(userID, user) {
    const userIdx = USERS.findIndex(u => u.id === userID)
    if(userIdx !== -1){
        USERS[userIdx].username = user.username
        USERS[userIdx].password = user.password
        return USERS[userIdx]
    }
}

export async function deleteUser(userId){
    const userIdx = USERS.findIndex(u => u.id === userId)
    if(userIdx !== -1){
        GROUPS.splice(userIdx, 1)
        return GROUPS
    }
}

export async function listUsers(){
    return USERS
}

function nextId(){
    return ++user_size
}
