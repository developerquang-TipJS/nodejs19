'use strict'

const JWT = require('jsonwebtoken')
const { BadRequestError } = require('../core/error.response')

const createTokenPair = async (payload, puclicKey, privateKey) => {
    try {
        const accessToken = await JWT.sign(payload,privateKey, {
            algorithm: 'RS256',
            expiresIn: '2 days'
        })

        const refreshToken = await JWT.sign(payload,privateKey, {
            algorithm: 'RS256',
            expiresIn: '7 days'
        })

        JWT.verify(accessToken,puclicKey,(err,decode) => {
            if(err) {
                console.error(`error verify::`, err)
            }else {
                console.error(`decode verify::`, decode)
            }
        })

        return {accessToken,refreshToken}
    } catch (error) {
        throw new BadRequestError("Error: create tokens pair failed!")
    }
}

module.exports = {
    createTokenPair
}