const amqplib = require('amqplib')
const logger = require('../lib/logger.lib')

const amqp_url = process.env.CLOUDAMQP_URL || 'amqp://localhost:5672'

const sendRabbitMQ = async (queueName, data) => {
    try {
        const connection = await amqplib.connect(amqp_url, 'heartbeat=60')

        const queue = queueName

        const channel = await connection.createChannel()
        channel.prefetch(1)

        const exchange = 'test exchange'

        await channel.assertExchange(exchange, 'direct', { durable: true })

        await channel.assertQueue(queue, { durable: true })
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), {
            persistent: true,
        })

        setTimeout(function () {
            channel.close()
            connection.close()
        }, 500)

        logger.info('Close RabbitMQ connection')
    } catch (error) {
        logger.error(error)
    }
}

const publishRabbitMQ = async (exchange, routeKey, data) => {
    try {
        // const queueName = 'hello'
        const connection = await amqplib.connect(amqp_url, 'heartbeat=60')

        const channel = await connection.createChannel()

        // create global chanel
        global._channel = channel

        channel.prefetch(1)

        await channel.assertExchange(exchange, 'direct', { durable: true })

        // await channel.assertQueue(queueName, { durable: true })
        // await channel.bindQueue(queueName, exchange, routeKey)
        channel.publish(exchange, routeKey, Buffer.from(JSON.stringify(data)))

        setTimeout(function () {
            channel.close()
            connection.close()
        }, 500)

        logger.info('Close RabbitMQ connection')
    } catch (error) {
        logger.error(error)
    }
}

// sendRabbitMQ('orders', 'hello orders services')
// sendRabbitMQ('email-queue', { _id: 123123, email: 'truongquocvuongnb@gmail.com' })
// publishRabbitMQ('email', 'new-user', {
//     _id: 123123,
//     email: 'truongquocvuongnb@gmail.com',
// })
// publishRabbitMQ('email', 'new-user', {
//     email: 'truongquocvuong97nb@gmail.com',
//     payload: {
//         password: 'hihihihih',
//     },
// })

module.exports = { sendRabbitMQ, publishRabbitMQ }
