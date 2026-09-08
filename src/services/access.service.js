'use strict'

const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeytokenService = require('./keytoken.service')
const { createTokenPair } = require('../utils/auth')
const { getInforData } = require('../utils')
const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
}
class AccessService {
    static signUp = async ({name,email,password}) => {
        try {
            const holderShop = await shopModel.findOne({email}).lean()
            if(holderShop) {
                return {
                    code: 'xxxx',
                    message: 'Shop have already registered!'
                }
            }
            const passwordHash = await bcrypt.hash(password,10)
            const newShop = await shopModel.create({
                name, email, password: passwordHash, roles: [RoleShop.SHOP]
            })

            if(newShop) {
                const {privateKey,publicKey} = crypto.generateKeyPairSync('rsa', {
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
                    publickey: publicKey
                })

                if(!publickeyString) {
                    return {
                        code: 'xxxx',
                        message: error.message,
                        status: 'error-take-keyToken'
                    }
                }
                const publicKeyObject = crypto.createPublicKey(publickeyString)
                const tokens = await createTokenPair({shopId: newShop._id, email},publicKeyObject,privateKey)

                console.log(`Create shop success: `,tokens)

                return {
                    code: 201,
                    metadata: {
                        shop: getInforData({fields: ['_id','name','email'],object:newShop}),
                        tokens
                    }
                }
            }

            return {
                code: 200,
                metadata: null
            }

        } catch (error) {
            return {
                code: 'xxx',
                message: error.message,
                status: 'error-signup-shop'
            }
        }
    }
}

module.exports = AccessService