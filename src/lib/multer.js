const multer = require('multer')

const categoryImage = multer({
    limits: {
        fileSize: 1048576,
    },
    fileFilter(req, file, cb) {
        // avatar upload validate
        if (!file.originalname.match(/\.(jpg|JPEG|jpeg|png)$/)) {
            return cb(new Error('File upload is incorrect format(jpg,jpeg,png)!'))
        }
        cb(null, true)
        // cb(null, false)
        // cb(null, false)
    },
})

module.exports = { categoryImage }
