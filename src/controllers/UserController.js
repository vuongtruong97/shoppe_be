const User = require('../models/user.model')

module.exports = {
    async createUser(req, res) {
        try {
            const { email, password } = req.body

            const existUser = await User.findOne({ email })

            if (existUser) {
                throw new Error('User is exist')
            }
            const user = new User({ email, password })
            await user.save()

            res.status(200).json({ success: true, message: 'Create user successfully' })
        } catch (error) {
            res.status(400).json({ success: false, message: error.message })
        }
    },
}
