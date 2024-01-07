import {randomUUID} from "crypto";
import uriManager from "./uri-manager.mjs";
import {get, post} from "./elastic.mjs";

export default async function(indexName = "users"){
    const URI_MANAGER = await uriManager(indexName)

    return {
        listUsers,
        getUserByToken: getUserByToken,
        getUserByUsername: getUserByUsername,
        findUser,
        createUser
    }

    async function listUsers(){
        const data = await get(URI_MANAGER.list())
        const res = await data["hits"]["hits"].map(transformUser)
        return Promise.all(res)
    }

    async function getUserByToken(token){
        return getUserBy("token", token)
    }

    async function getUserByUsername(username){
        return getUserBy("username", username)
    }

    async function findUser(username){
        return getUserBy("username", username)
    }

    async function createUser(username, password){
        const newUser = {
            username: username,
            password: password,
            token: randomUUID()
        }
        const data = await post(URI_MANAGER.create(), newUser)
        newUser.id = data["_id"]
        return newUser;
    }

    async function getUserBy(prop, value){
        const uri = `${URI_MANAGER.list()}?q=${prop}:${value}`
        return get(uri).then(body => body["hits"]["hits"].map(transformUser))
    }

    function transformUser(userElastic){
        return Object.assign({id: userElastic["_id"]}, userElastic["_source"])
    }
}