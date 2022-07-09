const express = require('express')
const CategoryController = require('../controllers/CategoryController')
const { categoryImage } = require('../lib/multer')
const { validateCate } = require('../middlewares/validators/category-validator')

const categoryRouter = express.Router()

categoryRouter.post(
    '/add-category',
    categoryImage.single('image'),
    validateCate,
    CategoryController.addCategory
)
categoryRouter.patch('/update-category/:slug', CategoryController.updateCategory)
categoryRouter.delete('/delete-category/:slug', CategoryController.deleteCategory)
categoryRouter.get('/image/:slug', CategoryController.getCateImageById)
categoryRouter.post('/list-category', CategoryController.getListCategory)
categoryRouter.get('/list-prod/:slug', CategoryController.getProdOfCate)

module.exports = categoryRouter
