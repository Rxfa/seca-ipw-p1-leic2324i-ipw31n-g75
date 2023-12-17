import errors from "../web/errors.mjs";
import {isValidString} from "../utils.mjs";

export default function(userData){
    return {
        createUser: createUser,
        listUsers: listUsers,
    }
     async function createUser(username){
        if(!isValidString(username))
            throw errors.INVALID_PARAMETER(username)
        const user = await userData.findUser(username)
        if(user)
            throw errors.USERNAME_ALREADY_EXISTS(username)
        return await userData.createUser(username)
    }

     async function listUsers(){
        return await userData.listUsers()
    }
}
