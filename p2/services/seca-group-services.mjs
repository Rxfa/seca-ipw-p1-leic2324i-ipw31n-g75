import errors from "../web/errors.mjs";
import {isValidString} from "../utils.mjs";

export default function(groupData, userData, eventsData){
    if(!groupData)
        throw errors.INVALID_PARAMETER("groupData")
    if(!userData)
        throw errors.INVALID_PARAMETER("userData")
    if(!eventsData)
        throw errors.INVALID_PARAMETER("eventData")
    return {
        listGroups: listGroups,
        getGroup: getGroup,
        updateGroup: updateGroup,
        deleteGroup: deleteGroup,
        createGroup: createGroup,
        addEvent: addEvent,
        removeEvent: removeEvent,
    }

    async function listGroups(token){
        const user = await userData.getUserByToken(token)
        if(!user)
            throw errors.USER_NOT_FOUND()
        return await groupData.listGroups(user.id)
    }

    async function createGroup(token, group){
        const user = await userData.getUserByToken(token)
        if(!user)
            throw errors.USER_NOT_FOUND()
        if(!isValidString(group.name))
            throw errors.INVALID_PARAMETER("name")
        return await groupData.createGroup(user.id, group)
    }


    async function getGroup(token, groupID){
        const user = await userData.getUserByToken(token)
        if(!user)
            throw errors.USER_NOT_FOUND()
        const group = await groupData.getGroup(user.id, groupID)
        if(!group)
            throw errors.GROUP_NOT_FOUND(groupID)
        return group
    }

    async function updateGroup(token, groupId, group){
        const user = await userData.getUserByToken(token)
        if(!user)
            throw errors.USER_NOT_FOUND()
        if(!(await groupData.getGroup(user.id, groupId)))
            throw errors.GROUP_NOT_FOUND(groupId)
        if(!isValidString(group.name))
            throw errors.INVALID_PARAMETER("name or description")
        const updatedGroup = await groupData.getGroup(user.id, groupId)
        updatedGroup.name = group.name
        updatedGroup.description = group.description !== undefined ? group.description : updatedGroup.description
        return await groupData.updateGroup(user.id, groupId, updatedGroup)
    }

    async function deleteGroup(token, groupID){
        const user = await userData.getUserByToken(token)
        if(!user)
            throw errors.USER_NOT_FOUND()
        const groups = await groupData.deleteGroup(user.id, groupID)
        if(!groups)
            throw errors.GROUP_NOT_FOUND(groupID)
        return await groupData.listGroups(user.id)
    }

    async function addEvent(userToken, eventId, groupId){
        const user = await userData.getUserByToken(userToken)
        const group = await groupData.getGroup(user.id, groupId)
        if(!group)
            throw errors.GROUP_NOT_FOUND(groupId)
        const event = await eventsData.getEvent(eventId)
        if(!event)
            throw errors.EVENT_NOT_FOUND(eventId)
        const events = await groupData.addEvent(user.id, group, event)
        console.log(events)
        if(!events)
            throw errors.EVENT_ALREADY_EXISTS(eventId)
        return events
    }

    async function removeEvent(userToken, eventId, groupId){
        const user = await userData.getUserByToken(userToken)
        const group = await groupData.getGroup(user.id, groupId)
        if(!group)
            throw errors.GROUP_NOT_FOUND(groupId)
        const events = await groupData.removeEvent(user.id, group, eventId)
        if(!events)
            throw errors.EVENT_NOT_FOUND(eventId)
        return events
    }
}

