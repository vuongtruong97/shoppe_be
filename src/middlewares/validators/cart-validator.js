const { body } = require('express-validator')
const validateResult = require('./validate-result')

const validateCart = [
    body('shop_id')
        .notEmpty()
        .withMessage('Shop Id là bắt buộc')
        .bail()
        .isMongoId()
        .withMessage('Shop Id không đúng dịnh dạng')
        .bail(),
    body('product_id')
        .notEmpty()
        .withMessage('Product Id là bắt buộc')
        .bail()
        .isMongoId()
        .withMessage('Product Id không hợp lệ')
        .bail(),
    body('quantity').isNumeric().trim().withMessage('Số lượng sản phẩm không hợp lệ'),
    validateResult,
]

module.exports = { validateCart }
