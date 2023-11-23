import * as services from "../../services/seca-services.mjs"
import { isAuthenticated } from "../../utils/utils.mjs"

export async function insertUser(req, res) {
        const username = req.body.username
        const token = await services.createUser(username)
        if(token !== undefined){
            return res.status(201).json({"user-token": token})
        }
        return res.status(400).json("User already exists")
    
}

export function listUsers(req, res) {
    return res.status(200).json(services.listUsers())
}

export function createGroup(req, res){
    if(isAuthenticated()){
        const group = {
            owner: services.getUserByToken(),
            name: req.body.name,
            description: req.body.description
        }
        if(
            services.createGroup(group) &&
            group.name !== undefined && 
            group.description !== undefined
        ){
            return res.status(201).json(`Group ${group.name} has been created successfully`)
        }
        return res.status(400).json("Invalid data")
    }
    return res.status(401).json("Missing or invalid token")
}

export async function listGroups(req, res){
    res.status(200).json(services.listGroups())
}