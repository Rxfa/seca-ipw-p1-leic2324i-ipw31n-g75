export default {
    USER_NOT_FOUND: () => {
        return {
            code: 3,
            message: "User not found"
        }
    },
    USERNAME_ALREADY_EXISTS: (username) => {
        return {
            code: 2,
            message: `User with the username ${username} already exists`
        }
    },
    INVALID_PARAMETER: (arg, description) => {
        return {
            code: 1,
            message: `Invalid argument ${arg}`,
            description: description
        }
    },
    GROUP_NOT_FOUND: (groupID) => {
        return {
            code: 3,
            message: `Group with id ${groupID} not found`
        }
    },
}