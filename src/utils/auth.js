'use strict'

const JWT = require('jsonwebtoken')
const { BadRequestError, AuthFailureError, NotFoundError } = require('../core/error.response')
const { asyncHandler } = require('.')
const {HEADER} = require('../const/index')
const { findByShopId, deleteById } = require('../services/keytoken.service')
const crypto = require('node:crypto')

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
    const shopId = req.headers[HEADER.CLIENT_ID]
    if(!shopId) throw new AuthFailureError("Invalid shopId header")

    const keyStore = await findByShopId({shopId})
    if(!keyStore) throw new NotFoundError("Not found keyStore")
    
    const refreshToken = req.headers[HEADER.REFRESHTOKEN]
    if(!refreshToken) throw new AuthFailureError("Invalid refreshToken")
    // const publicKeyObject = crypto.createPublicKey(keyStore.publicKey)
    try {
        const decodeShop = JWT.verify(refreshToken,keyStore.publicKey)
        if(shopId !== decodeShop.shopId) throw new AuthFailureError("Invalid verify shopId")
        req.keyStore = keyStore
        req.user = decodeShop
        req.refreshToken = refreshToken
        return next()
    } catch (error) {
        if (keyStore.refreshTokensUsed.includes(refreshToken)) {
            await deleteById(shopId)
            return next(new BadRequestError('Something wrong happened !! please relogin'))
        }
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