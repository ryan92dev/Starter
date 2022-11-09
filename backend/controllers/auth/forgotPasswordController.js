const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const sendError = require("../../utils/sendError");
const generateToken = require("../../utils/generateToken");
const PasswordResetToken = require("../../models/passwordResetToken");
const { generateMailTransporter } = require("../../utils/email");

const forgotPasswordController = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) return sendError(res, "Email is required!");

  const user = await User.findOne({ email });
  if (!user) return sendError(res, "Your email is not registered with us", 404);

  const alreadyHasToken = await PasswordResetToken.findOne({ owner: user._id });

  // Check if token is expired
  if (alreadyHasToken) {
    const now = new Date();
    if (now > alreadyHasToken.expiresAt) {
      await PasswordResetToken.deleteMany({ owner: user._id });
    } else {
      return sendError(
        res,
        "Token already sent, please check your email, You can request for a new activation link after 24 hours",
        400
      );
    }
  }

  const token = await generateToken();
  const newPasswordResetToken = await PasswordResetToken({
    owner: user._id,
    token,
  });

  await newPasswordResetToken.save();

  const resetPasswordUrl = `http://localhost:3000/reset-password/${user._id}/${token}`;

  const transport = generateMailTransporter();

  transport.sendMail({
    from: "security@reviewapp.com",
    to: user.email,
    subject: "Reset Password Link",
    html: `
          <p>Click here to reset password</p>
          <a href='${resetPasswordUrl}'>Change Password</a>

        `,
  });

  res.status(200).json({ success: true, message: "Link sent to your email!" });
});

module.exports = forgotPasswordController;
