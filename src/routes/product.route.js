const express = require('express')
const ProductController = require('../controllers/ProductController')
const authMiddleWare = require('../middlewares/authMidleware')
const { validateProduct } = require('../middlewares/validators/product-validator')
const { imageValidate } = require('../lib/multer')

const prodRouter = express.Router()

const checkAuthorization = require('../middlewares/checkAuthorization')

prodRouter.post(
    '/add-prod',
    authMiddleWare,
    imageValidate.fields([{ name: 'list', maxCount: 4 }]),
    validateProduct,
    ProductController.addProduct
)
prodRouter.patch('/update-prod/:id', ProductController.updateProduct)
prodRouter.delete('/delete-prod/:id', checkAuthorization, ProductController.deleteProduct)
prodRouter.get('/list', ProductController.getListProduct)
prodRouter.get('/:id', ProductController.getProduct)
prodRouter.get('/images/:id')

module.exports = prodRouter
