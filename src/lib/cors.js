const corsConfig = (app) => {
    const whitelist = ['https://shopee-react-f72ae.web.app', 'http//localhost:3000']

    const corsOptionsDelegate = function (req, callback) {
        let corsOptions
        if (whitelist.indexOf(req.header('Origin')) !== -1) {
            corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
        } else {
            corsOptions = { origin: false } // disable CORS for this request
        }
        callback(null, corsOptions) // callback expects two parameters: error and options
    }

    app.use('*', cors(corsOptionsDelegate), function (req, res, next) {
        next()
    })
}
