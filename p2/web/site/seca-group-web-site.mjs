import url from 'url';
import {userToken} from "../../config.mjs";
import errors from "../errors.mjs";
import toHttpErrorResponse from "../api/response-errors.mjs";


const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

function View(name, data){
    return {
        name: name,
        data: data
    }
}

export default function (groupServices, eventServices){
    if(!groupServices){
        throw errors.INVALID_PARAMETER("GroupServices")
    }

    return {
        getHome: getHome,
        getCss: getCss,
        listGroups: wrapper(listGroups),
        getGroup: wrapper(getGroup),
        createGroup: wrapper(createGroup),
        updateGroup: wrapper(updateGroup),
        deleteGroup: wrapper(deleteGroup),
        getPopularEvents: wrapper(getPopularEvents),
        getEventsByName: wrapper(getEventsByName),
        getEvent: wrapper(getEvent),
        eventSearch: wrapper(eventSearch),
        addEvent: wrapper(addEvent),
        removeEvent: wrapper(removeEvent),
    }

    async function getHome(req, res){
        return new View("groups", {})
    }

    async function getCss(req, res){
        sendFile("site.css", res)
    }

    async function listGroups(req, res){
        const groups = await groupServices.listGroups(req.token)
        return new View("groups", {title:"All groups", groups: groups})
    }

    async function getGroup(req, res){
        const group = await groupServices.getGroup(req.token, req.params.id)
        return new View("groupDetail", group)
    }

    async function createGroup(req, res){
        await groupServices.createGroup(req.token, req.body)
        res.redirect("/groups")
    }

    async function deleteGroup(req, res){
        await groupServices.deleteGroup(req.token, req.body.id)
        res.redirect("/groups")
    }

    async function updateGroup(req, res){
        console.log(req.body)
        const groupId = req.body.id
        await groupServices.updateGroup(req.token, groupId, req.body)
        res.redirect(`/groups/${groupId}`)
    }

    async function getPopularEvents(req, res){
        const events = await eventServices.getPopularEvents(req.query.limit, req.query.page)
        const groups = await groupServices.listGroups(req.token)
        return new View("events", {events: events, groups: groups})
    }

    async function getEventsByName(req, res){
        const events = await eventServices.getEventByName(req.query.name, req.query.limit, req.query.page)
        const groups = await groupServices.listGroups(req.token)
        return new View("events", {events: events, groups: groups})
    }

    async function getEvent(req, res){
        const event = await eventServices.getEvent(req.params.id)
        return new View("events", event)
    }

    async function eventSearch(req, res){
        return new View("searchEvent", {})
    }

    async function addEvent(req, res){
        console.log(req.body)
        const groupId = req.body.groupId
        await groupServices.addEvent(req.token, req.body.eventId, groupId)
        res.redirect(`/groups/${groupId}`)
    }

    async function removeEvent(req, res){
        console.log("here")
        const groupId = req.body.groupId
        await groupServices.removeEvent(req.token, req.body.eventId, groupId)
        res.redirect(`/groups/${groupId}`)
    }

    function sendFile(fileName, res){
        const filePath = __dirname + "public/" + fileName
        res.sendFile(filePath)
    }

    function wrapper(func) {
        return async function(req, res){
            req.token = userToken
            try {
                const view = await func(req, res)
                if(view){
                    res.render(view.name, view.data)
                }
            } catch (e) {
                const response = toHttpErrorResponse(e)
                res.status(response.status).json(response.body)
            }
        }
    }
}