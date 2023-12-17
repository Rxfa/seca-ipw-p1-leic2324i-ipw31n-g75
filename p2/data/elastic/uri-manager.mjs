import {put} from "./elastic.mjs"
import {elasticUrl} from "../../config.mjs";

export default async function(index){
    await put(`${elasticUrl}${index}`)
    return {
        list: () => `${elasticUrl}${index}/_search`,
        get: (id) => `${elasticUrl}${index}/_doc/${id}`,
        create: () => `${elasticUrl}${index}/_doc/?refresh=wait_for`,
        update: (id) => `${elasticUrl}${index}/_update/${id}?_source&refresh=wait_for`,
        delete: (id) => `${elasticUrl}${index}/_doc/${id}?refresh=wait_for`,
    }
}