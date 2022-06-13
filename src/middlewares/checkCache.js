const { redisClient } = require('../db/db')
checkCache = async (req, res, next) => {
    const { slug } = req.params
    //get data value for key =id

    try {
        //test cache
        const data = await redisClient.get('listcategory')
        // const data = await redisClient.del('liscategory')
        if (!data) {
            console.log('cache fail')
            return next()
        }
        if (data !== null) {
            console.log('cache success')
            return res.status(200).json({ success: true, data: JSON.parse(data) })
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
        console.log(error)
    }
}

module.exports = { checkCache }
