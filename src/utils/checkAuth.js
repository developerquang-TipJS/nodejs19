'use strict'

const { findById } = require("../services/apikey.service")

const HEADER = {
    API_KEY : 'x-api-key',
    AUTHORIZATION : 'authorization'
}
const apiKey = async (req,res,next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString()
        if(!key) {
            return res.status(403).json({
                code: 'xxxx',
                message: 'Forbidden Error',
                status: 'error-notexist-api-key-in-header-request'
            })
        }
        const objkey = await findById(key)
        if(!objkey) {
            return res.status(403).json({
                code: 'xxxx',
                message: 'Forbidden Error',
                status: 'error-notfound-api-key-in-mongodb'
            })
        }
        req.objkey = objkey

        return next()
    } catch (error) {
        return {
            code: 'xxx',
            message: error.message,
            status: 'error-api-key'
        }
    }
}

const permission = (permission) => {
    return (req,res,next) => {
        if(!req.objkey.permissions) {
            return res.status(403).json({
                code: 'xxxx',
                message: 'Permission denied',
                status: 'error-notexist-permissions-in-api-key'
            }) 
        }
        const validPermission = req.objkey.permissions.includes(permission)
        if(!validPermission) {
            return res.status(403).json({
                code: 'xxxx',
                message: 'Permission denied',
                status: 'error-notexist-permission-in-api-key-permissions'
            })
        }
        return next()
    }
}
module.exports = {
    apiKey,
    permission
}