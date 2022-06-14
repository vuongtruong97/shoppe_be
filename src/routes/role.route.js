const express = require('express')
const RoleController = require('../controller/Role.controller')
const { ADD_ROLE_VALIDATE, UPDATE_ROLE_VALIDATE } = require('../validator/Role.validator')
const { validator } = require('express-fastest-validator')

const roleRouter = express.Router()

roleRouter.post('/add-role', validator(ADD_ROLE_VALIDATE), RoleController.addRole)
roleRouter.patch(
    '/update-role/:id',
    validator(UPDATE_ROLE_VALIDATE),
    RoleController.updateRole
)
roleRouter.delete('/delete-role/:id', RoleController.deleteRole)
roleRouter.get('/all', RoleController.getAllRole)

module.exports = roleRouter
