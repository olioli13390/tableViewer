const express = require("express")
const router = express.Router()
const dataBaseConnectionController = require("../controllers/dataBaseConnectionController.js")
const authguard = require("../services/auth.js")

router.post('/addConnection', authguard, dataBaseConnectionController.postDb)

module.exports = router
