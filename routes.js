const express = require("express");
const router = express.Router();

const authController = require("./Controllers/AuthController");

router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.post("/auth/refreshSession", authController.refreshSession);
router.post('/auth/validate', authController.validate_token);

module.exports = router;
