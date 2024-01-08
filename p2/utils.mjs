import toHttpErrorResponse from "./web/api/response-errors.mjs";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

export function randomString(size){
    let str = "";
    for(let i = 0; i < size; i++){
        str += ALPHABET.charAt(randomChar(ALPHABET.length - 1))
    }
    return str
}

function randomChar(pool){
    return Math.floor(Math.random() * pool)
}

export function isValidString(...values){
    return values.every(v => typeof v === "string" && v !== "")
}

export function isValidToken(auth_header){
    const Bearer_str = "Bearer "
    return (
        auth_header &&
        auth_header.startsWith(Bearer_str) &&
        auth_header.length > Bearer_str.length
    )
}

export function randomGroup() {
    return {
        name: randomString(6),
        description: randomString(20)
    }
}

export function isPositiveInteger(arg){
    return typeof arg === "number" && arg >= 0
}



export function formatDate(dateStr, dateSep="/", timeSep=":"){
    const isoDate = new Date(dateStr)
    const date = [isoDate.getDate(), isoDate.getMonth(), isoDate.getFullYear()].join(dateSep)
    const time = [isoDate.getHours(), isoDate.getMinutes(), isoDate.getSeconds()]
        .map(i => i === 0 ? "00" : i.toString())
        .join(timeSep)
    return `${date} ${time}`
}

export function serializerUserDeserializeUser(user, done) {
    done(null, user)
}

export function wrapper(_func) {
    return async function(req, res){
        const auth_header = req.headers["authorization"]
        if(!isValidToken(auth_header)){
            return res.status(401).json({
                error: "Missing or invalid authentication token"
            })
        }
        req.token = auth_header.split(" ")[1]
        try {
            const body = await _func(req, res)
            res.status(200).json(body)
        } catch (e) {
            const response = toHttpErrorResponse(e)
            res.status(response.status).json(response.body)
        }
    }
}