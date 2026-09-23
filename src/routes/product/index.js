'use strict'

const express = require('express')
const productController = require('../../controllers/product.controller')
const { asyncHandler } = require('../../utils')
const { authentication } = require('../../utils/auth')
const router = express.Router()

// authentication
router.use(authentication)
router.post('',asyncHandler(productController.createProduct))
router.get('/draft/all',asyncHandler(productController.getAllDraftProductForShop))
router.get('/published/all',asyncHandler(productController.getAllPublishedProductForShop))

router.post('/publish/:id',asyncHandler(productController.publishProductByShop))
router.post('/unpublish/:id',asyncHandler(productController.unpublishProductByShop))



module.exports = router