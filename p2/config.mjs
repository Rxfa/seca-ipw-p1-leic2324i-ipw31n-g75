import * as dotenv from "dotenv";
import path from "path";
import url from "url";
import userApiInit from "./web/api/seca-user-web-api.mjs";
import eventsApiInit from "./web/api/seca-tm-events-web-api.mjs";
import yaml from "yamljs";
import siteInit from "./web/site/seca-group-web-site.mjs";
import userServicesInit from "./services/seca-user-services.mjs";
import groupsApiInit from "./web/api/seca-group-web-api.mjs";
import groupDataInit from "./data/elastic/seca-group-data-elastic.mjs";
import userDataInit from "./data/elastic/seca-user-data-elastic.mjs";
import groupServicesInit from "./services/seca-group-services.mjs";
import * as eventsData from "./data/tm-events-data.mjs";
import eventsServicesInit from "./services/seca-tm-events-services.mjs";

dotenv.config()

// .env

export const userToken = process.env.userToken
export const apiKey = process.env.API_KEY
export const elasticUrl = process.env.ELASTIC_URL
export const port = process.env.PORT


// URLs and paths

export const tmBaseUrl = "https://app.ticketmaster.com/discovery/v2"
export const apiBaseUrl = "/api"
export const apiLoggedBaseUrl = `${apiBaseUrl}/seca`
export const siteBasePath = ""
export const siteLoggedBasePath = `${siteBasePath}/site`
const currentPath = url.fileURLToPath(new URL(".", import.meta.url))

// Docs
export const swaggerDoc = yaml.load("./docs/seca-docs.yaml")

// Views dir
export const viewsDir = path.join(currentPath, "web", "site", "views")


// Data

const userData = await userDataInit()
const groupData = await groupDataInit()


// Services

const userServices = userServicesInit(userData)
const groupServices = groupServicesInit(groupData, userData, eventsData)
const eventsServices = eventsServicesInit(groupData, eventsData)


// APIs

export const userApi = userApiInit(userServices)
export const groupsApi = groupsApiInit(groupServices)
export const eventsApi = eventsApiInit(eventsServices)
export const site = siteInit(userServices, groupServices, eventsServices)