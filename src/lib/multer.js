const multer = require('multer')
const { Api422Error } = require('./custom-error-handler/apiError')

const imageValidate = multer({
    limits: {
        fileSize: 1048576,
    },
    fileFilter(req, file, cb) {
        // avatar upload validate
        if (
            !file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|jfif|JFIF)$/)
        ) {
            // return cb(null, false)
            // return cb(new Error('Hình ảnh không đúng định dạng', false))
            // process.exit(1)
            cb(
                new Api422Error(
                    'Chỉ chấp nhận file có định dạng (jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|jfif|JFIF)!'
                )
            )
        }
        cb(null, true)
    },
})

module.exports = { imageValidate }
