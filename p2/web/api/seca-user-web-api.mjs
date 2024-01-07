import * as services from "../../services/seca-user-services.mjs"
import {apiBaseUrl} from "../../config.mjs";


export default function(services){
    return {
        listUsers: listUsers,
        insertUser: insertUser,
        login: login,
        logout: logout,
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

    async function login(req, res){
        const username = req.body.username
        const password = req.body.password
        if(validateUser(username, password)){
            const user = {
                username: username,
                password: password
            }
            await req.login(user)
        }
        
        function validateUser(username, password){
            // TODO
            return true
        }
    }


    async function logout(req, res){
        req.logout()
        res.redirect('/')
    }
}
