import data from "./dummy_data.json" assert { type: 'json' };

export async function getMockData(){
    return data["events"]
}

export async function getEventByName(name, limit){
    const data = await getMockData()
    const events = data.slice(0, limit)
    return events.filter(e => e.name === name)
}

export async function getEvent(id){
    const data = await getMockData()
    return data.filter(e => e.id === id)[0]
}