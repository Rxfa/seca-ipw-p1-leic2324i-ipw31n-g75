import errors from "../web/errors.mjs";
import {isValidString} from "../utils/utils.mjs";

export default function(groupData, userData, eventData){
    if(!groupData){
        throw errors.INVALID_PARAMETER("groupData")
    }
    if(!userData){
        throw errors.INVALID_PARAMETER("userData")
    }
    if(!eventData){
        throw errors.INVALID_PARAMETER("eventData")
    }

    return {
        listGroups: listGroups,
        getGroup: getGroup,
        updateGroup: updateGroup,
        deleteGroup: deleteGroup,
        createGroup: createGroup,
        addEvent: addEvent,
        removeEvent: removeEvent,
    }

    async function listGroups(userToken, q, skip = 0, limit = 50){
        limit = Number(limit)
        skip = Number(skip)
        if(
            isNaN(limit)        ||
            isNaN(skip)         ||
            skip > 50           ||
            limit > 50          ||
            (skip + limit) > 50 ||
            skip < 0            ||
            limit < 0
        ){
            throw errors.INVALID_PARAMETER(
                "skip or limit",
                "Skip and limit must be positive, less than 50 and its sum must be less or equal to 50"
            )
        }
        const user = await userData.getUser(userToken)
        if(!user){
            throw errors.USER_NOT_FOUND()
        }
        return await groupData.listGroups(user.id, q, skip, limit)
    }

    async function createGroup(userToken, group){
        const user = await userData.getUser(userToken)
        if(!user){
            throw errors.USER_NOT_FOUND()
        }
        if(!isValidString(userToken, group.name)) {
            throw errors.INVALID_PARAMETER("name")
        }
        return await groupData.createGroup(user.id, group)
    }


    async function getGroup(userToken, groupID){
        const user = await userData.getUser(userToken)
        if(!user){
            throw errors.USER_NOT_FOUND()
        }
        const group = await groupData.getGroup(user.id, groupID)
        if(group){
            return group
        }
        throw errors.GROUP_NOT_FOUND(groupID)
    }

    async function updateGroup(userToken, groupId, group){
        const user = await userData.getUser(userToken)
        if(!user){
            throw errors.USER_NOT_FOUND()
        }

        if(!isValidString(group.name)){
            throw errors.INVALID_PARAMETER("name")
        }
        return await groupData.updateGroup(user.id, groupId, group)
    }

    async function deleteGroup(userToken, groupID){
        const user = await userData.getUser(userToken)
        if(!user){
            throw errors.USER_NOT_FOUND()
        }
        const groups = await groupData.deleteGroup(user.id, groupID)
        if(!groups){
            throw errors.GROUP_NOT_FOUND()
        }
        return groups
    }

    async function addEvent(userToken, eventId, groupId){
        const user = await userData.getUser(userToken)
        const group = await groupData.getGroup(user.id, groupId)
        if(!group){
            throw errors.GROUP_NOT_FOUND(groupId)
        }
        const event = await eventData.getEvent(eventId)
        if(!event){
            throw errors.EVENT_ALREADY_EXISTS(eventId)
        }
        const events = await groupData.addEvent(user.id, groupId, event)
        if(!events){
            throw errors.EVENT_NOT_FOUND(eventId)
        }
        return events
    }

    async function removeEvent(userToken, eventId, groupId){
        const user = await userData.getUser(userToken)
        const group = await groupData.getGroup(user.id, groupId)
        if(!group){
            throw errors.GROUP_NOT_FOUND()
        }
        const events = await groupData.removeEvent(userToken, groupId, eventId)
        if(!events){
            throw errors.EVENT_NOT_FOUND(eventId)
        }
        return events
    }
}

