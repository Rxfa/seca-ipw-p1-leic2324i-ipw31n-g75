export const GROUPS = [
    {
        id: 1,
        owner: 1,
        name: "test1",
        description: "test1 description"
    },    
    {
        id: 2,
        owner: 2,
        name: "test2",
        description: "test2 description"
    },
]

let group_size = 2

const MAX_LIMIT = 50
export async function listGroups(ownerID, q, skip, limit){
    const pred = q ? t => t.title.includes(q) : t => true
    const retGroups = GROUPS
        .filter(t => t.owner === ownerID)
        .filter(pred)
    const end = limit !== MAX_LIMIT ? (skip + limit): retGroups.length
    return retGroups.slice(skip, end)
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
    }
    GROUPS.push(newGroup)
    return newGroup
}

function findGroupAndDoSomething(ownerID, groupID, action){
    const groupIdx =
        GROUPS.findIndex(group => group.id  == groupID && group.owner == ownerID)
    const group = GROUPS[groupIdx]
    console.log(groupIdx)
    if(groupIdx !== -1){
        return action(group, groupIdx)
    }
}

function nextId(){
    return ++group_size
}
