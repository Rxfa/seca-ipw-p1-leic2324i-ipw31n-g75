import toHttpErrorResponse from "./response-errors.mjs";
import errors from "../errors.mjs";


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
        res.status(201).json({
            status: `group with id ${newGroup.id} create with success`,
            group: newGroup
        })
    }

    async function updateGroup(req, res){
        const groupID = req.params.id
        const group = await services.updateGroup(req.token, groupID, req.body)
        res.status(200).json({
            status: `group with id ${groupID} updated successfully`,
            group: group
        })
    }

    async function deleteGroup(req, res){
        const id = req.params.id
        const group = await services.deleteGroup(
            req.token,
            id
        )
        if (!group){
            throw errors.GROUP_NOT_FOUND()
        }
            res.status(200).json(`Task with id ${id} deleted successfully`)
    }

    async function addEvent(req, res){
        const groupId = req.params.id
        console.log(req.body.id)
        const event = await services.addEvent(req.token, req.body.id, groupId)
        if(!event){
            throw errors.EVENT_NOT_FOUND()
        }
        res.status(200).json(`Event added to group ${groupId} successfully`)
    }

    async function removeEvent(req, res){
        const groupId = req.params.groupId
        const event = await services.removeEvent(req.token, req.body.id, groupId)
        if(!event){
            throw errors.EVENT_NOT_FOUND()
        }
        res.status(200).json(`Event deleted from group ${groupId} successfully`)
    }

    function wrapper(_func) {
        return async function(req, res){
            const Bearer_str = "Bearer "
            const auth_header = req.headers["authorization"]
            if(!(auth_header && auth_header.startsWith(Bearer_str) && auth_header.length > Bearer_str.length)){
                return res.status(401).json({
                    error: "Missing or invalid authentication token"
                })
            }
            req.token = auth_header.split(" ")[1]
            try {
                let body = await _func(req, res)
                res.status(200).json(body)
            } catch (e) {
                const response = toHttpErrorResponse(e)
                res.status(response.status).json(response.body)
            }
        }
    }
}
