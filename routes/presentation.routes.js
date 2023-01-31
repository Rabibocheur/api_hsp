const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const presentationCtrl = require("../controllers/presentation.controllers");

router.get("/", presentationCtrl.GetPresentation);
router.put("/", auth, presentationCtrl.UpdatePresentation);

module.exports = router;
