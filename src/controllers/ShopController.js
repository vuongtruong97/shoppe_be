const Shop = require('../models/Shop.model')
const sharp = require('sharp')
const _ = require('lodash')

const {
    Api404Error,
    Api409Error,
    Api422Error,
} = require('../lib/custom-error-handler/apiError')

const {
    EXIST_SHOP,
    NOT_FOUND,
    ADD_SHOP,
    UPDATE_SHOP,
    DELETE_SHOP,
} = require('../constant/shop.constant')

module.exports = {
    async addShop(req, res, next) {
        try {
            const { user } = req
            console.log('run controller')

            if (user.shop && user.shop.length !== 0) {
                throw new Api409Error(ADD_SHOP.LIMITED)
            }

            const {
                shop_name,
                contact_name,
                contact_phone,
                contact_address,
                ward,
                province,
                district,
            } = req.body

            const isExist = await Shop.findOne({ shop_name })

            if (isExist) {
                throw new Api409Error(EXIST_SHOP)
            }

            const shop_contacts = {
                name: contact_name,
                address: {
                    datail: contact_address,
                    ward,
                    district,
                    province,
                },
                phones: [contact_phone],
            }

            console.log(shop_contacts)

            const shop = new Shop({ shop_name, shop_contacts, shop_owner: user._id })
            await shop.save()

            user.shop = shop._id
            await user.save()

            res.status(200).json({
                success: true,
                message: ADD_SHOP.CREATE_SUCCESS,
            })
        } catch (error) {
            next(error)
        }
    },
    async updateShop(req, res, next) {
        try {
            const { slug } = req.params

            const { name, display_name } = req.body

            const Shop = await Shop.findOne({ slug })

            if (!Shop) {
                throw new Api404Error(NOT_FOUND)
            }

            const isExistName = await Shop.findOne({ name })

            if (isExistName) {
                throw new Api409Error(EXIST_SHOP)
            }

            const listUpdates = Object.keys(req.body)

            const listAllows = Object.keys(Shop.schema.paths)

            const isAllow = listUpdates.every((update) => listAllows.includes(update))

            if (!isAllow) {
                throw new Api422Error(UPDATE_SHOP.UPDATE_INVALID)
            }

            const isUpdated = await Shop.findOneAndUpdate(
                { slug },
                { name, display_name, image }
            )

            if (!isUpdated) {
                throw new Api422Error(UPDATE_SHOP.UPDATE_FAIL)
            }

            return res.status(200).json({
                success: true,
                message: UPDATE_SHOP.UPDATE_SUCCESS,
            })
        } catch (error) {
            next(error)
        }
    },
    async deleteShop(req, res, next) {
        try {
            const { slug } = req.params

            const Shop = await Shop.findOne({ slug })

            if (!Shop) {
                throw new Api404Error(NOT_FOUND)
            }

            await Shop.remove()

            return res.status(200).json({
                success: true,
                message: DELETE_SHOP.DELETE_SUCCESS,
            })
        } catch (error) {
            next(error)
        }
    },
    async getListShop(req, res, next) {
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

            const getListShop = await Shop.find({ where })
                .select('-image')
                .skip(paging.start)
                .limit(paging.limit)
                .sort(sort)

            if (!getListShop || _.isArray(getListShop) === false) {
                throw new Api404Error(NOT_FOUND)
            }

            return res.status(200).json({ success: true, data: getListShop })
        } catch (error) {
            next(error)
        }
    },
    async getShop(req, res, next) {
        try {
            const { id } = req.params

            const shop = await Shop.findById(id)

            if (!shop) {
                throw new Api404Error(NOT_FOUND)
            }

            res.json({ success: true, data: shop })
        } catch (error) {
            next(error)
        }
    },
    async getShopProducts(req, res, next) {
        try {
            const { id } = req.params

            const shop = await Shop.findById(id).populate('products', '-images').exec()

            if (!shop) {
                throw new Api404Error(NOT_FOUND)
            }

            res.json({
                success: true,
                data: shop.products,
            })
        } catch (error) {
            next(error)
        }
    },

    // seller
    async myShopProducts(req, res, next) {
        try {
            const shopId = req.user.shop

            const shop = await Shop.findById(shopId)
                .populate('products', '-images')
                .exec()

            if (!shop) {
                throw new Api404Error(NOT_FOUND)
            }

            res.json({
                success: true,
                data: shop.products,
            })
        } catch (error) {
            next(error)
        }
    },
}
