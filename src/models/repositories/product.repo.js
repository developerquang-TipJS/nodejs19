'use strict'

const { Types } = require('mongoose')
const {product} = require('../../models/product.model')

const findAllDraftForShop = async ({query,limit,skip}) => {
    return await product.find(query).populate('product_shop', 'name email -_id')
                        .sort({updatedAt: -1}).skip(skip).limit(limit).lean().exec()
}

const findAllPublishedForShop = async ({query,limit,skip}) => {
    return await product.find(query).populate('product_shop', 'name email -_id')
                        .sort({updatedAt: -1}).skip(skip).limit(limit).lean().exec()
}

const publishProductByShop = async ({product_shop,product_id}) => {
    const foundShop = await product.findOne({
        product_shop : new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })

    if(!foundShop) return null

    foundShop.isDraft = false
    foundShop.isPublished = true
    const {modifiedCount} = await foundShop.updateOne(foundShop)

    return modifiedCount
}

const unpublishProductByShop = async ({product_shop,product_id}) => {
    const foundShop = await product.findOne({
        product_shop : new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })

    if(!foundShop) return null

    foundShop.isDraft = true
    foundShop.isPublished = false
    const {modifiedCount} = await foundShop.updateOne(foundShop)

    return modifiedCount
}
module.exports = {
    findAllDraftForShop,
    publishProductByShop,
    findAllPublishedForShop,
    unpublishProductByShop
}