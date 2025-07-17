const express = require("express");
const router = express.Router();
const visualizationController = require("../controllers/visualizationController");
const authguard = require('../services/auth');

router.post("/visualization", authguard, visualizationController.postVisualization);

module.exports = router;