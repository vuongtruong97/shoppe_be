<<<<<<< HEAD
const Category = require('../models/Category.model')
const logger = require('../lib/logger.lib')
const sharp = require('sharp')
const _ = require('lodash')
const slugify = require('slugify')
const Image = require('../models/Image.model')

const {
    Api404Error,
    Api409Error,
    Api429Error,
    Api422Error,
} = require('../lib/custom-error-handler/apiError')

const {
    EXIST_CATEGORY,
    NOT_FOUND,
    ADD_CATEGORY,
    UPDATE_CATEGORY,
    DELETE_CATEGORY,
} = require('../constant/category.constant')

module.exports = {
    async addCategory(req, res, next) {
        try {
            const { name, display_name } = req.body

            const isExist = await Category.findOne({ name })

            if (isExist) {
                throw new Api409Error(EXIST_CATEGORY)
            }

            const slug = slugify(name)

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

            const category = new Category({ name, display_name, slug, image_url })

            await category.save()

            res.status(200).json({
                success: true,
                message: ADD_CATEGORY.CREATE_SUCCESS,
            })
        } catch (error) {
            next(error)
        }
    },
    async updateCategory(req, res, next) {
        try {
            const { slug } = req.params

            const { name, display_name } = req.body

            const category = await Category.findOne({ slug })

            if (!category) {
                throw new Api404Error(NOT_FOUND)
            }

            const isExistName = await Category.findOne({ name })

            if (isExistName) {
                throw new Api409Error(EXIST_CATEGORY)
            }

            const listUpdates = Object.keys(req.body)

            const listAllows = Object.keys(Category.schema.paths)

            const isAllow = listUpdates.every((update) => listAllows.includes(update))

            if (!isAllow) {
                throw new Api422Error(UPDATE_CATEGORY.UPDATE_INVALID)
            }

            const isUpdated = await Category.findOneAndUpdate(
                { slug },
                { name, display_name, image }
            )

            if (!isUpdated) {
                throw new Api422Error(UPDATE_CATEGORY.UPDATE_FAIL)
            }

            return res.status(200).json({
                success: true,
                message: UPDATE_CATEGORY.UPDATE_SUCCESS,
            })
        } catch (error) {
            next(error)
        }
    },
    async deleteCategory(req, res, next) {
        try {
            const { slug } = req.params

            const category = await Category.findOne({ slug })

            if (!category) {
                throw new Api404Error(NOT_FOUND)
            }

            await category.remove()

            return res.status(200).json({
                success: true,
                message: DELETE_CATEGORY.DELETE_SUCCESS,
            })
        } catch (error) {
            next(error)
        }
    },
    async getListCategory(req, res, next) {
        try {
            const where = {}
            const { limit = 30, sort = '_id' } = req.query

            const getListCategory = await Category.find({ where })
                .cache({ time: 60 })
                .limit(limit)
                .sort(sort)

            if (!getListCategory || _.isArray(getListCategory) === false) {
                throw new Api404Error(NOT_FOUND)
            }

            return res.status(200).json({ success: true, data: getListCategory })
        } catch (error) {
            next(error)
        }
    },

    async getProdOfCate(req, res, next) {
        try {
            const { slug } = req.params

            let {
                sort = '-_id',
                limit = 5,
                filter,
                price_min,
                price_max,
                rating_filter,
            } = req.query

            filter = {}

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

            console.log(filter)
            console.log('limit', limit)
            console.log('sort', sort)

            const prodOfCate = await Category.findOne({ slug })
                .populate({
                    path: 'products',
                    match: filter,
                    options: {
                        sort,
                        limit,
                    },
                })
                .select('products')
                .exec()
            if (!prodOfCate) {
                throw new Api404Error(NOT_FOUND)
            }
            res.json({
                success: true,
                data: prodOfCate.products,
            })
        } catch (error) {
            next(error)
        }
    },
}
=======
const Category = require('../models/Category.model')
const logger = require('../lib/logger.lib')
const sharp = require('sharp')
const _ = require('lodash')
const slugify = require('slugify')

const {
    Api404Error,
    Api409Error,
    Api429Error,
    Api422Error,
} = require('../lib/custom-error-handler/apiError')

const {
    EXIST_CATEGORY,
    NOT_FOUND,
    ADD_CATEGORY,
    UPDATE_CATEGORY,
    DELETE_CATEGORY,
} = require('../constant/category.constant')

module.exports = {
    async addCategory(req, res, next) {
        try {
            const { name, display_name } = req.body

            const isExist = await Category.findOne({ name })

            if (isExist) {
                throw new Api409Error(EXIST_CATEGORY)
            }

            const buffer = await sharp(req.file.buffer)
                .resize({ width: 250, height: 250 })
                .webp()
                .toBuffer()

            const slug = slugify(name)

            const image_url = `categories/image/${slug}`

            const image = {
                contentType: 'image/webp',
                data: buffer,
            }

            const category = new Category({ name, display_name, image, slug, image_url })

            await category.save()

            res.status(200).json({
                success: true,
                message: ADD_CATEGORY.CREATE_SUCCESS,
            })
        } catch (error) {
            next(error)
        }
    },
    async updateCategory(req, res, next) {
        try {
            const { slug } = req.params

            const { name, display_name } = req.body

            const category = await Category.findOne({ slug })

            if (!category) {
                throw new Api404Error(NOT_FOUND)
            }

            const isExistName = await Category.findOne({ name })

            if (isExistName) {
                throw new Api409Error(EXIST_CATEGORY)
            }

            const listUpdates = Object.keys(req.body)

            const listAllows = Object.keys(Category.schema.paths)

            const isAllow = listUpdates.every((update) => listAllows.includes(update))

            if (!isAllow) {
                throw new Api422Error(UPDATE_CATEGORY.UPDATE_INVALID)
            }

            const isUpdated = await Category.findOneAndUpdate(
                { slug },
                { name, display_name, image }
            )

            if (!isUpdated) {
                throw new Api422Error(UPDATE_CATEGORY.UPDATE_FAIL)
            }

            return res.status(200).json({
                success: true,
                message: UPDATE_CATEGORY.UPDATE_SUCCESS,
            })
        } catch (error) {
            next(error)
        }
    },
    async deleteCategory(req, res, next) {
        try {
            const { slug } = req.params

            const category = await Category.findOne({ slug })

            if (!category) {
                throw new Api404Error(NOT_FOUND)
            }

            await category.remove()

            return res.status(200).json({
                success: true,
                message: DELETE_CATEGORY.DELETE_SUCCESS,
            })
        } catch (error) {
            next(error)
        }
    },
    async getListCategory(req, res, next) {
        try {
            const where = {}
            const { limit = 30, sort = '_id' } = req.query

            const getListCategory = await Category.find({ where })
                .cache({ time: 60 })
                .select('-image')
                .limit(limit)
                .sort(sort)

            if (!getListCategory || _.isArray(getListCategory) === false) {
                throw new Api404Error(NOT_FOUND)
            }

            return res.status(200).json({ success: true, data: getListCategory })
        } catch (error) {
            next(error)
        }
    },
    async getCateImageById(req, res, next) {
        try {
            const { slug } = req.params

            const category = await Category.find({ slug }).select('image -_id')

            if (category.length === 0) {
                throw new Api404Error('Image not found')
            }

            res.set('Content-Type', category[0].image.contentType)
            res.status(200).send(category[0].image.data)
        } catch (error) {
            next(error)
        }
    },
    async getProdOfCate(req, res, next) {
        try {
            const { slug } = req.params

            let {
                sort = '-_id',
                limit = 5,
                filter,
                price_min,
                price_max,
                rating_filter,
            } = req.query

            filter = {}

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

            console.log(filter)
            console.log('limit', limit)
            console.log('sort', sort)

            const prodOfCate = await Category.findOne({ slug })
                .populate({
                    path: 'products',
                    match: filter,
                    options: {
                        sort,
                        limit,
                    },
                })
                .select('products')
                .exec()
            if (!prodOfCate) {
                throw new Api404Error(NOT_FOUND)
            }
            res.json({
                success: true,
                data: prodOfCate.products,
            })
        } catch (error) {
            next(error)
        }
    },
}
>>>>>>> a30e69258abb7728fc1e981be9420856fb279489
