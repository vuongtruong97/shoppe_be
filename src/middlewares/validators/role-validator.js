const { body } = require('express-validator')
const validateResult = require('./validate-result')

const validateRole = [
    body('name')
        .isString()
        .isLength({ min: 2, max: 100 })
        .withMessage('Tên Role dài từ 2 tới 100 ký tự')
        .bail(),
    body('perms')
        .isString()
        .trim()
        .isArray()
        .withMessage('Danh sách quyền phải là dạng array'),
    validateResult,
]

module.exports = { validateRole }
