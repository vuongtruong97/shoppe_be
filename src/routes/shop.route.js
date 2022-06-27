const express = require('express')
const ShopController = require('../controllers/ShopController')
const authMiddleWare = require('../middlewares/authMidleware')
const { validateShop } = require('../middlewares/validators/shop-validator')

const shopRouter = express.Router()

shopRouter.post('/add-shop', authMiddleWare, validateShop, ShopController.addShop)
shopRouter.patch('/update-shop/:slug', ShopController.updateShop)
shopRouter.delete('/delete-shop/:slug', ShopController.deleteShop)
shopRouter.post('/list-shop', ShopController.getListShop)
shopRouter.get('/:id/products', ShopController.getShopProducts)
shopRouter.get('/manage/prods', authMiddleWare, ShopController.myShopProducts)
shopRouter.get('/:id', ShopController.getShop)

module.exports = shopRouter
