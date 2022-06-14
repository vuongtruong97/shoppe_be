const express = require('express')
const CategoryController = require('../controllers/CategoryController')
const { categoryImage } = require('../lib/multer')
const { checkCache } = require('../middlewares/checkCache')

const categoryRouter = express.Router()

categoryRouter.post(
    '/add-category',
    categoryImage.single('image'),
    CategoryController.addCategory
)
categoryRouter.patch('/update-category/:slug', CategoryController.updateCategory)
categoryRouter.delete('/delete-category/:slug', CategoryController.deleteCategory)
categoryRouter.get('/image/:slug', CategoryController.getCateImageById)
categoryRouter.post('/list-category', checkCache, CategoryController.getListCategory)

module.exports = categoryRouter