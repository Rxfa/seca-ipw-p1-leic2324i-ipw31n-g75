import url from 'url';
import errors from "../errors.mjs";
import toHttpErrorResponse from "../api/response-errors.mjs";


const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

function View(name, data){
    return {
        name: name,
        data: data
    }
}

export default function (services){
    if(!services){
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
        //addEvent: wrapper(addEvent),
        //removeEvent: wrapper(removeEvent),
    }

    async function getHome(req, res){
        sendFile("index.html", res)
    }

    async function getCss(req, res){
        sendFile("site.css", res)
    }

    async function listGroups(req, res){
        const groups = await services.listGroups(req.token)
        return new View("groups", {title:"All groups", groups: groups})
    }

    async function getGroup(req, res){
        const group = await services.getGroup(req.token, req.params.id)
        return new View("group", group)
    }

    async function createGroup(req, res){
        await services.createGroup(req.token, req.body)
        res.redirect("/site/groups")
    }

    async function deleteGroup(req, res){
        await services.deleteGroup(req.token, req.params.id)
        res.redirect("/site/groups")
    }

    async function updateGroup(req, res){

    }

    function sendFile(fileName, res){
        const filePath = __dirname + "public/" + fileName
        res.sendFile(filePath)
    }

    function wrapper(func) {
        return async function(req, res){
            req.token = "ef604e80-a351-4d13-b78f-c888f3e63b6"
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