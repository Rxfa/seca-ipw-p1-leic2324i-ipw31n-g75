import * as dotenv from "dotenv";

dotenv.config()
const apiKey = process.env.API_KEY
const baseURL = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}`

export async function getPopularEvents(limit= 30, page= 1){
    const data =
        await fetch(
            `${baseURL}&sort=relevance,desc&size=${limit}&page=${page}`
        )
    const events = await data.json()
    return transformEvents(events)
}

export async function getEventByName(name, limit, page){
    const data =
        await fetch(
            `${baseURL}&size=${limit}&page=${page}&keyword=${name}`
        )
    const events = await data.json()
    return transformEvents(events)
}

function transformEvents(data){
    console.log(data)
    return data["_embedded"]["events"].map(e => {
        return {
            name: e["name"],
            date: e["dates"]["start"]["dateTime"],
            segment: e["classifications"][0]["segment"]["name"],
            genre: e["classifications"][0]["genre"]["name"]
        }
    })
}