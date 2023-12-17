import toHttpErrorResponse from "./response-errors.mjs";
import errors from "../errors.mjs";
import {isValidToken} from "../../utils.mjs";


export default function (services){
    if (!services){
        throw errors.INVALID_PARAMETER("groupServices")
    }
    return {
        listGroups: wrapper(listGroups),
        getGroup: wrapper(getGroup),
        createGroup: wrapper(createGroup),
        updateGroup: wrapper(updateGroup),
        deleteGroup: wrapper(deleteGroup),
        addEvent: wrapper(addEvent),
        removeEvent: wrapper(removeEvent),
    }

    async function listGroups(req, res){
        return await services.listGroups(req.token)
    }

    async function getGroup(req, res) {
        const groupID = req.params.id
        return await services.getGroup(req.token, groupID)
    }

    async function createGroup(req, res){
        const newGroup = await services.createGroup(req.token, req.body)
        return {
            status: `group with id ${newGroup.id} create with success`,
            group: newGroup
        }
    }

    async function updateGroup(req, res){
        const groupID = req.params.id
        const group = await services.updateGroup(req.token, groupID, req.body)
        return {
            status: `group with id ${groupID} updated successfully`,
            group: group
        }
    }

    async function deleteGroup(req, res){
        const id = req.params.id
        const groups = await services.deleteGroup(req.token, id)
        return {
            status: `Task with id ${id} deleted successfully`,
            results: groups
        }
    }

    async function addEvent(req, res){
        const groupId = req.params.id
        const events = await services.addEvent(req.token, req.body.id, groupId)
        return {
            status: `Event added to group ${groupId} successfully`,
            results: events
        }
    }

    async function removeEvent(req, res){
        const groupId = req.params.groupId
        const eventId = req.body.id
        const events = await services.removeEvent(req.token, eventId, groupId)
        return {
            status: `Event deleted from group ${groupId} successfully`,
            results: events
        }
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
                const body = await _func(req, res)
                res.status(200).json(body)
            } catch (e) {
                const response = toHttpErrorResponse(e)
                res.status(response.status).json(response.body)
            }
        }
    }
}
