import errors from "../errors.mjs";

export default function(services){
    if (!services)
        throw errors.INVALID_PARAMETER("groupServices")
    return {
        getPopularEvents: getPopularEvents,
        getEventByName: getEventByName
    }

    async function getPopularEvents(req, res){
        const result = await services.getPopularEvents(req.query.limit, req.query.page)
        res.status(200).json({events: result})
    }

    async function getEventByName(req, res){
        const result = await services.getEventByName(req.params.name, req.query.limit, req.query.page)
        res.status(200).json({events: result})
    }
}