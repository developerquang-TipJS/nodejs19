'use strict'

const keytokenModel = require("../models/keytoken.model")

class KeytokenService {
    static createKeyToken = async ({shopId, publickey}) => {
        try {
            const publicKeyString = publickey.toString()
            const newKeyToken = await keytokenModel.create({
                shop: shopId, publicKey: publicKeyString
            })

            return newKeyToken ? newKeyToken.publicKey : null
        } catch (error) {
            return {
                code: 'xxx-keyToken',
                message: error.message,
                status: 'error-create-keyToken'
            }
        }
    }
}

module.exports = KeytokenService