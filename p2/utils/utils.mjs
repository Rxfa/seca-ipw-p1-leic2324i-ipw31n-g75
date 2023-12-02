const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

export function randomString(size){
    var str = ""
    for(let i = 0; i < size; i++){
        str += ALPHABET.charAt(randomChar(ALPHABET.length - 1))
        
    }
    return str
}

function randomChar(pool){
    return Math.floor(Math.random() * pool)
}

export function getCurrentUser(){

}

