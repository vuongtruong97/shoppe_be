const { body } = require('express-validator')
const validateResult = require('./validate-result')

const validateProduct = [
    body('shop_name')
        .not()
        .isEmpty()
        .withMessage('Tên shop là bắt buộc')
        .bail()
        .isString()
        .withMessage('Tên shop không hợp lệ')
        .bail()
        .isLength({ min: 2, max: 100 })
        .withMessage('Tên shop dài từ 2 tới 50 ký tự')
        .bail(),

    body('contact_name')
        .not()
        .isEmpty()
        .withMessage('Tên liên hệ bắt buộc')
        .bail()
        .isString()
        .withMessage('Tên liên hệ không hợp lệ')
        .bail()
        .isLength({ min: 2, max: 100 })
        .withMessage('Tên liên hệ dài từ 2 tới 50 ký tự')
        .bail(),

    body('contact_phone')
        .not()
        .isEmpty()
        .withMessage('Số điện thoại liên hệ bắt buộc')
        .bail()
        .isMobilePhone()
        .withMessage('Số điện thoại liên hệ không hợp lệ')
        .bail(),

    body('contact_address')
        .not()
        .isEmpty()
        .withMessage('Địa chỉ bắt buộc')
        .bail()
        .isString()
        .withMessage('Địa chỉ không hợp lệ')
        .bail()
        .isLength({ min: 2, max: 100 })
        .withMessage('Địa chỉ dài từ 2 tới 50 ký tự')
        .bail(),

    validateResult,
]

module.exports = { validateProduct }
