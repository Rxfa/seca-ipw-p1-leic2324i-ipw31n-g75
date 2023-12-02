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
import yaml from "yamljs";
import swaggerUi from "swagger-ui-express";

const swaggerDoc = yaml.load("./docs/seca-docs.yaml")

let app = express()
const PORT = 3000

const userServices = userServicesInit(userData)
const userApi = userApiInit(userServices)

const groupServices = groupServicesInit(groupData, userData, eventsData)
const groupsApi = groupsApiInit(groupServices)

const eventsServices = eventsServicesInit(groupData, eventsData)
const eventsApi = eventsApiInit(eventsServices)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc))

app.route("/users")
    .get(userApi.listUsers)
    .post(userApi.insertUser)

app.route("/groups")
    .get(groupsApi.listGroups)
    .post(groupsApi.createGroup)

app.route("/groups/:id")
    .get(groupsApi.getGroup)
    .post(groupsApi.addEvent)
    .put(groupsApi.updateGroup)
    .delete(groupsApi.deleteGroup)

app.route("/groups/:groupId/:eventId")
    .delete(groupsApi.removeEvent)

app.route("/events")
    .get(eventsApi.getPopularEvents)

app.route("/events/:name")
    .get(eventsApi.getEventByName)

app.listen(PORT, () => console.log(`listening on port 3000`))