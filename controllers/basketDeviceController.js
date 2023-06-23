const {BasketDevice} = require("../models/models");

class BasketDeviceController {
    async create(req, res) {
        const {basketId, userId} = req.body
        const basketDevice = await BasketDevice.create({name})
        return res.json(basketDevice)
    }

    // async getAll(req, res) {
    //     const brands = await Basket.findAll()
    //     return res.json(brands)
    //
    // }
}

module.exports = new BasketDeviceController()