'use strict'

const { BadRequestError } = require("../core/error.response")
const keytokenModel = require("../models/keytoken.model")

class KeytokenService {
    static createKeyToken = async ({shopId, publicKey,refreshToken}) => {
        try {
            // lv 0
            // const publicKeyString = publickey.toString()
            // const newKeyToken = await keytokenModel.create({
            //     shop: shopId, publicKey: publicKeyString
            // })

            // return newKeyToken ? newKeyToken.publicKey : null
            // lv xxx
            const filter = { shop: shopId}
            const update = {
                publicKey,
                refreshTokensUsed : [],
                refreshToken
            }
            const options = {
                upsert: true,
                new: true
            }
            const tokens = await keytokenModel.findOneAndUpdate(filter,update,options)

            return tokens ? tokens.publicKey : null
        } catch (error) {
            throw new BadRequestError("Error: create keyToken public failed!")
        }
    }
    static getPublicKeyToken = async ({ shopId }) => {
        try {
            const keyToken = await keytokenModel.findOne({ shop: shopId }).lean()

            return keyToken ? keyToken.publicKey : null
        } catch (error) {
            throw new BadRequestError("Error: get keyToken public failed!")
        }
    }
}

module.exports = KeytokenService