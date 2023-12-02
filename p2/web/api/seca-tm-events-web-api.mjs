export default function(services){
    return {
        popularEvents: getPopularEvents,
        eventByName: getEventByName
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