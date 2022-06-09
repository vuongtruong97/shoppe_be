const passport = require('passport')
const jwt = require('jsonwebtoken')
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET, FACEBOOK_REDIRECT_URL, SECRET_KEY, EXPERT_KEY } = process.env

const GoogleStrategy = require('passport-google-oauth20').Strategy

const FacebookStrategy = require('passport-facebook')

const User = require('../models/user.model')

passport.use(
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: GOOGLE_REDIRECT_URI,
            scope: ['profile', 'email'],
        },
        async function verify(accessToken, refreshToken, profile, next) {
            console.log(profile)
            try {
                const { family_name: firstName, given_name: lastName, picture: avatar_url, email } = profile._json

                const existUser = await User.findOne({ email })

                if (!existUser) {
                    const info = {
                        email,
                        avatar_url,
                        firstName,
                        lastName,
                    }
                    const newUser = new User(info)
                    await newUser.save()
                    return next(null, newUser)
                }
                return next(null, existUser)
            } catch (error) {
                return next(error)
            }
        }
    )
)

passport.use(
    new FacebookStrategy(
        {
            clientID: FACEBOOK_CLIENT_ID,
            clientSecret: FACEBOOK_CLIENT_SECRET,
            callbackURL: FACEBOOK_REDIRECT_URL,
            profileFields: ['id', 'displayName', 'emails', 'photos'],
        },
        async function verify(accessToken, refreshToken, profile, next) {
            try {
                console.log(profile)
                const facebookid = profile.id
                const avatar = profile.photos[0].value
                const fullname = profile.displayName
                const existUser = await User.findOne({ facebookid })

                if (!existUser) {
                    const info = {
                        avatar,
                        fullname,
                        facebookid,
                    }
                    const newUser = new User(info)
                    await newUser.save()
                    return next(null, newUser)
                }
                return next(null, existUser)
            } catch (error) {
                return next(error)
            }
        }
    )
)

//run when login
passport.serializeUser(async (user, done) => {
    try {
        const data = { _id: user._id }
        const token = jwt.sign(data, SECRET_KEY, { expiresIn: EXPERT_KEY })
        user.token = token

        await user.save()

        done(null, { _id: user._id, token: user.accesstoken })
    } catch (error) {
        done(error)
    }
})

passport.deserializeUser(function (user, done) {
    try {
        done(null, user)
    } catch (error) {
        done(error)
    }
})
