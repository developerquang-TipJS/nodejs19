'use strict'

const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeytokenService = require('./keytoken.service')
const { createTokenPair } = require('../utils/auth')
const { getInforData } = require('../utils')
const { BadRequestError, AuthFailureError } = require('../core/error.response')
const { findByEmail } = require('./shop.service')
const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
}
class AccessService {
    static login = async ({ email, password, refreshToken }) => {
        console.log("service login")
        const foundShop = await findByEmail({ email })
        console.log("foundShop: ", foundShop)
        if (!foundShop) throw new BadRequestError('Shop have not registered!')

        const matchPass = bcrypt.compare(password, foundShop.password)
        if (!matchPass) throw new AuthFailureError('Password is wrong!')

        const { privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 4096,
            privateKeyEncoding: {
                type: 'pkcs1',
                format: 'pem'
            }
        })
        if (!privateKey) {
            throw new BadRequestError("Error: create key private failed!")
        }
        const publicKeyString = await KeytokenService.getPublicKeyToken({
            shopId: foundShop._id
        })
        if (!publicKeyString) {
            throw new BadRequestError("Error: get key token from db failed!")
        }
        const publicKeyObject = crypto.createPublicKey(publicKeyString)

        const tokens = await createTokenPair({ shopId: foundShop._id, email }, publicKeyObject, privateKey)

        await KeytokenService.createKeyToken({
            shopId: foundShop._id,
            refreshToken: tokens.refreshToken,
            publicKey: publicKeyString
        })
        return {
            shop: getInforData({ fields: ['_id', 'name', 'email'], object: foundShop }),
            tokens
        }
    }
    static signUp = async ({ name, email, password }) => {
        const holderShop = await shopModel.findOne({ email }).lean()
        if (holderShop) {
            throw new BadRequestError("Error: Shop already registered!")
        }
        const passwordHash = await bcrypt.hash(password, 10)
        const newShop = await shopModel.create({
            name, email, password: passwordHash, roles: [RoleShop.SHOP]
        })

        if (newShop) {
            const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                modulusLength: 4096,
                publicKeyEncoding: {
                    type: 'pkcs1',
                    format: 'pem'
                },
                privateKeyEncoding: {
                    type: 'pkcs1',
                    format: 'pem'
                }
            })

            const publickeyString = await KeytokenService.createKeyToken({
                shopId: newShop._id,
                publicKey: publicKey
            })

            if (!publickeyString) {
                throw new BadRequestError("Error: get key token from db failed!")
            }
            const publicKeyObject = crypto.createPublicKey(publickeyString)
            const tokens = await createTokenPair({ shopId: newShop._id, email }, publicKeyObject, privateKey)

            return {
                code: 201,
                metadata: {
                    shop: getInforData({ fields: ['_id', 'name', 'email'], object: newShop }),
                    tokens
                }
            }
        }

        return {
            code: 200,
            metadata: null
        }
    }
}

module.exports = AccessService