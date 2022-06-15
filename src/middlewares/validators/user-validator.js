const { body, validationResult } = require('express-validator')
const { Api422Error } = require('../../lib/custom-error-handler/apiError')

const validateUserRegister = [
    body('firstname')
        .optional({ nullable: true, checkFalsy: true })
        .trim()
        .escape()
        .isLength({ min: 2, max: 20 })
        .withMessage('FirstName dài từ 2 tới 20 ký tự')
        .bail(),
    body('lastname')
        .optional({ nullable: true, checkFalsy: true })
        .trim()
        .isLength({ min: 2, max: 20 })
        .withMessage('LastName dài từ 2 tới 20 ký tự')
        .bail(),
    body('email', 'Invalid Email Address').trim().isEmail().normalizeEmail().bail(),
    body('password')
        .trim()
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/)
        .withMessage(
            'Mật khẩu dài từ 8 - 16 ký tự, ít nhất một chữ hoa một chữ thường và một số'
        ),
    (req, res, next) => {
        try {
            const result = validationResult(req)
            const message = `${result.errors[0]?.msg}`
            if (!result.isEmpty()) {
                throw new Api422Error(message)
            }
            next()
        } catch (error) {
            next(error)
        }
    },
]

module.exports = { validateUserRegister }
