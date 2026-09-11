'use strict'

const { Types } = require("mongoose")
const { BadRequestError } = require("../core/error.response")
const keytokenModel = require("../models/keytoken.model")

class KeytokenService {
    static createKeyToken = async ({ shopId, publicKey, refreshToken }) => {
        try {
            // lv 0
            // const publicKeyString = publickey.toString()
            // const newKeyToken = await keytokenModel.create({
            //     shop: shopId, publicKey: publicKeyString
            // })

            // return newKeyToken ? newKeyToken.publicKey : null
            // lv xxx
            const filter = { shop: shopId }
            const update = {
                publicKey,
                refreshTokensUsed: [],
                refreshToken
            }
            const options = {
                upsert: true,
                new: true
            }
            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)
            console.log("tokens::::::: ", tokens)
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
    static findByShopId = async ({shopId}) => {
        return await keytokenModel.findOne({shop: new Types.ObjectId(shopId)}).lean()
    }
    static removeKeyById = async (id) => {
        return await keytokenModel.deleteOne({ _id: id })
    }
    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keytokenModel.findOne({refreshTokensUsed: refreshToken}).lean()
    }
    static findByRefreshToken = async (refreshToken) => {
        return await keytokenModel.findOne({refreshToken: refreshToken}).lean()
    }
    static deleteById = async (shopId) => {
        return await keytokenModel.findOneAndDelete({shop: shopId})
    }
    static updateRefreshToken = async ({ _id, publicKey, refreshToken, refreshTokenUsed }) => {
        return await keytokenModel.updateOne({ _id }, {
            $set: {
                publicKey,
                refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshTokenUsed
            }
        })
    }
}

module.exports = KeytokenService