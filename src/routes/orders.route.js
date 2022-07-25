const express = require('express')
const OrderController = require('../controllers/OrderController')

const orderRouter = express.Router()

orderRouter.post('/', OrderController.createOrder)
// orderRouter.patch('/update/:id', OrderController.updateRole)
// orderRouter.delete('/delete/:id', OrderController.deleteRole)
// orderRouter.get('/:id', OrderController.getAllRole)
// orderRouter.get('/list', OrderController.getAllRole)

module.exports = orderRouter
