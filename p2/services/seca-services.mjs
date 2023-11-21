import crypto from 'crypto'

export const USERS = []

export function createUser(username){
    if(USERS.find(user => user.username == username ) === undefined){
        const user = {
            id: (USERS.length+1),
            username: username,
            token: crypto.randomUUID()
        }
        USERS.push(user)
        return user.token
    }
}

export function listUsers(){
    return USERS
}