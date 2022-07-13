<<<<<<< HEAD
const express = require('express')
const ProductController = require('../controllers/ProductController')
const authMiddleWare = require('../middlewares/authMidleware')
const { validateProduct } = require('../middlewares/validators/product-validator')
const { categoryImage } = require('../lib/multer')

const prodRouter = express.Router()

const checkAuthorization = require('../middlewares/checkAuthorization')

prodRouter.post(
    '/add-prod',
    authMiddleWare,
    categoryImage.fields([
        // { name: 'image0', maxCount: 4 },
        // { name: 'image1', maxCount: 4 },
        // { name: 'image2', maxCount: 4 },
        // { name: 'image3', maxCount: 4 },
        { name: 'list', maxCount: 4 },
    ]),
    validateProduct,
    ProductController.addProduct
)
prodRouter.patch('/update-prod/:id', ProductController.updateProduct)
prodRouter.delete('/delete-prod/:id', checkAuthorization, ProductController.deleteProduct)
prodRouter.get('/list', ProductController.getListProduct)
prodRouter.get('/:id', ProductController.getProduct)
prodRouter.get('/images/:id')

module.exports = prodRouter
=======
const express = require('express')
const ProductController = require('../controllers/ProductController')
const authMiddleWare = require('../middlewares/authMidleware')
const { validateProduct } = require('../middlewares/validators/product-validator')
const { categoryImage } = require('../lib/multer')

const prodRouter = express.Router()

const checkAuthorization = require('../middlewares/checkAuthorization')

prodRouter.post(
    '/add-prod',
    authMiddleWare,
    categoryImage.single('image'),
    validateProduct,
    ProductController.addProduct
)
prodRouter.patch('/update-prod/:id', ProductController.updateProduct)
prodRouter.delete('/delete-prod/:id', checkAuthorization, ProductController.deleteProduct)
prodRouter.get('/list', ProductController.getListProduct)
prodRouter.get('/:id', ProductController.getProduct)
prodRouter.get('/images/:id')

module.exports = prodRouter
>>>>>>> a30e69258abb7728fc1e981be9420856fb279489
