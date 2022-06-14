const express = require('express')
const PermissionController = require('../controller/Permission.controller')
const { validator } = require('express-fastest-validator')
const { PERM_VALIDATE, UPDATE_PERM_VALIDATE } = require('../validator/Perm.validator')

const permissionRouter = express.Router()

permissionRouter.post(
    '/add-permission',
    validator(PERM_VALIDATE),
    PermissionController.addPerm
)
permissionRouter.patch(
    '/update-permission/:id',
    validator(UPDATE_PERM_VALIDATE),
    PermissionController.updatePerm
)
permissionRouter.delete('/delete-permission/:id', PermissionController.deletePerm)
permissionRouter.get('/list-perm', PermissionController.getListPerm)

module.exports = permissionRouter
