const express = require("express");
const router = express.Router();

const avisCtrl = require("../controllers/avis.controllers");

router.get("/", avisCtrl.GetAvis);
router.post("/", avisCtrl.PostAvis);

module.exports = router;
