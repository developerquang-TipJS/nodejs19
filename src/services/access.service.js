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
    static login = async ({ email, password }) => {
        const foundShop = await findByEmail({ email })
        if (!foundShop) throw new BadRequestError('Shop have not registered!')

        const matchPass = await bcrypt.compare(password, foundShop.password)
        if (!matchPass) throw new AuthFailureError('Password is wrong!')

        // tạo cặp key MỚI cho phiên đăng nhập này (private + public cùng một cặp)
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

        const tokens = await createTokenPair({ shopId: foundShop._id, email }, publicKey, privateKey)

        await KeytokenService.createKeyToken({
            shopId: foundShop._id,
            refreshToken: tokens.refreshToken,
            publicKey
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