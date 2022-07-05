const express = require('express')
const RoleController = require('../controllers/RoleController')

const roleRouter = express.Router()

roleRouter.post('/', RoleController.addRole)
roleRouter.patch('/update/:id', RoleController.updateRole)
roleRouter.delete('/delete/:id', RoleController.deleteRole)
roleRouter.get('/:id', RoleController.getAllRole)
roleRouter.get('/list', RoleController.getAllRole)

module.exports = roleRouter
