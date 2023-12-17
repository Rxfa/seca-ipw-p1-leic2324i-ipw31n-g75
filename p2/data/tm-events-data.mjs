import {formatDate} from "../utils.mjs";
import {tmBaseUrl} from "../config.mjs";

export async function getPopularEvents(limit, page){
    let data = await fetch(`${tmBaseUrl}&size=${limit}&page=${page}&sort=relevance,desc`)
    data = await data.json()
    return transformEvent(data["_embedded"]["events"])
}

export async function getEventByName(name, limit, page){
    let data = await fetch(`${tmBaseUrl}&size=${limit}&page=${page}&keyword=${name}`)
    data = await data.json()
    return data["_embedded"]["events"].map(event => transformEvent(event))
}

export async function getEvent(id){
    let data = await fetch(`${tmBaseUrl}/${id}`)
    data = await data.json()
    return transformEvent(data)
}

function transformEvent(event){
    return {
        id: event["id"],
        name: event["name"],
        date: formatDate(event["dates"]["start"]["dateTime"]),
        imageUrl: event["images"][0]["url"],
        sales: {
            start: formatDate(event["sales"]["public"]["startDateTime"]),
            end: formatDate(event["sales"]["public"]["endDateTime"]),
        },
        segment: strOrUndefined(event["classifications"][0], "segment"),
        genre: strOrUndefined(event["classifications"][0], "genre"),
        subGenre: strOrUndefined(event["classifications"][0], "subGenre")
    }
}

function strOrUndefined(event, field){
    return event !== undefined ? event[field]["name"] : undefined
}