import {put} from "./elastic.mjs"
import * as dotenv from "dotenv";

dotenv.config()
const ELASTIC_URL = process.env.ELASTIC_URL

export default async function(index){
    await put(`${ELASTIC_URL}${index}`)
    return {
        list: () => `${ELASTIC_URL}${index}/_search`,
        get: (id) => `${ELASTIC_URL}${index}/_doc/${id}`,
        create: () => `${ELASTIC_URL}${index}/_doc/?refresh=wait_for`,
        update: (id) => `${ELASTIC_URL}${index}/_doc/${id}?refresh=wait_for`,
        delete: (id) => `${ELASTIC_URL}${index}/_doc/${id}?refresh=wait_for`,
    }
}