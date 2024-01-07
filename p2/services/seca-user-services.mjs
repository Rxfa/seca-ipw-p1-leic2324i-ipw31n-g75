import errors from "../web/errors.mjs";
import {isValidString} from "../utils.mjs";
import {apiBaseUrl} from "../config.mjs";

export default function(userData){
    return {
        createUser: createUser,
        listUsers: listUsers,
        getUserByUsername: getUserByUsername,
        getUserByToken: getUserByToken
    }
     async function createUser(username, password){
        if(!isValidString(username, password))
            throw errors.INVALID_PARAMETER()
        const user = await userData.findUser(username)
        if(user)
            throw errors.USERNAME_ALREADY_EXISTS(username)
        return await userData.createUser(username, password)
    }

     async function listUsers(){
        return await userData.listUsers()
    }

    async function getUserByUsername(username){
        console.log("getUser", username)
        return await userData.getUserByUsername(username)
    }

    async function getUserByToken(token){
        console.log("getUser", token)
        return await userData.getUserByToken(token)
    }
}
