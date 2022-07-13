const Brand = require('../model/Brand.model')
const logger = require('../library/logger.lib')
const _ = require('lodash')
const {
    EXIST_BRAND,
    NOT_FOUND,
    ADD_BRAND,
    UPDATE_BRAND,
    DELETE_BRAND,
} = require('../constant/brandConstant.constant')

module.exports = {
    async addBrand(req, res) {
        try {
            const { brandName, brandDescription } = req.body

            const isExist = await Brand.findOne({ brandName })

            if (isExist) {
                return res.status(201).json({ success: false, message: EXIST_BRAND })
            }

            const category = new Brand({ brandName, brandDescription })

            await category.save()

            res.status(200).json({
                success: true,
                message: ADD_BRAND.CREATE_SUCCESS,
            })
        } catch (error) {
            logger.error('[Brand Error]', JSON.stringify(error))
            return res.status(500).json({
                success: false,
                [error.name]: error.message,
            })
        }
    },
    async updateBrand(req, res) {
        try {
            const { slug } = req.params

            const { brandName, brandDescription } = req.body

            const category = await Brand.findOne({ slug })

            if (!category) {
                return res.status(404).json({ success: false, message: NOT_FOUND })
            }

            const isExistName = await Brand.findOne({ brandName })

            if (isExistName) {
                return res.status(201).json({ success: false, message: EXIST_BRAND })
            }

            const listUpdates = Object.keys(req.body)

            const listAllows = Object.keys(Brand.schema.paths)

            const isAllow = listUpdates.every((update) => listAllows.includes(update))

            if (!isAllow) {
                return res
                    .status(201)
                    .json({ success: false, message: UPDATE_BRAND.UPDATE_INVALID })
            }

            const isUpdated = await Brand.findOneAndUpdate(
                { slug },
                { brandName, brandDescription }
            )

            if (!isUpdated) {
                return res
                    .status(400)
                    .json({ success: false, message: UPDATE_BRAND.UPDATE_FAIL })
            }

            return res.status(200).json({
                success: true,
                message: UPDATE_BRAND.UPDATE_SUCCESS,
            })
        } catch (error) {
            logger.error('[Brand Error]', JSON.stringify(error))
            return res.status(500).json({
                success: false,
                error: error.message,
            })
        }
    },
    async deleteBrand(req, res) {
        try {
            const { slug } = req.params

            const category = await Brand.findOne({ slug })

            if (!category) {
                return res.status(404).json({ success: false, message: NOT_FOUND })
            }

            await category.remove()

            return res.status(200).json({
                success: true,
                message: DELETE_BRAND.DELETE_SUCCESS,
            })
        } catch (error) {
            logger.error('[Brand Error]', JSON.stringify(error))
            res.status(500).json({
                success: false,
                [error.name]: error.message,
            })
        }
    },
    async getListBrand(req, res) {
        try {
            const where = {}
            const {
                filter,
                paging = { start: 0, limit: 20 },
                sort = { createdAt: -1 },
            } = req.body
            if (_.get(filter, 'brandName', false) !== false) {
                where['brandName'] = {
                    $regex: _.toUpper(filter.firstname.trim()),
                    $options: 'i',
                }
            }
            const getListBrand = await Brand.find({ where })
                .skip(paging.start)
                .limit(paging.limit)
                .sort(sort)

            if (!getListBrand || _.isArray(getListBrand) === false) {
                return res.status(404).json({ success: false, data: [] })
            }
            return res.status(200).json({ success: true, data: getListBrand })
        } catch (error) {
            logger.error('[Brand Error]', JSON.stringify(error))
            res.status(500).json({ success: false })
        }
    },
}
