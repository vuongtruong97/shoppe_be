const Role = require('../models/Role.model')
const { Api403Error } = require('../lib/custom-error-handler/apiError')

const checkAuthorization = async (req, res, next) => {
    try {
        const { role } = req.user
        const { baseUrl, method } = req
        console.time('Role')

        if (role === 'ADMIN') {
            return next()
        }

        existsRole = await Role.findOne({ name: role })
            .populate('perms')
            .cache({ time: 120 })

        if (!existsRole) {
            throw new Api403Error('Forbiden')
        }

        console.log(baseUrl, method)
        const isAllow = existsRole.perms.some(
            (perm) =>
                perm.resource === baseUrl.replace('/', '') && perm.method.includes(method)
        )

        if (!isAllow) {
            throw new Api403Error('Forbiden')
        }

        console.timeEnd('Role')
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = checkAuthorization
