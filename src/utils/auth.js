'use strict'

const JWT = require('jsonwebtoken')
const { BadRequestError, AuthFailureError, NotFoundError } = require('../core/error.response')
const { asyncHandler } = require('.')
const {HEADER} = require('../const/index')
const { findByShopId } = require('../services/keytoken.service')
const crypto = require('crypto')

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

const authentication = asyncHandler(async (req,res,next) => {
    const shopId = req.headers[HEADER.CLIEND_ID]
    if(!shopId) throw new AuthFailureError("Invalid shopId header")

    const keyStore = await findByShopId({shopId})
    if(!keyStore) throw new NotFoundError("Not found keyStore")
    
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!accessToken) throw new AuthFailureError("Invalid accesstoken")
    const publicKeyObject = crypto.createPublicKey(keyStore.publicKey)
    console.log('authentication: ',keyStore)
    try {
        const decodeShop = JWT.verify(accessToken,publicKeyObject)
        if(shopId !== decodeShop.shopId) throw new AuthFailureError("Invalid verify shopId")
        req.keyStore = keyStore
        return next()
    } catch (error) {
        next(error)
    }
})

const verifyJWT = async (token,keySecret) => {
    return await JWT.verify(token,keySecret)
}

module.exports = {
    createTokenPair,
    authentication,
    verifyJWT
}