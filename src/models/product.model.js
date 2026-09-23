'use strict'

const { model, Schema } = require('mongoose')
const slugify = require('slugify')

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

const productSchema = new Schema({
    product_name: {
        type: String,
        require: true
    },
    product_thumb: {
        type: String,
        require: true
    },
    product_description: {
        type: String
    },
    product_price: {
        type: Number,
        require: true
    },
    product_quantity: {
        type: Number,
        require: true
    },
    product_type: {
        type: String,
        require: true,
        enum: ['Electronic','Clothing','Furniture']
    },
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
    product_attributes: {
        type: Schema.Types.Mixed,
        require: true
    },
    product_slug: {
        type: String
    },
    product_ratingsAverage: {
        type: Number,
        default: 0,
        min: [0, 'Rating must be above 0.0'],
        max: [5, 'Rating must be below 5.0'],
        set: (val) => Math.round(val * 10) / 10
    },
    product_variations: {type: Array, default: []},
    isDraft: {type: Boolean, default: true, index: true, select: false},
    isPublished: { type: Boolean, default: false, index: true, select: false}
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

// Document middleware : run before save or create
productSchema.pre('save', function() {
    this.product_slug = slugify(this.product_name, {lower: true})
})

const clothingSchema = new Schema({
    brand: {
        type: String,
        require: true
    },
    size: {
        type: String
    },
    material: {
        type: String
    },
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
},{
    timestamps: true,
    collection: "Clothes"
})

const electronicSchema = new Schema({
    manufacturer: {
        type: String,
        require: true
    },
    model: {
        type: String
    },
    color: {
        type: String
    },
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
},{
    timestamps: true,
    collection: "Electronics"
})

const furnitureSchema = new Schema({
    brand: {
        type: String,
        require: true
    },
    size: {
        type: String
    },
    material: {
        type: String
    },
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
},{
    timestamps: true,
    collection: "Furnitures"
})
module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model('Clothing',clothingSchema),
    electronic: model('Electronic',electronicSchema),
    furniture: model('Furniture',furnitureSchema)
}
