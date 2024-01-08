import * as services from "../../services/seca-user-services.mjs"
import {apiBaseUrl} from "../../config.mjs";
import {wrapper} from "../../utils.mjs";
import errors from "../errors.mjs";


export default function(services){
    if (!services)
        throw errors.INVALID_PARAMETER("usersServices")
    return {
        insertUser,
        createUser,
        updateUser: wrapper(updateUser),
        deleteUser: wrapper(deleteUser),
    }

    async function insertUser(req, res) {
        try{
            const token = await services.createUser(req.body.username)
            res.status(201).json({"user-token": token})
        } catch (e){
            res.status(400).json("User already exists")
        }
    }

    async function listUsers(req, res) {
        res.status(200).json(await services.listUsers())
    }

    async function createUser(req, res){
        return await services.createUser(req.body.username, req.body.password)
    }

    async function updateUser(req, res) {
        return await services.updateUser(req.token, req.body)
    }

    async function deleteUser(req, res) {
        return await services.deleteUser(req.token)
    }
}
