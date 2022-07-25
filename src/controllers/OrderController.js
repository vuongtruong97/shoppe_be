const { sendRabbitMQ } = require('../queue/rabbitmq')

module.exports = {
    async createOrder(req, res, next) {
        try {
            const { list_order } = req.body

            sendRabbitMQ('orders', list_order)

            res.json({ success: true, data: list_order })
        } catch (error) {
            next(error)
        }
    },
}
