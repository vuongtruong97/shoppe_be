const { check, validationResult } = require('express-validator')

const validateUserRegister = [
    // check('name').trim().escape().not().isEmpty().withMessage('Tên không thể trống').bail().isLength({ min: 3 }).withMessage('Minimum 3 characters required!').bail(),
    check('email', 'Invalid Email Address').trim().isEmail().normalizeEmail().bail(),
    check('password')
        .trim()
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/)
        .withMessage('Mật khẩu dài từ 8 - 16 ký tự, ít nhất một chữ hoa một chữ thường và một số'),
    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) return res.status(422).json({ success: false, errors: errors.array() })
        next()
    },
]

module.exports = { validateUserRegister }
