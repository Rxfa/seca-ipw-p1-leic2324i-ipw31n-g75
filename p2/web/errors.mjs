export default {
    USERNAME_ALREADY_EXISTS: (username) => {
        return {
            code: 2,
            message: `User ${username} already exists`
        }
    },
    GROUP_ALREADY_EXISTS: (groupName) => {
        return {
            code: 2,
            message: `Group ${groupName} already exists`
        }
    },
    EVENT_ALREADY_EXISTS(eventId){
        return {
            code: 2,
            message: `Event ${eventId} is already in group`
        }
    },
    INVALID_PARAMETER: (arg, description) => {
        return {
            code: 1,
            message: `Invalid argument ${arg}`,
            description: description
        }
    },
    USER_NOT_FOUND: () => {
        return {
            code: 3,
            message: "User not found"
        }
    },
    GROUP_NOT_FOUND: (groupID) => {
        return {
            code: 3,
            message: `Group ${groupID} not found`
        }
    },
    EVENT_NOT_FOUND: (eventId) => {
        return {
            code: 3,
            message: `Event ${eventId} not found`
        }
    }
}