const Router = require('express')
const router = new Router()
const basketController = require('../controllers/basketController')
const authMiddleware = require("../middleware/authMiddleware");

router.post('/add', authMiddleware, basketController.addToBasket)
router.get('/', authMiddleware, basketController.getBasketId)
router.post('/', authMiddleware, basketController.getAllItems)
router.post('/delete', authMiddleware, basketController.deleteFromBasket, basketController.getAllItems)
router.post('/order', authMiddleware, basketController.getOrder, basketController.deleteAllItems)


module.exports = router