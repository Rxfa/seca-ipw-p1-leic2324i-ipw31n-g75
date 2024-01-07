import url from 'url';
import {siteBasePath, siteLoggedBaseUrl, userToken} from "../../config.mjs";
import errors from "../errors.mjs";
import toHttpErrorResponse from "../api/response-errors.mjs";


const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

function View(name, data = {}){
    return {
        name: name,
        data: data
    }
}

export default function (usersServices, groupServices, eventServices){
    if(!groupServices){
        throw errors.INVALID_PARAMETER("GroupServices")
    }
    if(!usersServices){
        throw errors.INVALID_PARAMETER("UsersServices")
    }
    if(!eventServices){
        throw errors.INVALID_PARAMETER("EventServices")
    }

    return {
        getHome: getHome,
        profile: wrapper(profile),
        getLogin: wrapper(getLogin),
        login: wrapper(login),
        logout: wrapper(logout),
        getRegister: wrapper(getRegister),
        register: wrapper(register ),
        updateUser: wrapper(updateUser),
        deleteUser: wrapper(deleteUser),
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
        req.user ? res.redirect(`${siteLoggedBaseUrl}/groups`) : res.redirect(`${siteBasePath}/login`)
    }

    async function profile(req, res){
        const groups = await groupServices.listGroups(req.token)
        return new View("profile", groups)
    }

    async function getLogin(req, res){
        return new View("login")
    }

    async function login(req, res){
        const username = req.body.username
        const password = req.body.password
        if(await validateLogin(username, password)){
            const user = {
                username: username,
                password: password
            }
            req.login(user, () => res.redirect(`${siteLoggedBaseUrl}/groups`))
        } else {
            res.redirect(`${siteBasePath}/login`)
        }
    }
    async function validateLogin(username, password){
        const user = await usersServices.getUserByUsername(username)
        if(user)
            return user.username === username && user.password === password
        return false
    }

    async function getRegister(req, res){
        return new View("register")
    }

    async function register(req, res){
        const user = {
            username: req.body.username,
            password: req.body.password
        }
        if(await usersServices.createUser(req.body.username, req.body.password))
            res.redirect(`${siteBasePath}/login`)
        res.redirect(`${siteBasePath}/register`)
    }

    async function logout(req, res){
        req.logout()
        res.redirect(`${siteBasePath}/login`)
    }

    async function updateUser(req, res){
        const user = {
            username: req.body.username,
            password: req.body.password
        }
        await usersServices.updateUser(req.token, user)
        res.redirect(`${siteLoggedBaseUrl}/profile`)
    }

    async function deleteUser(req, res){
        await usersServices.deleteUser(req.token)
        res.redirect(`${siteBasePath}/login`)
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
        res.redirect(`${siteLoggedBaseUrl}/groups`)
    }

    async function deleteGroup(req, res){
        await groupServices.deleteGroup(req.token, req.body.id)
        res.redirect(`${siteLoggedBaseUrl}/groups`)
    }

    async function updateGroup(req, res){
        console.log(req.body)
        const groupId = req.body.id
        await groupServices.updateGroup(req.token, groupId, req.body)
        res.redirect(`${siteLoggedBaseUrl}/groups/${groupId}`)
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
        return new View("searchEvent")
    }

    async function addEvent(req, res){
        console.log(req.body)
        const groupId = req.body.groupId
        await groupServices.addEvent(req.token, req.body.eventId, groupId)
        res.redirect(`${siteLoggedBaseUrl}/groups/${groupId}`)
    }

    async function removeEvent(req, res){
        console.log("here")
        const groupId = req.body.groupId
        await groupServices.removeEvent(req.token, req.body.eventId, groupId)
        res.redirect(`${siteLoggedBaseUrl}/groups/${groupId}`)
    }

    function sendFile(fileName, res){
        const filePath = __dirname + "public/" + fileName
        res.sendFile(filePath)
    }

    function wrapper(func){
        return async function(req, res){
            try {
                console.log("wrapper - user", req.user)
                if(req.user){
                    req.token = (await usersServices.getUserByUsername(req.user.username)).token
                    console.log("wrapper - token", req.token)
                }
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