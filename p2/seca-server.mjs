import express from 'express'
import expressSession from 'express-session'
import passport from 'passport'
import userDataInit from "./data/elastic/seca-user-data-elastic.mjs";
import groupDataInit from "./data/elastic/seca-group-data-elastic.mjs";
import * as eventsData from "./data/tm-events-data.mjs";
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
import {apiBaseUrl, apiLoggedBaseUrl, siteBasePath, siteLoggedBaseUrl, port} from "./config.mjs";
import url from "url";
import path from "path";
import hbs from "hbs";
import {serializerUserDeserializeUser} from "./utils.mjs";

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

const site = siteInit(userServices, groupServices, eventsServices)

const currentPath = url.fileURLToPath(new URL(".", import.meta.url))
const viewsDir = path.join(currentPath, "web", "site", "views")

app.set("view engine", "hbs")
app.set("views", viewsDir)

hbs.registerPartials(path.join(viewsDir, "partials"))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(expressSession({
    secret: 'isel-ipw',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.session())
app.use(passport.initialize())

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc))
app.use("/", express.static("./web/site/public"))

function verifyAuth(req, res, next) {
    console.log("verifyAuth", req.user)
    if(req.user)
        return next()
    res.redirect(`${siteBasePath}/login`)
}

passport.serializeUser(serializerUserDeserializeUser)
passport.deserializeUser(serializerUserDeserializeUser)

app.use(siteLoggedBaseUrl, verifyAuth)

function setHbsGlobalVariables(req, res, next) {
    res.locals.basePath = siteBasePath
    res.locals.loggedUser = req.user || undefined;
    next();
}
app.use("/", setHbsGlobalVariables)

// Site routes
app.get(siteBasePath, site.getHome)

app.route("/login")
    .get(site.getLogin)
    .post(site.login)

app.route("/register")
    .get(site.getRegister)
    .post(site.register)

app.route(`${siteLoggedBaseUrl}/groups`)
    .get(site.listGroups)
    .post(site.createGroup)

app.get(`${siteLoggedBaseUrl}/groups/:id`, site.getGroup)
app.post(`${siteLoggedBaseUrl}/groups/update`, site.updateGroup)
app.post(`${siteLoggedBaseUrl}/groups/delete`, site.deleteGroup)
app.get(`${siteLoggedBaseUrl}/events`, site.eventSearch)
app.get(`${siteLoggedBaseUrl}/events/popular`, site.getPopularEvents)
app.get(`${siteLoggedBaseUrl}/events/search`, site.getEventsByName)
app.post(`${siteLoggedBaseUrl}/groups/addEvent`, site.addEvent)
app.post(`${siteLoggedBaseUrl}/groups/removeEvent`, site.removeEvent)

// API routes

//app.use(apiLoggedBaseUrl, userServices.verifyAuth) // TODO: server can't access services directly

app.route(`${apiBaseUrl}/logout`)
    .post(userApi.logout)

app.route(`${apiBaseUrl}/users`)
    .post(userApi.insertUser)

app.route(`${apiLoggedBaseUrl}/groups`)
    .get(groupsApi.listGroups)
    .post(groupsApi.createGroup)

app.route(`${apiLoggedBaseUrl}/groups/:id`)
    .get(groupsApi.getGroup)
    .post(groupsApi.addEvent)
    .put(groupsApi.updateGroup)
    .delete(groupsApi.deleteGroup)

app.route(`${apiLoggedBaseUrl}/groups/:groupId/:eventId`)
    .delete(groupsApi.removeEvent)

app.route(`${apiLoggedBaseUrl}/events`)
    .get(eventsApi.getPopularEvents)

app.route(`${apiLoggedBaseUrl}/events/:name`)
    .get(eventsApi.getEventByName)

app.listen(port, () => console.log(`listening on port ${port}`))