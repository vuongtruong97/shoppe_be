const { body } = require('express-validator')
const validateResult = require('./validate-result')

const validateProduct = [
    body('name')
        .not()
        .isEmpty()
        .withMessage('Tên sản phẩm là bắt buộc')
        .bail()
        .isString()
        .withMessage('Tên sản phẩm không hợp lệ')
        .bail()
        .isLength({ min: 2, max: 255 })
        .withMessage('Tên sản phẩm dài từ 2 tới 50 ký tự')
        .bail(),

    body('description')
        .not()
        .isEmpty()
        .withMessage('Mô tả sản phẩm là bắt buộc')
        .bail()
        .isString()
        .withMessage('Mô tả sản phẩm không hợp lệ')
        .bail()
        .isLength({ min: 2, max: 1255 })
        .withMessage('Mô tả sản phẩm dài từ 30 tới 1255 ký tự')
        .bail(),

    body('price')
        .not()
        .isEmpty()
        .withMessage('Bạn chưa nhập giá sản phẩm')
        .bail()
        .isInt()
        .withMessage('Giá sản phẩm không hợp lệ')
        .bail(),

    body('quantity')
        .not()
        .isEmpty()
        .withMessage('Bạn chưa nhập số lượng hàng hoá')
        .bail()
        .isInt()
        .withMessage('Số lượng hàng hoá không hợp lệ')
        .bail(),

    validateResult,
]

module.exports = { validateProduct }
