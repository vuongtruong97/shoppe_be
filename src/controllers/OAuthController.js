const { OAuth2Client } = require('google-auth-library')
const User = require('../models/user.model')

const googleClient = new OAuth2Client({
    clientId: `${process.env.GOOGLE_CLIENT_ID}`,
})

module.exports = {
    async authenticateUser(req, res) {
        try {
            const { token } = req.body

            const ticket = googleClient.verifyIdToken({
                idToken: token,
                audient: `${process.env.GOOGLE_CLIENT_ID}`,
            })

            const payload = ticket.getPayload()

            let user = await User.findOne({ email: payload?.email })
            if (!user) {
                user = await new User({
                    email: payload?.email,
                    avatar: payload?.picture,
                    name: payload?.name,
                })

                await user.save()
            }

            res.json({ user, token })
        } catch (error) {}
    },
}
