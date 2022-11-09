const asyncHandler = require("express-async-handler");
const { isValidObjectId } = require("mongoose");
const sendError = require("../../utils/sendError");
const PasswordResetToken = require("../../models/passwordResetToken");
const User = require("../../models/User");
const { generateMailTransporter } = require("../../utils/email");

const passwordResetController = asyncHandler(async (req, res) => {
  const { newPassword, userId, token } = req.body;

  const isValidUserId = isValidObjectId(userId);
  if (!isValidUserId) return sendError(res, "Invalid request!", 400);

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) return sendError(res, "User not found", 404);

  // Check if token is valid
  const passwordResetToken = await PasswordResetToken.findOne({
    owner: userId,
  });

  console.log(passwordResetToken);
  if (!passwordResetToken)
    return sendError(res, "Invalid token, please request for a new link", 404);

  // Check if token is expired
  const now = new Date();
  if (now > passwordResetToken.expiresAt) {
    await PasswordResetToken.deleteMany({ owner: userId });
    return sendError(res, "Token expired, please request for a new link", 400);
  }

  // Check if token is valid
  const matchedToken = await passwordResetToken.compareToken(token);
  if (!matchedToken)
    return sendError(res, "Invalid token, please request for a new link", 404);

  const matched = await user.matchPassword(newPassword);
  if (matched)
    return sendError(
      res,
      "The new password must be different from the old one!",
      400
    );

  user.password = newPassword;
  await user.save();

  await PasswordResetToken.deleteMany({ owner: user._id });

  const transport = generateMailTransporter();

  transport.sendMail({
    from: "security@reviewapp.com",
    to: user.email,
    subject: "Password Reset Successfully",
    html: `
          <h1>Password Reset Successfully</h1>
          <p>Now you can use new password.</p>
    
        `,
  });

  res.status(201).json({
    success: true,
    message: "Password reset successfully, now you can use new password.",
  });
});

module.exports = passwordResetController;
