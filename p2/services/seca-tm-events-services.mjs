import errors from "../web/errors.mjs";

export default function(groupsData, eventsData){
    if(!groupsData)
        throw errors.INVALID_PARAMETER("groupData")
    if(!eventsData)
        throw errors.INVALID_PARAMETER("eventData")
    return {
        getPopularEvents: getPopularEvents,
        getEventByName: getEventByName
    }

    async function getPopularEvents(limit, page){
        limit = limit === undefined ? 30 : parseInt(limit, 10)
        page = page === undefined ? 1 : parseInt(page, 10)
        return await eventsData.getPopularEvents(limit, page)
    }

    async function getEventByName(name, limit, page){
        limit = limit === undefined ? 30 : parseInt(limit, 10)
        page = page === undefined ? 1 : parseInt(page, 10)
        return await eventsData.getEventByName(name, limit, page)
    }
}