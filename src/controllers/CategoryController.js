const Category = require('../models/Category.model')
const logger = require('../lib/logger.lib')
const sharp = require('sharp')
const _ = require('lodash')
const slugify = require('slugify')
const { getOrSetCache } = require('../lib/redis-cache')

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
            const {
                filter,
                paging = { start: 0, limit: 20 },
                sort = { createdAt: -1 },
            } = req.body

            if (_.get(filter, 'name', false) !== false) {
                where['name'] = {
                    $regex: _.toUpper(filter.firstname.trim()),
                    $options: 'i',
                }
            }

            const listCate = await getOrSetCache(
                'list_cate',
                async () => {
                    const getListCategory = await Category.find({ where })
                        .select('-image')
                        .skip(paging.start)
                        .limit(paging.limit)
                        .sort(sort)

                    if (!getListCategory || _.isArray(getListCategory) === false) {
                        throw new Api404Error(NOT_FOUND)
                    }
                    return getListCategory
                },
                3600
            )

            return res.status(200).json({ success: true, data: listCate })
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
}
