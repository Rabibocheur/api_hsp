const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const multer = require("../middleware/multer-config");
const adminCtrl = require("../controllers/admin.controllers");

router.post("/login", adminCtrl.AdminConnect);
router.post("/register", adminCtrl.register);

router.get("/galerie", adminCtrl.GetGalerie);
router.post("/galerie", auth, multer.array("content", 50), adminCtrl.PostGalerie);
router.delete("/:galerieId", auth, adminCtrl.DeleteGalerie);

router.post("/mail", adminCtrl.sendEmail);

module.exports = router;
