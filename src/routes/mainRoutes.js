const express = require("express")
const router = express.Router()
const mainController = require("../controllers/mainController")
const authguard = require('../services/auth')

router.get('/register', mainController.getRegister)
router.get('/login', mainController.getLogin)
router.get('/', authguard, mainController.getDashboard)
router.get('/addConnection', authguard, mainController.getAddConnection)
router.get('/uploadCsv', authguard, mainController.getUploadCsv)

module.exports = router