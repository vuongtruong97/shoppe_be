const { body } = require('express-validator')
const validateResult = require('./validate-result')

const validateCate = [
    body('name')
        .isString()
        .isLength({ min: 2, max: 100 })
        .withMessage('Tên danh mục dài từ 2 tới 100 ký tự')
        .bail(),
    body('display_name')
        .isString()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Tên hiển thị danh mục dài từ 2 tới 100 ký tự'),
    validateResult,
]

module.exports = { validateCate }
