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
    siteLoggedBasePath,
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

app.use(siteLoggedBasePath, verifyAuth)

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

app.route(`${siteLoggedBasePath}/update`)
    .post(site.updateUser)

app.route(`${siteLoggedBasePath}/delete`)
    .post(site.deleteUser)

app.route(`${siteLoggedBasePath}/logout`)
    .post(site.logout)

app.route(`${siteLoggedBasePath}/groups`)
    .get(site.listGroups)
    .post(site.createGroup)

app.route(`${siteLoggedBasePath}/profile`)
    .get(site.profile)

app.get(`${siteLoggedBasePath}/groups/:id`, site.getGroup)
app.post(`${siteLoggedBasePath}/groups/update`, site.updateGroup)
app.post(`${siteLoggedBasePath}/groups/delete`, site.deleteGroup)
app.get(`${siteLoggedBasePath}/events`, site.eventSearch)
app.get(`${siteLoggedBasePath}/events/popular`, site.getPopularEvents)
app.get(`${siteLoggedBasePath}/events/search`, site.getEventsByName)
app.post(`${siteLoggedBasePath}/groups/addEvent`, site.addEvent)
app.post(`${siteLoggedBasePath}/groups/removeEvent`, site.removeEvent)


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
