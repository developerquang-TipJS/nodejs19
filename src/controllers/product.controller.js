'use strict'

const { SuccessResponse } = require("../core/success.response")
const ProductFactory = require("../services/product.service")

class ProductController {
    createProduct = async (req,res,next) => {
        new SuccessResponse({
            message: 'Create new product success!',
            metadata: await ProductFactory.createProduct(req.body.product_type,{
                ...req.body,
                product_shop: req.user.shopId
            })
        }).send(res)
    }
    getAllDraftProductForShop = async (req,res,next) => {
        new SuccessResponse({
            message: 'Find Products draft Success!',
            metadata: await ProductFactory.findAllDraftForShop({
                product_shop: req.user.shopId
            })
        }).send(res)
    }

    getAllPublishedProductForShop = async (req,res,next) => {
        new SuccessResponse({
            message: 'Find Products published Success!',
            metadata: await ProductFactory.findAllPublishedForShop({
                product_shop: req.user.shopId
            })
        }).send(res)
    }

    publishProductByShop = async (req,res,next) => {
        new SuccessResponse({
            message: 'update Product publish Success!',
            metadata: await ProductFactory.publishProductByShop({
                product_shop: req.user.shopId,
                product_id: req.params.id
            })
        }).send(res)
    }

    unpublishProductByShop = async (req,res,next) => {
        new SuccessResponse({
            message: 'update Product unpublish Success!',
            metadata: await ProductFactory.unpublishProductByShop({
                product_shop: req.user.shopId,
                product_id: req.params.id
            })
        }).send(res)
    }
}

module.exports = new ProductController()