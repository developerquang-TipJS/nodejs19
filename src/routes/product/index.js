'use strict'

const express = require('express')
const productController = require('../../controllers/product.controller')
const { asyncHandler } = require('../../utils')
const { authentication } = require('../../utils/auth')
const router = express.Router()

// authentication
router.use(authentication)
router.post('',asyncHandler(productController.createProduct))

module.exports = router