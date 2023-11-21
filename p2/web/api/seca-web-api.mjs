import * as usersServices from "../../services/seca-services.mjs"

export async function insertUser(req, res) {
        const username = req.body.username
        const token = await usersServices.createUser(username)
        if(token !== undefined){
            return res.status(201).json({"user-token": token})
        }
        return res.status(400).json("User already exists")
    
}

export function listUsers(req, res) {
    const users = usersServices.listUsers()
    console.log(users)
    return res.status(200).json(users)
}