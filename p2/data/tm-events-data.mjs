import {formatDate} from "../utils.mjs";
import {tmBaseUrl, apiKey} from "../config.mjs";

export async function getPopularEvents(limit, page){
    let data = await fetch(`${tmBaseUrl}/events.json?apikey=${apiKey}&size=${limit}&page=${page}&sort=relevance,desc`)
    data = await data.json()
    return data["_embedded"]["events"].map(event => transformEvent(event))
}

export async function getEventByName(name, limit, page){
    let data = await fetch(`${tmBaseUrl}/events.json?apikey=${apiKey}&size=${limit}&page=${page}&keyword=${name}`)
    data = await data.json()
    return data["_embedded"]["events"].map(event => transformEvent(event))
}

export async function getEvent(id){
    let data = await fetch(`${tmBaseUrl}/events/${id}.json?apikey=${apiKey}`)
    data = await data.json()
    console.log(data)
    return transformEvent(data)
}

function transformEvent(event){
    return {
        id: event["id"],
        name: event["name"],
        date: event["dates"]["start"]["dateTime"],
        imageUrl: event.images.find(image => image["ratio"] === "3_2")["url"],
        sales: {
            start: event["sales"]["public"]["startDateTime"],
            end: event["sales"]["public"]["endDateTime"],
        },
        segment: strOrUndefined(event["classifications"][0], "segment"),
        genre: strOrUndefined(event["classifications"][0], "genre"),
        subGenre: strOrUndefined(event["classifications"][0], "subGenre")
    }
}

function strOrUndefined(event, field){
    return event !== undefined ? event[field]["name"] : undefined
}