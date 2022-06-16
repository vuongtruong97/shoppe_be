const express = require('express')
const PermissionController = require('../controller/Permission.controller')

const permRouter = express.Router()

permRouter.post('/add-perm', PermissionController.addPerm)
permRouter.patch('/update-perm/:id', PermissionController.updatePerm)
permRouter.delete('/delete-perm/:id', PermissionController.deletePerm)
permRouter.get('/list-perm', PermissionController.getListPerm)

module.exports = permRouter
