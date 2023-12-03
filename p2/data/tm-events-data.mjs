import * as dotenv from "dotenv";

dotenv.config()
const apiKey = process.env.API_KEY
const baseURL = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}`

export async function getPopularEvents(limit, page){
    const data = await fetch(`${baseURL}&size=${limit}&page=${page}&sort=relevance,desc`)
    const events = await data.json()
    return transformEvents(events)
}

export async function getEventByName(name, limit, page){
    const data = await fetch(`${baseURL}&size=${limit}&page=${page}&keyword=${name}`)
    const events = await data.json()
    return transformEvents(events)
}

export async function getEvent(id){
    const data = await fetch(`${baseURL}&id=${id}`)
    const event = await data.json()
    return transformEvents(event)[0]
}

function transformEvents(data){
    console.log(data)
    return data["_embedded"]["events"].map(event => {
        return {
            id: event["id"],
            name: event["name"],
            date: event["dates"]["start"]["dateTime"],
            segment: event["classifications"][0] !== undefined ? event["classifications"][0]["segment"]["name"] : undefined,
            genre: event["classifications"][0] !== undefined ? event["classifications"][0]["genre"]["name"] : undefined
        }
    })
}