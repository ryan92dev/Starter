const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth/authController");
const authMiddleware = require("../middleware/authMiddleware");
const passwordResetValid = require("../middleware/passwordResetValid");
const {
  validate,
  userValidtor,
  loginValidator,
} = require("../middleware/validators");

router.post("/register", userValidtor, validate, authController.register);
router.post("/login", loginValidator, validate, authController.login);
router.post("/logout", authMiddleware, authController.logout);

// Email Verification
router.post("/verify-email", authController.verifyEmail);
router.post("/resend-verify-email", authController.resendVerificationEmail);

// Password Reset
router.post("/forgot-password", authController.forgotPassword);
router.post(
  "/reset-password",
  passwordResetValid,
  authController.resetPassword
);

// Refresh Token
router.get("/refresh-token", authController.refreshToken);

router.get("/me", authMiddleware, authController.me);

module.exports = router;
