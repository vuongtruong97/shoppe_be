const express = require('express')
const PermissionController = require('../controllers/PermissionController')

const permRouter = express.Router()

permRouter.post('/add', PermissionController.addPerm)
permRouter.patch('/update/:id', PermissionController.updatePerm)
permRouter.delete('/delete/:id', PermissionController.deletePerm)
permRouter.get('/list', PermissionController.getListPerm)

module.exports = permRouter
