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
