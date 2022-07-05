const express = require('express')
const CartController = require('../controllers/CartController')
const { validateCart } = require('../middlewares/validators/cart-validator')

const cartRouter = express.Router()

cartRouter.patch('', validateCart, CartController.addItemToCart)
cartRouter.get('', CartController.getCartDetail)
cartRouter.get('/list', CartController.getCartList)

module.exports = cartRouter
