export async function del(uri){
    return fetchInternal(uri, {method: "DELETE"})
}

export async function put(uri, body){
    return fetchInternal(uri, {method: "PUT"}, body)
}

export async function post(uri, body){
    return fetchInternal(uri, {method: "POST"}, body)
}

export async function get(uri){
    return fetchInternal(uri)
}

async function fetchInternal(uri, options = {}, body = undefined){
    if(body){
        options.headers = {
            "Content-Type": "application/json"
        }
        options.body = JSON.stringify(body)
    }

    return fetch(uri, options)
        .then(res => res.json())
        .then(showResponse)
}

function showResponse(body){
    return body
}




