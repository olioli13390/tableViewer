const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const authguard = require("../services/auth")


router.post('/register', userController.postUser)

router.post('/login', userController.postLogin)

router.get('/disconnect', authguard, userController.getDisconnected)

module.exports = router