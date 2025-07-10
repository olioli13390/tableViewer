const express = require("express")
const router = express.Router()
const sqlQueryController = require("../controllers/sqlQueryController")
const authguard = require('../services/auth')

router.post("/generate/submit", authguard, sqlQueryController.postGenerateCsv)

module.exports = router