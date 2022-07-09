const express = require('express')
const { Router } = express
const ImageController = require('../controllers/ImageController')

const imageRouter = Router()

imageRouter.get('/:id', ImageController.getImage)

module.exports = imageRouter
