const Category = require('../models/category.model')
const logger = require('../lib/logger.lib')
const sharp = require('sharp')
const _ = require('lodash')
const slugify = require('slugify')

const {
    EXIST_CATEGORY,
    NOT_FOUND,
    ADD_CATEGORY,
    UPDATE_CATEGORY,
    DELETE_CATEGORY,
} = require('../constant/category.constant')

module.exports = {
    async addCategory(req, res) {
        try {
            const { name, display_name } = req.body

            const isExist = await Category.findOne({ name })

            if (isExist) {
                return res.status(201).json({ success: false, message: EXIST_CATEGORY })
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
            logger.error('[Category Error]', `${error.message}`)
            return res.status(500).json({
                success: false,
                name: error.name,
                error: error.message,
            })
        }
    },
    async updateCategory(req, res) {
        try {
            const { slug } = req.params

            const { name, display_name } = req.body

            const category = await Category.findOne({ slug })

            if (!category) {
                return res.status(404).json({ success: false, message: NOT_FOUND })
            }

            const isExistName = await Category.findOne({ name })

            if (isExistName) {
                return res.status(201).json({ success: false, message: EXIST_CATEGORY })
            }

            const listUpdates = Object.keys(req.body)

            const listAllows = Object.keys(Category.schema.paths)

            const isAllow = listUpdates.every((update) => listAllows.includes(update))

            if (!isAllow) {
                return res
                    .status(201)
                    .json({ success: false, message: UPDATE_CATEGORY.UPDATE_INVALID })
            }

            const isUpdated = await Category.findOneAndUpdate(
                { slug },
                { name, display_name, image }
            )

            if (!isUpdated) {
                return res
                    .status(400)
                    .json({ success: false, message: UPDATE_CATEGORY.UPDATE_FAIL })
            }

            return res.status(200).json({
                success: true,
                message: UPDATE_CATEGORY.UPDATE_SUCCESS,
            })
        } catch (error) {
            logger.error('[Category Error]', JSON.stringify(error))
            return res.status(500).json({
                success: false,
                error: error.message,
            })
        }
    },
    async deleteCategory(req, res) {
        try {
            const { slug } = req.params

            const category = await Category.findOne({ slug })

            if (!category) {
                return res.status(404).json({ success: false, message: NOT_FOUND })
            }

            await category.remove()

            return res.status(200).json({
                success: true,
                message: DELETE_CATEGORY.DELETE_SUCCESS,
            })
        } catch (error) {
            logger.error('[Category Error]', JSON.stringify(error))
            res.status(500).json({
                success: false,
                [error.name]: error.message,
            })
        }
    },
    async getListCategory(req, res) {
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
            const getListCategory = await Category.find({ where })
                .select('-image')
                .skip(paging.start)
                .limit(paging.limit)
                .sort(sort)

            if (!getListCategory || _.isArray(getListCategory) === false) {
                return res.status(404).json({ success: false, data: [] })
            }
            return res.status(200).json({ success: true, data: getListCategory })
        } catch (error) {
            logger.error('[Category Error]', JSON.stringify(error))
            res.status(500).json({ success: false })
        }
    },
    async getCateImageById(req, res) {
        try {
            const { slug } = req.params
            const category = await Category.find({ slug }).select('image -_id')
            res.set('Content-Type', category[0].image.contentType)
            res.status(200).send(category[0].image.data)
        } catch (error) {
            // console.log(error)
            res.status(500).json({ success: false, message: error.message })
        }
    },
}
