const Image = require('../models/Image.model')
const {
    Api404Error,
    Api409Error,
    Api429Error,
    Api422Error,
} = require('../lib/custom-error-handler/apiError')

module.exports = {
    async getImage(req, res, next) {
        try {
            const { id } = req.params

            const image = await Image.findById(id)
            if (!image) {
                throw new Api404Error()
            }
            res.set('Content-Type', image.content_type)
            res.send(image.data)
        } catch (error) {
            next(error)
        }
    },
}
