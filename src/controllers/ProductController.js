const Product = require('../models/Product.model')
const sharp = require('sharp')
const _ = require('lodash')
const { getOrSetCache } = require('../lib/redis-cache')
const Image = require('../models/Image.model')
const generatePaginationQuery = require('../lib/generatePagingQuery')
const {
    Api404Error,
    Api409Error,
    Api422Error,
} = require('../lib/custom-error-handler/apiError')

const {
    EXIST_PROD,
    SHOP_NOT_FOUND,
    NOT_FOUND,
    ADD_PROD,
    UPDATE_PROD,
    DELETE_PROD,
} = require('../constant/product.constant')

module.exports = {
    async addProduct(req, res, next) {
        try {
            const { user } = req
            console.log('run controller')

            if (!user.shop) {
                throw new Api404Error(SHOP_NOT_FOUND)
            }

            const { name, description, brand, category, price, quantity } = req.body

            const isExist = await Product.findOne({ name })

            if (isExist) {
                throw new Api409Error(EXIST_PROD)
            }

            // const { files = [] } = req

            // const images = await Promise.all(
            //     files.map(async (file) => {
            //         const buffer = await sharp(file.buffer)
            //             .resize(500, 500)
            //             .webp()
            //             .toBuffer()

            //         return {
            //             contentType: 'image/webp',
            //             data: buffer,
            //         }
            //     })
            // )
            const { file } = req

            let image_url = null

            if (file) {
                const processedImage = await sharp(file.buffer)
                    .resize(500, 500)
                    .webp()
                    .toBuffer()

                const image = new Image({
                    content_type: 'image/webp',
                    data: processedImage,
                })

                image_url = `${process.env.ROOT_URL}/images/${image._id}`

                await image.save()
            }

            const prod = new Product({
                name,
                description,
                brand,
                category,
                price,
                quantity,
                image_url,
                shop: user.shop._id,
            })

            await prod.save()

            res.status(200).json({
                success: true,
                message: ADD_PROD.CREATE_SUCCESS,
            })
        } catch (error) {
            next(error)
        }
    },
    async updateProduct(req, res, next) {
        try {
            const { id } = req.params

            const { name, display_name } = req.body

            const Product = await Product.findOne({ id })

            if (!Product) {
                throw new Api404Error(NOT_FOUND)
            }

            const isExistName = await Product.findOne({ name })

            if (isExistName) {
                throw new Api409Error(EXIST_PROD)
            }

            const listUpdates = Object.keys(req.body)

            const listAllows = Object.keys(Product.schema.paths)

            const isAllow = listUpdates.every((update) => listAllows.includes(update))

            if (!isAllow) {
                throw new Api422Error(UPDATE_PROD.UPDATE_INVALID)
            }

            const isUpdated = await Product.findOneAndUpdate(
                { id },
                { name, display_name, image }
            )

            if (!isUpdated) {
                throw new Api422Error(UPDATE_PROD.UPDATE_FAIL)
            }

            return res.status(200).json({
                success: true,
                message: UPDATE_PROD.UPDATE_SUCCESS,
            })
        } catch (error) {
            next(error)
        }
    },
    async deleteProduct(req, res, next) {
        try {
            const { id } = req.params

            const Product = await Product.findOne({ id })

            if (!Product) {
                throw new Api404Error(NOT_FOUND)
            }

            await Product.remove()

            return res.status(200).json({
                success: true,
                message: DELETE_PROD.DELETE_SUCCESS,
            })
        } catch (error) {
            next(error)
        }
    },
    async getListProduct(req, res, next) {
        try {
            let {
                limit = 10,
                rate,
                sortField,
                order = 1,
                priceMax,
                priceMin = 1,
                nextId,
                nextProp,
            } = req.query

            console.log(req.query)

            let query = {}

            sort = [sortField, order] // ['price',1]

            if (!!rate) {
                query.rate = rate
            }
            if (!!priceMin) {
                query.price = { ...query.price, $gt: priceMin }
            }
            if (!!priceMax) {
                query.price = { ...query.price, $lt: priceMax }
            }

            let nextKey = null
            if (nextId) {
                nextKey = {
                    _id: nextId,
                    [sortField]: nextProp,
                }
            }

            console.log(nextKey)

            // if (sort) {
            //     const s = sort.split(':')
            //     sort = [s[0], parseInt(s[1])]
            // }

            // if (query && !_.isEmpty(query)) {
            //     const q = query.split(':')
            //     query = { [q[0]]: { [q[1]]: parseInt(q[2]) } }
            // }

            const { paginatedQuery, nextKeyFn } = generatePaginationQuery(
                query,
                sort,
                nextKey
            )

            console.log(paginatedQuery)

            const listProd = await Product.find(paginatedQuery).limit(limit).sort([sort])
            nextKey = nextKeyFn(listProd)
            res.json({
                success: true,
                data: listProd,
                nextKey,
            })
        } catch (error) {
            next(error)
        }
    },
    async getProduct(req, res, next) {
        try {
            const prodId = req.params.id
            const prod = await Product.findById(prodId)
            if (!prod) {
                throw new Api404Error(NOT_FOUND)
            }
            res.json({
                success: true,
                data: prod,
            })
        } catch (error) {
            next(error)
        }
    },
}
