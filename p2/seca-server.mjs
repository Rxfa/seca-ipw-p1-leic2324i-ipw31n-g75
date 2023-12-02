import express from 'express'

import * as userData from "./data/seca-user-data-mem.mjs";
import * as groupData from "./data/seca-group-data-mem.js";
import * as eventsData from "./data/tm-events-data.mjs";
import userServicesInit from "./services/seca-user-services.mjs";
import userApiInit from "./web/api/seca-user-web-api.mjs";
import groupServicesInit from "./services/seca-group-services.mjs";
import groupsApiInit from "./web/api/seca-group-web-api.mjs";
import eventsServicesInit from "./services/seca-tm-events-services.mjs";
import eventsApiInit from "./web/api/seca-tm-events-web-api.mjs";
import bodyParser from 'body-parser';

let app = express()

const userServices = userServicesInit(userData)
const userApi = userApiInit(userServices)

const groupServices = groupServicesInit(groupData, userData)
const groupsApi = groupsApiInit(groupServices)

const eventsServices = eventsServicesInit(groupData, eventsData)
const eventsApi = eventsApiInit(eventsServices)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/users', userApi.insertUser)
app.get('/users', userApi.listUsers)


app.get("/groups", groupsApi.listGroups)
app.get("/groups/:id", groupsApi.getGroup)
app.put("/groups/:id", groupsApi.updateGroup)
app.delete("/groups/:id", groupsApi.deleteGroup)
app.post("/groups", groupsApi.createGroup)

app.get("/events", eventsApi.popularEvents)
app.get("/events/:name", eventsApi.eventByName)

app.listen(3000, () => console.log(`listening on port 3000`))