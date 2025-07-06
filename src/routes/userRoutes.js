const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")

router.get('/register', userController.getRegister)
router.get('/login', userController.getLogin)

router.post('/register', userController.postUser)
router.post('/login', userController.postLogin)

module.exports = router