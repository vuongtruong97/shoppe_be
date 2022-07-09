const Cart = require('../models/Cart.model')
const Shop = require('../models/Shop.model')
const _ = require('lodash')

const {
    Api404Error,
    Api409Error,
    Api429Error,
    Api422Error,
} = require('../lib/custom-error-handler/apiError')
const {
    ADD_SUCCESS,
    ADD_FAILED,
    GET_FAILED,
    NOT_FOUND,
    UPDATE_INVALID,
} = require('../constant/cart.constant')

module.exports = {
    async addItemToCart(req, res, next) {
        try {
            const { shop_id, product_id, quantity } = req.body
            const { _id } = req.user

            const order_info = {
                shop_id,
                product_briefs: [{ product_id, quantity: +quantity }],
            }

            const cart = await Cart.findOne({ owner: _id })

            if (!cart && quantity > 0) {
                const cart = new Cart({ owner: _id, shop_order_ids: [order_info] })
                await cart.save()

                return res.json({
                    success: true,
                    message: ADD_SUCCESS,
                })
            }

            if (!cart && quantity < 0) {
                throw new Api422Error(UPDATE_INVALID)
            }

            if (cart) {
                const shop_index = cart.shop_order_ids.findIndex(
                    (shop_order_id) => shop_order_id.shop_id.toString() == shop_id
                )

                // not exist shop_order_id

                if (shop_index == -1 && quantity > 0) {
                    cart.shop_order_ids.push(order_info)
                }

                if (shop_index == -1 && quantity < 0) {
                    throw new Api422Error(UPDATE_INVALID)
                }

                // exist shop_order_id

                if (shop_index != -1) {
                    const product_index = cart.shop_order_ids[
                        shop_index
                    ].product_briefs.findIndex(
                        (product) => product.product_id.toString() == product_id
                    )

                    if (product_index == -1 && quantity > 0) {
                        cart.shop_order_ids[shop_index].product_briefs.push({
                            product_id,
                            quantity: +quantity,
                        })
                    }

                    if (product_index == -1 && quantity <= 0) {
                        throw new Api422Error(UPDATE_INVALID)
                    }

                    if (product_index != -1) {
                        const newQuantity =
                            cart.shop_order_ids[shop_index].product_briefs[product_index]
                                .quantity + +quantity

                        if (newQuantity <= 0) {
                            cart.shop_order_ids[shop_index].product_briefs.splice(
                                product_index,
                                1
                            )
                        }

                        if (newQuantity > 0) {
                            cart.shop_order_ids[shop_index].product_briefs[
                                product_index
                            ] = {
                                product_id,
                                quantity: newQuantity,
                            }
                        }
                    }
                }

                cart.shop_order_ids = cart.shop_order_ids.filter(
                    (shop_order_id) => shop_order_id.product_briefs.length > 0
                )
                await cart.save()
            }

            res.json({
                success: true,
                message: ADD_SUCCESS,
            })
        } catch (error) {
            next(error)
        }
    },
    async getCartDetail(req, res, next) {
        const { limit = 5 } = req.query
        try {
            const { _id } = req.user

            const cart = await Cart.findOne({ owner: _id })
                .populate({
                    path: 'shop_order_ids',
                    populate: [
                        {
                            path: 'shop_id',
                            model: 'Shop',
                            select: 'shop_name',
                        },
                        {
                            path: 'product_briefs',
                            populate: {
                                path: 'product_id',
                                model: 'Product',
                                select: 'image_url name price  quantity',
                            },
                        },
                    ],
                })
                .select('-owner')
                .limit(limit)

            if (!cart) {
                return res.json({
                    success: true,
                    data: [],
                })
            }
            res.json({
                success: true,
                data: cart,
            })
        } catch (error) {
            next(error)
        }
    },
    async getCartList(req, res, next) {
        try {
            const { _id } = req.user
            const { limit = 5 } = req.query
            const cart = await Cart.findOne({ owner: _id })
                .populate({
                    path: 'shop_order_ids',
                    populate: {
                        path: 'product_briefs',
                        populate: {
                            path: 'product_id',
                            model: 'Product',
                            select: 'image_url name price  quantity',
                        },
                    },
                })
                .lean()

            if (!cart) {
                res.json({ success: true, data: [], totals: 0 })
            }

            const list = cart.shop_order_ids.reduce((acc, item, i) => {
                return acc.concat(item.product_briefs)
            }, [])

            res.json({ success: true, data: list, totals: list.length })
        } catch (error) {
            next(error)
        }
    },
}
