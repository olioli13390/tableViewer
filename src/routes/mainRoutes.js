const express = require("express")
const router = express.Router()
const mainController = require("../controllers/mainController")

router.get('/register', mainController.getRegister)
router.get('/login', mainController.getLogin)
router.get('/', mainController.getDashboard)

module.exports = router