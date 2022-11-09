const asyncHandler = require("express-async-handler");
const { isValidObjectId } = require("mongoose");
const User = require("../../models/User");
const EmailVerificationToken = require("../../models/EmailVerificationToken");
const sendError = require("../../utils/sendError");

const verifyEmailController = asyncHandler(async (req, res, next) => {
  const { userId, token } = req.body;
  console.log(userId, token);

  // Check if userId is valld
  if (!isValidObjectId(userId)) return sendError(res, "Invalid User Id", 400);

  // Check if user exists and verified
  const user = await User.findById(userId);
  if (!user) return sendError(res, "User not found", 404);

  if (user.isVerified) return sendError(res, "User already verified", 400);

  // Check if token exists
  const emailVerificationToken = await EmailVerificationToken.findOne({
    owner: userId,
  });

  console.log(emailVerificationToken);

  if (!emailVerificationToken)
    return sendError(
      res,
      "Invalid Activation token, please request for a new link",
      404
    );

  // Compare token from request body with token in database

  const isMatch = await emailVerificationToken.compareToken(token);
  if (!isMatch) return sendError(res, "Invalid Activation token", 400);

  // Check if token is expired
  const now = new Date();
  if (now > emailVerificationToken.expiresAt)
    return sendError(res, "Token expired, please request for a new link", 400);

  // Verify user
  user.isVerified = true;
  await user.save();

  // Delete token
  await EmailVerificationToken.deleteMany({ owner: user._id });

  res.status(200).json({
    success: true,
    message: "Account has been verified",
  });
});

module.exports = verifyEmailController;
