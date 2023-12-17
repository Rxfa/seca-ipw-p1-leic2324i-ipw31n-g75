import express from 'express'

import userDataInit from "./data/elastic/seca-user-data-elastic.mjs";
import groupDataInit from "./data/elastic/seca-group-data-elastic.mjs";
import * as eventsData from "./data/tm-events-data.mjs";
import * as staticSite from "./web/site/seca-static.mjs";
import userServicesInit from "./services/seca-user-services.mjs";
import userApiInit from "./web/api/seca-user-web-api.mjs";
import groupServicesInit from "./services/seca-group-services.mjs";
import groupsApiInit from "./web/api/seca-group-web-api.mjs";
import eventsServicesInit from "./services/seca-tm-events-services.mjs";
import eventsApiInit from "./web/api/seca-tm-events-web-api.mjs";
import siteInit from "./web/site/seca-group-web-site.mjs";


import bodyParser from 'body-parser';
import yaml from "yamljs";
import swaggerUi from "swagger-ui-express";
import {port} from "./config.mjs";
import url from "url";
import path from "path";
import hbs from "hbs";

const swaggerDoc = yaml.load("./docs/seca-docs.yaml")

let app = express()

const userData = await userDataInit()
const groupData = await groupDataInit()

const userServices = userServicesInit(userData)
const userApi = userApiInit(userServices)

const groupServices = groupServicesInit(groupData, userData, eventsData)
const groupsApi = groupsApiInit(groupServices)

const eventsServices = eventsServicesInit(groupData, eventsData)
const eventsApi = eventsApiInit(eventsServices)

const site = siteInit(groupServices, eventsServices)

const currentPath = url.fileURLToPath(new URL(".", import.meta.url))
const viewsDir = path.join(currentPath, "web", "site", "views")
app.set("view engine", "hbs")
app.set("views", viewsDir)

hbs.registerPartials(path.join(viewsDir, "partials"))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc))
app.use("/", express.static("./web/site/public"))

// Site routes
app.get("/", site.getHome)

app.route("/groups")
    .get(site.listGroups)
    .post(site.createGroup)

app.get("/groups/:id", site.getGroup)
app.post("/groups/update", site.updateGroup)
app.post("/groups/delete", site.deleteGroup)
app.get("/events", site.eventSearch)
app.get("/events/popular", site.getPopularEvents)
app.get("/events/search", site.getEventsByName)
app.post("/groups/addEvent", site.addEvent)
app.post("/groups/removeEvent", site.removeEvent)

// API routes
app.route("api/users")
    .post(userApi.insertUser)

app.route("api/groups")
    .get(groupsApi.listGroups)
    .post(groupsApi.createGroup)

app.route("api/groups/:id")
    .get(groupsApi.getGroup)
    .post(groupsApi.addEvent)
    .put(groupsApi.updateGroup)
    .delete(groupsApi.deleteGroup)

app.route("api/groups/:groupId/:eventId")
    .delete(groupsApi.removeEvent)

app.route("api/events")
    .get(eventsApi.getPopularEvents)

app.route("api/events/:name")
    .get(eventsApi.getEventByName)

app.listen(port, () => console.log(`listening on port ${port}`))