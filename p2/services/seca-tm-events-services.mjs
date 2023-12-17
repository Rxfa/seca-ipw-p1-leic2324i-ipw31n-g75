import errors from "../web/errors.mjs";
import {isPositiveInteger} from "../utils.mjs";

export default function(groupsData, eventsData){
    if(!groupsData)
        throw errors.INVALID_PARAMETER("groupData")
    if(!eventsData)
        throw errors.INVALID_PARAMETER("eventData")
    return {
        getPopularEvents: getPopularEvents,
        getEventByName: getEventByName,
        getEvent: getEvent
    }

    async function getPopularEvents(limit, page){
        limit = limit === undefined ? 30 : parseInt(limit, 10)
        page = page === undefined ? 1 : parseInt(page, 10)
        return await eventsData.getPopularEvents(limit, page)
    }

    async function getEventByName(name, limit, page){
        limit = isPositiveInteger(limit) ? parseInt(limit, 10) : 30
        page = isPositiveInteger(page) ? parseInt(page, 10) : 0
        return await eventsData.getEventByName(name, limit, page)
    }

    async function getEvent(id){
        return await eventsData.getEvent(id)
    }
}