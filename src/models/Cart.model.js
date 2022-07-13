const mongoose = require('mongoose')

const { Schema } = mongoose

const cartSchema = new Schema(
    {
        shop_order_ids: [
            {
                shop_id: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
                product_briefs: [
                    {
                        product_id: {
                            type: Schema.Types.ObjectId,
                            ref: 'Products',
                            required: true,
                        },
                        quantity: {
                            type: Number,
                            required: true,
                            validate: {
                                validator: function (v) {
                                    return v > 0
                                },
                                message: `Số lượng sản phẩm không hợp lệ`,
                            },
                        },
                        modelId: { type: Schema.Types.ObjectId, ref: 'Model' },
                    },
                ],
            },
        ],
        owner: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
)

const Cart = mongoose.model('Cart', cartSchema)

module.exports = Cart
