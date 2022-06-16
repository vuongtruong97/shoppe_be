const express = require('express')
const BrandController = require('../controller/Brand.controller')

const brandRouter = express.Router()

brandRouter.post('/add-brand', BrandController.addBrand)
brandRouter.patch('/update-brand/:slug', BrandController.updateBrand)
brandRouter.delete('/delete-brand/:slug', BrandController.deleteBrand)
brandRouter.get('/list-brand', BrandController.getListBrand)

module.exports = brandRouter
