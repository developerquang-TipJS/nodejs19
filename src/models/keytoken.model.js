'use strict'

const { Schema, model } = require('mongoose')

const DOCUMENT_NAME = 'Keytoken'
const COLLECTION_NAME = 'KeyTokens'

const keyTokenSchema = new Schema({
    shop: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    publicKey: {
        type: String,
        required: true
    },
    refreshTokensUsed: {
        type: Array,
        default: []
    },
    refreshToken: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, keyTokenSchema)