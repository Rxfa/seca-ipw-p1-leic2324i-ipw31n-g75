import express from 'express'
import expressSession from 'express-session'
import passport from 'passport'
import {setHbsGlobalVariables} from "./middleware.mjs";
import bodyParser from 'body-parser';
import swaggerUi from "swagger-ui-express";
import {
    apiBaseUrl,
    apiLoggedBaseUrl,
    eventsApi,
    groupsApi,
    port,
    site,
    siteBasePath,
    siteLoggedBaseUrl,
    swaggerDoc,
    userApi,
    viewsDir
} from "./config.mjs";
import path from "path";
import hbs from "hbs";
import {serializerUserDeserializeUser} from "./utils.mjs";
import {verifyAuth} from "./middleware.mjs";

let app = express()

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

passport.serializeUser(serializerUserDeserializeUser)
passport.deserializeUser(serializerUserDeserializeUser)

app.use(siteLoggedBaseUrl, verifyAuth)

app.use("/", setHbsGlobalVariables)

// Site routes
app.get(siteBasePath, site.getHome)
app.get("/", site.getHome)
/*
* In case siteBasePath is not empty, we redirect both to the login page
* if unauthenticated, or to profile page if authenticated.
* */

app.route("/login")
    .get(site.getLogin)
    .post(site.login)

app.route("/register")
    .get(site.getRegister)
    .post(site.register)

app.route(`${siteLoggedBaseUrl}/logout`)
    .post(site.logout)

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

app.route(`${apiBaseUrl}/users`)
    .post(userApi.insertUser)
    .put(userApi.updateUser)
    .delete(userApi.deleteUser)

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
