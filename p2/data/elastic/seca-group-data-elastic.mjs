import uriManager from "./uri-manager.mjs";
import {del, get, post} from "./elastic.mjs";

export default async function(indexName = "groups"){
    const URI_MANAGER = await uriManager(indexName)

    return {
        listGroups,
        getGroup,
        updateGroup,
        createGroup,
        deleteGroup,
        addEvent,
        removeEvent
    }

    async function listGroups(ownerID){
        const query = {query: {match: {"owner": ownerID}}}
        const data = await get(URI_MANAGER.list(), query)
        const res = await data["hits"]["hits"].map(transformGroup)
        return Promise.all(res)
    }

    async function getGroup(ownerID, groupID){
        const data = await get(URI_MANAGER.get(groupID)).then(transformGroup)
        console.log(data)
        if(ownerID === data.owner)
            return data
    }

    async function createGroup(ownerID, group){
        let newGroup = {
            owner: ownerID,
            name: group.name,
            description: group.description,
            events: []
        }
        return await post(URI_MANAGER.create(), newGroup).then(body => {
            newGroup.id = body["_id"]
            return newGroup
        })
    }

    async function updateGroup(ownerID, groupID, updatedGroup) {
        return await post(URI_MANAGER.update(groupID), {doc: updatedGroup}).then(updatedGroup)
    }

    async function deleteGroup(ownerID, groupID){
        return await del(URI_MANAGER.delete(groupID)).then(body => {
            if(body["result"] !== "not_found")
                return body["_id"]
        })
    }

    async function addEvent(ownerId, group, event){
        if(group.events.find(e => e.id === event.id))
           return
        group.events.push(event)
        await post(URI_MANAGER.update(group.id), {doc: group})
        return group
    }

    async function removeEvent(ownerId, group, eventId){
        const eventIdx = group.events.findIndex(e => e.id === eventId)
        if(eventIdx !== -1){
            group.events.splice(eventIdx, 1)
            await post(URI_MANAGER.update(group.id), {doc: group})
            return group
        }
    }

    async function transformGroup(groupElastic){
        return await Object.assign({id: groupElastic["_id"]}, groupElastic["_source"])
    }
}
