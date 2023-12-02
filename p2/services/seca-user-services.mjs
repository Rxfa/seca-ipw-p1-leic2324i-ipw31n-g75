import errors from "../web/errors.mjs";

export default function(userData){
    return {
        createUser: createUser,
        listUsers: listUsers,
    }
     async function createUser(username){
        const user = await userData.findUser(username)
        if(!user){
            return await userData.createUser(username)
        }
        throw errors.USERNAME_ALREADY_EXISTS(username)
    }

     async function listUsers(){
        return await userData.listUsers()
    }
}
