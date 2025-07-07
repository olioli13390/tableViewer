const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")


router.post('/register', userController.postUser)

router.post('/login', userController.postLogin)

router.get('/disconnect', userController.getDisconnected)

module.exports = router