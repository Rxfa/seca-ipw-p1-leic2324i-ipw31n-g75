import { expect } from "chai";
import * as usersData from "../data/seca-user-data-mem.mjs";
import * as groupData from "../data/seca-group-data-mem.js";
import * as eventsData from "./mock-data/tm-events-data-mock.mjs";
import userServicesInit from "../services/seca-user-services.mjs";
import groupServicesInit from "../services/seca-group-services.mjs";
import * as utils from "../utils/utils.mjs";
import errors from "../web/errors.mjs";

const userServices = userServicesInit(usersData)
const groupServices = groupServicesInit(groupData, usersData, eventsData)

describe("Test groups", function() {
    describe("Create group", function () {
        it("Group can be created with valid data", async function () {
            const token = await userServices.createUser(utils.randomString(6))
            const group = {
                name: utils.randomString(5),
                description: utils.randomString(15)
            }
            const groups = await groupServices.createGroup(token, group)
            expect(groups).to.include(group)
        })

        it("Throws if given an invalid token", async function () {
            try {
                const invalidToken = utils.randomString(20)
                await groupServices.createGroup(invalidToken, utils.randomGroup())
            } catch (e) {
                expect(e).to.be.deep.equal(errors.USER_NOT_FOUND())
            }
        })

        it("Throws if given an invalid group name", async function () {
            const token = await userServices.createUser(utils.randomString(6))
            const group = utils.randomGroup()
            group.name = ""
            try {
                await groupServices.createGroup(token, group)
            } catch (e) {
                expect(e).to.be.deep.equal(errors.INVALID_PARAMETER("name"))
            }
        })
    })
    describe("List groups", function (){
        it("Only returns groups owned by user", async function() {
            const token1 = await userServices.createUser(utils.randomString(6))
            const token2 = await userServices.createUser(utils.randomString(6))
            await groupServices.createGroup(token1, utils.randomGroup())
            await groupServices.createGroup(token2, utils.randomGroup())
            expect(await groupServices.listGroups(token1)).to.have.length(1)
            expect(await groupServices.listGroups(token2)).to.have.length(1)
        })
    })

    describe("Delete group", function (){
        it("Groups can be deleted", async function(){
            const token = await userServices.createUser(utils.randomString(6))
            const group = await groupServices.createGroup(token, utils.randomGroup())
            expect(await groupServices.deleteGroup(token, group.id))
            expect(await groupServices.listGroups(token)).to.have.length(0)
        })

        it("Throws if a non-existing group is deleted", async function(){
            const token = await userServices.createUser(utils.randomString(6))
            const id = 5
            try {
                await groupServices.deleteGroup(token, id)
            } catch (e) {
                expect(e).to.be.deep.equal(errors.GROUP_NOT_FOUND(id))
            }
        })

        it("Throws if user tries to delete a group they don't own", async function(){
            const token1 = await userServices.createUser(utils.randomString(6))
            const token2 = await userServices.createUser(utils.randomString(6))
            await groupServices.createGroup(token1, utils.randomGroup())
            try {
                await groupServices.deleteGroup(token2, 1)
            } catch (e) {
                expect(e).to.be.deep.equal(errors.GROUP_NOT_FOUND(1))
            }
        })
    })
    describe("Update group", function (){
        it("Group can be changed", async function(){
            const token = await userServices.createUser(utils.randomString(6))
            const group = await groupServices.createGroup(token, utils.randomGroup())
            const newGroup = utils.randomGroup()
            expect(await groupServices.updateGroup(token, group.id, newGroup)).to.be.deep.equal({
                id: group.id,
                owner: group.owner,
                name: newGroup.name,
                description: newGroup.description,
                events: []
            })
        })

        it("Throws if a user tries to change a group not owned by them", async  function(){
            const token = await userServices.createUser(utils.randomString(6))
            const token2 = await userServices.createUser(utils.randomString(6))
            const group = await groupServices.createGroup(token, utils.randomGroup())
            try {
                await groupServices.updateGroup(token2, group.id, utils.randomGroup())
            } catch (e) {
                expect(e).to.be.deep.equal(errors.GROUP_NOT_FOUND(group.id))
            }
        })
    })
    describe("Add and remove events from group", function (){
        const eventId = "G5v0Z9Yc3YZz9"
        it("Event can be added to group", async function(){
            const token = await userServices.createUser(utils.randomString(6))
            const group = await groupServices.createGroup(token, utils.randomGroup())
            const event = await groupServices.addEvent(token, eventId, group.id)
            expect((await groupServices.getGroup(token, group.id)).events).to.include(event)
        })

        it("Throws if event being added is already in group", async function(){
            const token = await userServices.createUser(utils.randomString(6))
            const group = await groupServices.createGroup(token, utils.randomGroup())
            const event = await groupServices.addEvent(token, eventId, group.id)
            try{
                await groupServices.addEvent(token, eventId, group.id)
            } catch (e) {
                expect(e).to.be.deep.equal(errors.EVENT_ALREADY_EXISTS(event.id))
            }
        })

        it("Event can be removed from group", async function(){
            const token = await userServices.createUser(utils.randomString(6))
            const group = await groupServices.createGroup(token, utils.randomGroup())
            await groupServices.addEvent(token, eventId, group.id)
            await groupServices.removeEvent(token, eventId, group.id)
            const result = await groupServices.getGroup(token, group.id)
            expect(result.events).to.have.length(0)
        })

        it("Throws if user tries to remove event not in group", async function(){
            const token = await userServices.createUser(utils.randomString(6))
            const group = await groupServices.createGroup(token, utils.randomGroup())
            try {
                await groupServices.removeEvent(token, eventId, group.id)
            } catch (e) {
                expect(e).to.be.deep.equal(errors.EVENT_NOT_FOUND(eventId))
            }
        })
    })


})