const ApiError = require('../error/ApiError')
const jwt = require('jsonwebtoken')

module.exports = function(role) {
    return function (req,res,next) {
        if(req.method === "OPTIONS") {
            next()
        }
        try {
            const token = req.headers.authorization.split(' ')[1]
            if(!token){
                return next(ApiError.unAuthorized('Пользователь не авторизован'))
            }
            const decodedData = jwt.verify(token, process.env.SECRET_KEY)
            if(decodedData.role !== role) {
                return next(ApiError.forbidden('Нет доступа'))
            }
            req.user = decodedData
            next()
        } catch(err) {
            next(ApiError.unAuthorized('Пользователь не авторизован'))
        }
    }
}