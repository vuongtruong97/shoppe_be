const Product = require('../models/Product.model')
const sharp = require('sharp')
const _ = require('lodash')
const { getOrSetCache } = require('../lib/redis-cache')

const {
    Api404Error,
    Api409Error,
    Api422Error,
} = require('../lib/custom-error-handler/apiError')

const {
    EXIST_PROD,
    NOT_FOUND,
    ADD_PROD,
    UPDATE_PROD,
    DELETE_PROD,
} = require('../constant/Product.constant')

module.exports = {
    async addProduct(req, res, next) {
        try {
            const { user } = req
            console.log('run controller')

            console.log(user)

            const { shop_name, contact_name, contact_phone, contact_address } = req.body

            const isExist = await Product.findOne({ shop_name })

            if (isExist) {
                throw new Api409Error(EXIST_PROD)
            }

            const shop_contacts = {
                name: contact_name,
                address: contact_address,
                phones: [contact_phone],
            }

            const shop = new Product({ shop_name, shop_contacts, shop_owner: user._id })
            await shop.save()

            user.shop = shop._id
            await user.save()

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
                    const getListProduct = await Product.find({ where })
                        .select('-image')
                        .skip(paging.start)
                        .limit(paging.limit)
                        .sort(sort)

                    if (!getListProduct || _.isArray(getListProduct) === false) {
                        throw new Api404Error(NOT_FOUND)
                    }
                    return getListProduct
                },
                3600
            )

            return res.status(200).json({ success: true, data: listCate })
        } catch (error) {
            next(error)
        }
    },
    async getProduct(req, res, next) {
        try {
            const userId = req.user._id
        } catch (error) {}
    },
}
