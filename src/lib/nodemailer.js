const nodemailer = require('nodemailer')
const { NODEMAIL_USERNAME, NODEMAIL_PASSWORD, NODEMAIL_HOST, NODEMAIL_PORT, MONGO_URI } =
    process.env
const path = require('path')
const ejs = require('ejs')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: NODEMAIL_HOST,
    port: +NODEMAIL_PORT,
    secure: true,
    auth: {
        user: NODEMAIL_USERNAME,
        pass: NODEMAIL_PASSWORD,
    },
})

class Email {
    constructor(user, payload) {
        this.payload = payload
        this.user = user
        this.from = `FreeLancer`
        this.text = `FreeLancer`
        this.to = user.email
    }

    async send(template, subject = 'FreeLancer') {
        try {
            let mailOptions = {
                from: this.from,
                to: this.to,
                subject,
                html: await ejs.renderFile(
                    path.join(__dirname, `../views/email-template/${template}.ejs`),
                    {
                        payload: this.payload,
                        email: `${this.user.email}`,
                    }
                ),
            }
            const info = await transporter.sendMail(mailOptions)

            console.log(info)
        } catch (error) {
            console.log(error)
        }
    }

    async sendWellCome() {
        await this.send('newEmployee', 'Chào mừng thành viên mới')
    }
    async sendCancelation() {
        await this.send('cancelation', 'Tài khoản của bạn đã bị khoá')
    }
    async sendResetPassword() {
        await this.send('forgotPassword', 'Quên mật khẩu')
    }
}
module.exports = Email
