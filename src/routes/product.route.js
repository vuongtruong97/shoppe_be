const express = require('express')
const ProductController = require('../controllers/ProductController')
const authMiddleWare = require('../middlewares/authMidleware')
const { validateProduct } = require('../middlewares/validators/product-validator')

const prodRouter = express.Router()

prodRouter.post('/add-prod', authMiddleWare, ProductController.addProduct)
prodRouter.patch('/update-prod/:id', ProductController.updateProduct)
prodRouter.delete('/delete-prod/:id', ProductController.deleteProduct)
prodRouter.post('/list-prod', ProductController.getListProduct)

module.exports = prodRouter
