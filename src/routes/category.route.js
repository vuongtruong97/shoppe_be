const express = require('express')
const CategoryController = require('../controllers/CategoryController')
const { imageValidate } = require('../lib/multer')
const { validateCate } = require('../middlewares/validators/category-validator')

const categoryRouter = express.Router()

categoryRouter.post(
    '/add-category',
    imageValidate.single('image'),
    validateCate,
    CategoryController.addCategory
)
categoryRouter.patch('/update-category/:slug', CategoryController.updateCategory)
categoryRouter.delete('/delete-category/:slug', CategoryController.deleteCategory)
categoryRouter.get('/list-category', CategoryController.getListCategory)
categoryRouter.get('/list-prod/:slug', CategoryController.getProdOfCate)

module.exports = categoryRouter
