import url from 'url';
import errors from "../errors.mjs";
import {isValidToken} from "../../utils/utils.mjs";
import toHttpErrorResponse from "../api/response-errors.mjs";


const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export default function (groupServices){
    if(!groupServices){
        throw errors.INVALID_PARAMETER("GroupServices")
    }

    return {
        listGroups: wrapper(listGroups),
        getGroup: wrapper(getGroup),
        createGroup: wrapper(createGroup),
        updateGroup: wrapper(updateGroup),
        deleteGroup: wrapper(deleteGroup),
        //addEvent: wrapper(addEvent),
        //removeEvent: wrapper(removeEvent),
    }

    async function getHome(req, res){
        sendFile("index.html", res)
    }

    async function getCss(req, res){
        sendFile("site.css", res)
    }

    async function listGroups(req, res){
        const groups = await groupServices.listGroups(req.token)
        res.render("groups", {groups})
    }

    async function getGroup(req, res){
        const group = await groupServices.getGroup(req.token, req.params.id)
        return {
            name: "group",
            data: group
        }
    }

    async function createGroup(req, res){
        await groupServices.createGroup(req.token, req.body)
        res.redirect("/site/groups")
    }

    async function deleteGroup(req, res){
        await groupServices.deleteGroup(req.token, req.params.id)
        res.redirect("/site/groups")
    }

    async function updateGroup(req, res){

    }

    function sendFile(fileName, res){
        const filePath = __dirname + "public/" + fileName
        res.sendFile(filePath)
    }

    function wrapper(_func) {
        return async function(req, res){
            const auth_header = req.headers["authorization"]
            if(!isValidToken(auth_header)){
                return res.status(401).json({
                    error: "Missing or invalid authentication token"
                })
            }
            req.token = auth_header.split(" ")[1]
            try {
                return await _func(req, res)
                //res.status(200).json(body)
            } catch (e) {
                const response = toHttpErrorResponse(e)
                res.status(response.status).json(response.body)
            }
        }
    }
}