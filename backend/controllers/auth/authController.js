const registerController = require("./registerController");
const loginController = require("./loginController");
const meController = require("./meController");
const verifyEmailController = require("./verifyEmailController");
const resendVerifyEmailController = require("./resendVerifyEmailController");
const logoutController = require("./logoutController");
const refreshTokenController = require("./refreshTokenController");
const forgotPasswordController = require("./forgotPasswordController");
const passwordResetController = require("./passwordResetController");

const authControllers = {
  register: registerController,
  login: loginController,
  me: meController,
  verifyEmail: verifyEmailController,
  resendVerificationEmail: resendVerifyEmailController,
  logout: logoutController,
  refreshToken: refreshTokenController,
  forgotPassword: forgotPasswordController,
  resetPassword: passwordResetController,
};

module.exports = authControllers;
