'use strict'

const { BadRequestError } = require("../core/error.response")
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
            throw new BadRequestError("Error: create keyToken public failed!")
        }
    }
}

module.exports = KeytokenService