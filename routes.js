const express = require("express");
const router = express.Router();

const authController = require("./controllers/AuthController");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refreshSession", authController.refreshSession);
router.post('/validate', authController.validate);

module.exports = router;
