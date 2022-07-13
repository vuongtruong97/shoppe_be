const { validationResult } = require('express-validator')

const { Api422Error } = require('../../lib/custom-error-handler/apiError')

const validateResult = (req, res, next) => {
    try {
        const result = validationResult(req)
        console.log(result)
        const message = `${result.errors[0]?.msg}`
        if (!result.isEmpty()) {
            throw new Api422Error(message, result.errors[0].param)
        }
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = validateResult
