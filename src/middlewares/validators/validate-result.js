const { validationResult } = require('express-validator')

const { Api422Error } = require('../../lib/custom-error-handler/apiError')

const validateResult = (req, res, next) => {
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
}

module.exports = validateResult
