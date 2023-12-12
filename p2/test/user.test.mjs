import { expect } from "chai";
import * as usersData from "../data/memory/seca-user-data-mem.mjs";
import servicesInit from "../services/seca-user-services.mjs";
import * as utils from "../utils/utils.mjs";

const services = servicesInit(usersData)
describe("create user", function(){
    const username = utils.randomString(8)
    it("Can be created with valid data", async function(){
        const token = await services.createUser(username)
        const user = await usersData.findUser(username)
        expect(token).to.be.a("string")
        expect(user).to.not.be.an("undefined")
        expect(user.username).to.be.equal(username)
        expect(user.token).to.be.equal(token)
    })

    it("Throws if username already exists", async function(){
        try {
            await services.createUser(username)
        } catch (e) {
            expect(e.code).to.be.equal(2)
            expect(e.message).to.be.equal(`User ${username} already exists`)
        }
    })

    it("Throws if username is invalid", async function() {
        try {
            await services.createUser()
        } catch (e){
            expect(e.code).to.be.equal(1)
            expect(e.message).to.be.equal(`Invalid argument - undefined`)
        }
    })
})