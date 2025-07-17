const express = require("express");
const router = express.Router();
const csvController = require("../controllers/csvFileController");
const authGuard = require('../services/auth');


router.post("/generate/wizard", authGuard, csvController.postGenerateCsv);

module.exports = router;
