import errors from "../web/errors.mjs";
import {isValidString} from "../utils.mjs";
import {apiBaseUrl} from "../config.mjs";

export default function(userData){
    return {
        createUser,
        listUsers,
        updateUser,
        deleteUser,
        getUserByUsername,
        getUserByToken
    }
     async function createUser(username, password){
        if(!isValidString(username, password))
            throw errors.INVALID_PARAMETER()
        const user = await userData.getUserByUsername(username)
        if(user)
            throw errors.USERNAME_ALREADY_EXISTS(username)

        return await userData.createUser(username, password)
    }

     async function listUsers(){
        return await userData.listUsers()
    }

    async function updateUser(token, data){
        const user = await userData.getUserByToken(token)
        console.log(user)
        if(!user)
            throw errors.USER_NOT_FOUND()
        if(!isValidString(data.username))
            throw errors.INVALID_PARAMETER("name")
        if(!isValidString(data.password))
            throw errors.INVALID_PARAMETER("password")
        return await userData.updateUser(user.id, data)
    }

    async function deleteUser(token){
        const user = await userData.getUserByToken(token)
        if(!user)
            throw errors.USER_NOT_FOUND()
        return await userData.deleteUser(user.id)
    }

    async function getUserByUsername(username){
        return await userData.getUserByUsername(username)
    }

    async function getUserByToken(token){
        return await userData.getUserByToken(token)
    }
}
