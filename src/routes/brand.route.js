const express = require('express')
const BrandController = require('../controller/Brand.controller')
const { validator } = require('express-fastest-validator')
const { BRAND_VALIDATE, UPDATE_BRAND_VALIDATE } = require('../validator/Brand.validator')

const brandRouter = express.Router()

brandRouter.post('/add-brand', validator(BRAND_VALIDATE), BrandController.addBrand)
brandRouter.patch(
    '/update-brand/:slug',
    validator(UPDATE_BRAND_VALIDATE),
    BrandController.updateBrand
)
brandRouter.delete('/delete-brand/:slug', BrandController.deleteBrand)
brandRouter.get('/list-brand', BrandController.getListBrand)

module.exports = brandRouter
