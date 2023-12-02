import chai, { expect, assert } from "chai";
import * as userServices from "../services/seca-user-services.mjs";
import {randomString} from "../utils/utils.mjs";

describe("create user", function(){
    const store = userServices.USERS
    const username = randomString(10)
    const token = userServices.createUser(username)

})