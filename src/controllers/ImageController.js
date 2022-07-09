const Image = require('../models/Image.model')
const { Api404Error } = require('../lib/custom-error-handler/apiError')

const fileSystemCache = require('../lib/file-system-cache.js')

module.exports = {
    async getImage(req, res, next) {
        try {
            const { id } = req.params

            const getImgaeFromDb = async () => {
                const image = await Image.findById(id)
                if (!image) {
                    throw new Api404Error()
                }
                return image
            }

            const image = await fileSystemCache(id, getImgaeFromDb)

            res.set('Content-Type', image.content_type)
            res.send(new Buffer.from(image.data.data || image.data, 'binary'))
        } catch (error) {
            next(error)
        }
    },
}
