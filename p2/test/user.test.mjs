import { expect } from "chai";
import * as usersData from "../data/memory/seca-user-data-mem.mjs";
import servicesInit from "../services/seca-user-services.mjs";
import * as utils from "../utils.mjs";

const services = servicesInit(usersData)
describe("create user", function(){
    const username = utils.randomString(8)
    const password = utils.randomString(8)
    it("Can be created with valid data", async function(){
        const token = (await services.createUser(username, password)).token
        const user = await services.getUserByUsername(username)
        expect(token).to.be.a("string")
        expect(user).to.not.be.an("undefined")
        expect(user.username).to.be.equal(username)
        expect(user.token).to.be.equal(token)
    })

    it("Throws if username already exists", async function(){
        try {
            await services.createUser(username, password)
        } catch (e) {
            expect(e.code).to.be.equal(2)
            expect(e.message).to.be.equal(`User ${username} already exists`)
        }
    })

    it("Throws if username is invalid", async function() {
        try {
            await services.createUser("")
        } catch (e){
            expect(e.code).to.be.equal(1)
            expect(e.message).to.be.equal(`Invalid argument - undefined`)
        }
    })
})

describe("update user", function (){

    it("Can update user", async function(){
        const username = utils.randomString(8)
        const password = utils.randomString(8)
        const user = (await services.createUser(username, password))
        const newUser = {
            username: utils.randomString(8),
            password: utils.randomString(8)
        }
        await services.updateUser(user.token, newUser)
        expect(user.username).to.be.equal(newUser.username)
        expect(user.password).to.be.equal(newUser.password)
    })
})

describe("delete user", function (){
    it("Can delete user", async function(){
        const username = utils.randomString(8)
        const password = utils.randomString(8)
        const user = await services.createUser(username, password)
        await services.deleteUser(user.token)
        expect(services.listUsers()).to.not.include(user)
    })
})