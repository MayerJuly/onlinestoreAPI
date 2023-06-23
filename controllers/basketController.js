const {Basket, BasketDevice, Device} = require("../models/models");

class BasketController {
    async addToBasket(req, res) {
        try {
            const {basketId, itemId:deviceId} = req.body
            const basketDevice = await BasketDevice.findOrCreate({ where: {
                    deviceId: deviceId,
                    basketId: basketId
                }})
            return res.json(basketDevice)

        } catch (err) {
            console.log(err)
            res.status(500).json({message: "Failed to add item to basket"})
        }
    }
    async deleteFromBasket(req, res, next) {
        try {
            const {basketId, itemId:deviceId} = req.body
            await BasketDevice.destroy({ where: {
                    deviceId: deviceId,
                    basketId: basketId
                }})

            next()

        } catch (err) {
            console.log(err)
            res.status(500).json({message: "Failed to add item to basket"})
        }
    }

    async getBasketId(req, res) {
        try {
            const userId = req.user.id
            console.log(userId)

            const basket = await Basket.findOne({
                where: {
                    userId: userId,
                }
            })
            return res.json(basket)
        } catch (err) {
            console.log(err)
            res.status(500).json({message: "Failed to get the basket"})
        }
    }

    async getAllItems(req, res) {
        try {
            const {basketId} = req.body
            const basketDevice = await BasketDevice.findAll({
                where: {
                    basketId: basketId,
                },
                attributes:  ['deviceId']
                }
            )
            const deviceIds = basketDevice.map(res => res.deviceId)

            const devicesList = await Device.findAll({
                where: {
                    id: deviceIds
                }
            });

            return res.json(devicesList)

        } catch (err) {
            console.log(err)
            res.status(500).json({message: err.message})

        }
    }


    async deleteAllItems(req, res) {
        try {
            const data = req.user.id
            const basket = await Basket.findOne({
                where: {
                    userId: data,
                }
            })


            await BasketDevice.destroy({
                    where: {
                        basketId: basket.id,
                    },
                }
            )


            return res.json('ok')

        } catch (err) {
            console.log(err)
            res.status(500).json({message: err.message})

        }
    }

    async getOrder(req, res, next) {
        try {
            const data = req.body
            next()
        } catch (err) {
            console.log(err)
            res.status(500).json({message: "Failed to get the basket"})
        }
    }



    // async getAll(req, res) {
    //     const brands = await Basket.findAll()
    //     return res.json(brands)
    //
    // }
}

module.exports = new BasketController()