const Image = require('../models/Image.model')
const { Api404Error } = require('../lib/custom-error-handler/apiError')
const Cache = require('file-system-cache').default

const cache = Cache({
    basePath: './.cache', // Optional. Path where cache files are stored (default).
    ns: 'my-namespace', // Optional. A grouping namespace for items.
})

module.exports = {
    async getImage(req, res, next) {
        try {
            const { id } = req.params

            const existCache = await cache.get(id)

            if (existCache) {
                const img = JSON.parse(existCache)
                res.set('Content-Type', img.content_type)
                res.send(new Buffer(img.data.data, 'binary'))
            } else {
                const image = await Image.findById(id)
                if (!image) {
                    throw new Api404Error()
                }

                await cache.set(id, JSON.stringify(image))

                res.set('Content-Type', image.content_type)
                res.send(image.data)
            }
        } catch (error) {
            next(error)
        }
    },
}
