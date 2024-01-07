import * as dotenv from "dotenv";

dotenv.config()

export const userToken = process.env.userToken

export const apiKey = process.env.API_KEY

export const tmBaseUrl = "https://app.ticketmaster.com/discovery/v2"

export const elasticUrl = process.env.ELASTIC_URL

export const port = process.env.PORT
export const apiBaseUrl = "/api"
export const apiLoggedBaseUrl = `${apiBaseUrl}/cmdb`

export const siteBasePath = ""

export const siteLoggedBaseUrl = `${siteBasePath}/site`