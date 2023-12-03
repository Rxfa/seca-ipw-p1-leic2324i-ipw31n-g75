import * as services from "../../services/seca-user-services.mjs"


export default function(services){
    return {
        listUsers: listUsers,
        insertUser: insertUser,
    }

    async function insertUser(req, res) {
        try{
            const username = req.body.username
            const token = await services.createUser(username)
            res.status(201).json({"user-token": token})
        } catch (e){
            res.status(400).json("User already exists")
        }

    }

    async function listUsers(req, res) {
        res.status(200).json(await services.listUsers())
    }
}
