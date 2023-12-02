export async function getMockData(){
    const data = await fetch(`./dummy_data.json`)
    return await data.json()
}

export async function getEventsByName(name, limit){
    const data = await getMockData()
    const events = data.slice(0, limit)
    return events.filter(event => event.name === name)
}