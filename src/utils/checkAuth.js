'use strict'

const { BadRequestError } = require("../core/error.response")
const { findById } = require("../services/apikey.service")

const HEADER = {
    API_KEY : 'x-api-key',
    AUTHORIZATION : 'authorization'
}
const apiKey = async (req,res,next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString()
        console.log("key: ",key)
        if(!key) {
            throw new BadRequestError("Error: notexist-api-key-in-header-request!")
        }
        const objkey = await findById(key)
        if(!objkey) {
            throw new BadRequestError("Error: notfound-api-key-in-mongodb!")
        }
        req.objkey = objkey

        return next()
    } catch (error) {
        throw new BadRequestError("Error: api-key!")
    }
}

const permission = (permission) => {
    return (req,res,next) => {
        if(!req.objkey.permissions) {
            throw new BadRequestError("Error: notexist-permissions-in-api-key!")
        }
        const validPermission = req.objkey.permissions.includes(permission)
        if(!validPermission) {
            throw new BadRequestError("Error: notexist-permission-in-api-key-permissions!")
        }
        return next()
    }
}
module.exports = {
    apiKey,
    permission
}