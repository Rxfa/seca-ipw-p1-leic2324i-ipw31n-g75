import chai, { expect, assert } from "chai";
import * as userServices from "../services/seca-services.mjs";
import {randomString} from "../utils/utils.mjs";

describe("create user", function(){
    const store = userServices.USERS
    const username = randomString(10)
    const token = userServices.createUser(username)

    it(("User has correct token"), function(){
        expect(token).to.not.be.undefined
        expect(store).to.include(store.find(u => u.token === token))
    })

    it(("User has correct id"), function(){
        const id = store.find(u => u.token === token).id
        expect(store.length).to.equal(store.find(u => u.token === token).id)
    })

    it(("User can't be duplicate"), function(){
        expect(userServices.createUser(username)).to.be.undefined
        expect(store.filter(u => u.username == username).length).to.equal(1)
    })

})