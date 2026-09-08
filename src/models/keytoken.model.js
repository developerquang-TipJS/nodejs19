'user strict'

const {Schema, model} = require('mongoose')

const DOCUMENT_NAME = 'Keytoken'
const COLLECTION_NAME = 'Keytokens'

const keyTokenSchema = new Schema({
    shop: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'Shop'
    },
    publicKey: {
        type: String,
        require: true
    },
    refreshToken: {
        type: Array,
        default: []
    }
},{
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME,keyTokenSchema)