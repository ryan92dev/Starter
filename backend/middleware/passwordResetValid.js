const asyncHandler = require("express-async-handler");
const { isValidObjectId } = require("mongoose");
const sendError = require("../utils/sendError");
const PasswordResetToken = require("../models/passwordResetToken");

const passwordResetValid = asyncHandler(async (req, res, next) => {
  const { userId, token } = req.body; // This is the token from the URL (req.params.token)

  console.log("userId: ", userId);
  console.log("token: ", token);

  if (!token || !userId) return sendError(res, "Invalid request!", 400);

  if (!token.trim() || !isValidObjectId(userId))
    return sendError(res, "Invalid request!", 400);

  // Find the token in the database
  const passwordResetToken = await PasswordResetToken.findOne({
    owner: userId,
  });

  if (!passwordResetToken) return sendError(res, "Invalid token!", 400);

  const matched = await passwordResetToken.compareToken(token);
  if (!matched) return sendError(res, "Unauthorized access, invalid request!");

  // Check if token is expired
  const now = new Date();
  if (now > passwordResetToken.expiresAt) {
    await PasswordResetToken.deleteMany({ owner: userId });
    return sendError(res, "Token expired, please request for a new link", 400);
  }

  //   await PasswordResetToken.deleteMany({ owner: userId });

  req.resetToken = passwordResetToken;

  next();
});

module.exports = passwordResetValid;
