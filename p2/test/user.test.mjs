import chai, { expect, assert } from "chai";
import * as usersData from "mock-data/"
import servicesInit from "../services/seca-user-services.mjs";
import { randomString } from "../utils/utils.mjs";

const services = servicesInit()
describe("create user", function(){
    const store = userServices.USERS
    const username = randomString(10)
    const token = userServices.createUser(username)
})