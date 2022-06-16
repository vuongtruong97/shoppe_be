const express = require('express')
const RoleController = require('../controller/Role.controller')

const roleRouter = express.Router()

roleRouter.post('/add-role', RoleController.addRole)
roleRouter.patch('/update-role/:id', RoleController.updateRole)
roleRouter.delete('/delete-role/:id', RoleController.deleteRole)
roleRouter.get('/all', RoleController.getAllRole)

module.exports = roleRouter
