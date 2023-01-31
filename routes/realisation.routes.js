const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const realisationCtrl = require("../controllers/realisation.controllers");

router.get("/", realisationCtrl.GetRealisations);
router.post("/", auth, multer.array("content", 50), realisationCtrl.PostRealisation);
router.put("/:realisationId", auth, realisationCtrl.UpdateRealisation);
router.delete("/:realisationId", auth, realisationCtrl.DeleteRealisation);

module.exports = router;
