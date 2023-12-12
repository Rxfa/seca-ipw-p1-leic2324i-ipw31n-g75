import {randomUUID} from "crypto";
import uriManager from "./uri-manager.mjs";
import {get, post} from "./elastic.mjs";

export default async function(indexName = "users"){
    const URI_MANAGER = await uriManager(indexName)

    return {
        getUser,
        findUser,
        createUser
    }

    async function getUser(token){
        return getUserBy("token", token)
    }

    async function findUser(username){
        return getUserBy("username", username)
    }

    async function createUser(username){
        const newUser = {
            username: username,
            token: randomUUID()
        }
        await post(URI_MANAGER.create(), newUser)
        return newUser.token
    }

    async function getUserBy(prop, value){
        const uri = `${URI_MANAGER.list()}?q=${prop}:${value}`
        return get(uri).then(body => {
            const ans = body["hits"]["hits"].map(transformUser)
            if(ans.length === 1)
                return ans[0]
        })
    }

    function transformUser(userElastic){
        return Object.assign({id: userElastic["_id"]}, userElastic["_source"])
    }
}