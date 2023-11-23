import crypto from 'crypto'

export const USERS = []

export const GROUPS = []

export function createUser(username){
    if(USERS.find(user => user.username === username ) === undefined){
        const user = {
            id: (USERS.length+1),
            username: username,
            token: crypto.randomUUID()
        }
        USERS.push(user)
        return user.token
    }
}

export function getUserByToken(){
    //TODO
}

export function listUsers(){
    return USERS
}

export function createGroup(group){
    if(GROUPS.find(g => g.owner === group.username) === undefined){
        GROUPS.push(group)
        return true
    }
    return false
}

export function listGroups(){
    return GROUPS
}