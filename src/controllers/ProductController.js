const Product = require('../models/Product.model')
const sharp = require('sharp')
const _ = require('lodash')
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
const { log } = require('../lib/logger.lib')

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

            const { list } = req.files

            const listUrl = await Promise.all(
                list.map(async (item) => {
                    const processedImage = await sharp(item.buffer)
                        .resize(500, 500)
                        .webp()
                        .toBuffer()

                    const image = new Image({
                        content_type: 'image/webp',
                        data: processedImage,
                    })

                    await image.save()
                    const url = `${process.env.ROOT_URL}/images/${image._id}`
                    return url
                })
            )

            const prod = new Product({
                name,
                description,
                brand,
                category,
                price,
                quantity,
                image_urls: listUrl,
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

            const prod = await Product.findByIdAndDelete(id)

            console.log(id)

            if (!prod) {
                throw new Api404Error(NOT_FOUND)
            }
            console.log(prod)

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
                sort = '-_id',
                limit = 30,
                price_min,
                price_max,
                rating_filter,
                offset,
            } = req.query

            const filter = {}

            if (price_min) {
                filter.price = { $gt: +price_min }
            }
            if (price_max) {
                filter.price = { $lt: +price_max }
            }
            if (price_min && price_max) {
                filter.price = { $gt: +price_min, $lt: +price_max }
            }
            if (rating_filter) {
                filter.rate = { $gt: +rating_filter }
            }

            // let nextKey = null
            // if (nextId) {
            //     nextKey = {
            //         _id: nextId,
            //         [sortField]: nextProp,
            //     }
            // }

            // console.log(nextKey)

            // const { paginatedQuery, nextKeyFn } = generatePaginationQuery(
            //     query,
            //     sort,
            //     nextKey
            // )

            // console.log(paginatedQuery)

            const listProd = await Product.find(filter)
                .limit(limit)
                .sort(sort)
                .cache({ time: 120 }) // cache 2 minutes
            // nextKey = nextKeyFn(listProd)
            res.json({
                success: true,
                data: listProd,
                // nextKey,
            })
        } catch (error) {
            next(error)
        }
    },
    async getProduct(req, res, next) {
        try {
            const prodId = req.params.id
            const prod = await Product.findById(prodId)
                .populate({ path: 'category', select: 'display_name slug' })
                .populate('shop')
                .exec()
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
