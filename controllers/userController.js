const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User, Basket} = require('../models/models')


const generateJwt = (id, email, name, lastName, role) => {
    return jwt.sign({id, email, role, name, lastName}, process.env.SECRET_KEY, {expiresIn:'24h'})
}

class UserController {
    async registration(req, res, next) {
        try {
            const {name, lastName, email, password} = req.body
            const role = 'USER'
            if(!email || !password || !name || !lastName) {
                return next(ApiError.badRequest('Некорректно заполнены поля'))
            }
            const candidate = await User.findOne({where: {email}})
            if(candidate) {
                return next(ApiError.badRequest('Пользователь с таким email уже существует'))
            }
            const hashPassword = await bcrypt.hash(password, 5)
            const user = await User.create({name, lastName, email, role, password: hashPassword})
            const basket = await Basket.create({userId: user.id})
            const token = generateJwt(user.id, user.email, user.name, user.lastName, user.role)
            return res.json({token})
        } catch (err) {
            res.status(500).json({message: err.message})
        }


    }
    async login(req, res, next) {
        const {email, password} = req.body
        const user = await User.findOne({where: {email}})
        if(!user) {
            return next(ApiError.internal('Пользователь не найден'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if(!comparePassword) {
            return next(ApiError.internal('Неверный пароль'))
        }
        const token = generateJwt(user.id, user.email, user.name, user.lastName, user.role)
        return res.json({token})

    }
    async check(req, res) {
        const token = generateJwt(req.user.id, req.user.email, req.user.name, req.user.lastName, req.user.role)
        console.log(token)
        return res.json({token})
    }

}

module.exports = new UserController()