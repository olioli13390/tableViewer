const express = require("express")
const router = express.Router()
const dataBaseConnectionController = require("../controllers/dataBaseConnectionController.js")
const authguard = require("../services/auth.js")

router.post("/testDb", dataBaseConnectionController.testDb)

router.post("/addConnection", authguard, dataBaseConnectionController.postDb)

router.post("/selectConnection", authguard, dataBaseConnectionController.selectConnection)

router.post("/connectExistingDb", authguard, dataBaseConnectionController.connectExistingDb)


module.exports = router
