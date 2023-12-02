import * as services from "../../services/seca-user-services.mjs"


export default function(services){
    return {
        listUsers: listUsers,
        insertUser: insertUser,
    }

    async function insertUser(req, res) {
            const username = req.body.username
            const token = await services.createUser(username)
            if(token !== undefined){
                return res.status(201).json({"user-token": token})
            }
            return res.status(400).json("User already exists")

    }

    async function listUsers(req, res) {
        return res.status(200).json(await services.listUsers())
    }
}
