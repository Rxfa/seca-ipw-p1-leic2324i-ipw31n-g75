export const GROUPS = [
    {
        id: 1,
        owner: 1,
        name: "name1",
        description: "desc1",
        events: []
    },
]

let group_size = 1
export async function listGroups(ownerID){
    return GROUPS.filter(t => t.owner === ownerID)
}

export async function getGroup(ownerID, groupID){
    return findGroupAndDoSomething(ownerID, groupID, group => group)
}

export async function deleteGroup(ownerID, groupID){
    return findGroupAndDoSomething(ownerID, groupID, (group, groupIdx) => {
        GROUPS.splice(groupIdx, 1)
        return GROUPS
    })
}

export async function updateGroup(ownerID, groupID, groupArg) {
    return findGroupAndDoSomething(ownerID, groupID, group => {
        group.name = groupArg.name
        group.description = groupArg.description
        return group
    })
}

export async function createGroup(ownerID, group){
    let newGroup = {
        id: nextId(),
        owner: ownerID,
        name: group.name,
        description: group.description,
        events: []
    }
    GROUPS.push(newGroup)
    return newGroup
}

export async function addEvent(ownerId, groupId, event){
    console.log("hereeeeee", groupId)
    return findGroupAndDoSomething(ownerId, groupId.id, group => {
        console.log(group.events)
        if(group.events.find(e => e.id === event.id))
            return

        group.events.push(event)
        return event
    })
}

export async function removeEvent(ownerId, groupId, eventId){
    return findGroupAndDoSomething(ownerId, groupId.id, group => {
        const eventIdx = group.events.findIndex(e => e.id === eventId)
        if(eventIdx !== -1){
            group.events.splice(eventIdx, 1)
            return group
        }
    })
}

function findGroupAndDoSomething(ownerID, groupID, action){
    const groupIdx =
        GROUPS.findIndex(group => group.id  === groupID && group.owner === ownerID)
    const group = GROUPS[groupIdx]
    if(groupIdx !== -1){
        return action(group, groupIdx)
    }
}

function nextId(){
    return ++group_size
}
