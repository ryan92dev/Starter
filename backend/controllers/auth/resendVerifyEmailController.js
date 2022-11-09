const asyncHandler = require("express-async-handler");
const { isValidObjectId } = require("mongoose");
const User = require("../../models/User");
const EmailVerificationToken = require("../../models/EmailVerificationToken");
const sendError = require("../../utils/sendError");
const generateToken = require("../../utils/generateToken");
const { generateMailTransporter } = require("../../utils/email");

const resendVerifyEmailController = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;

  // Check if userId is valid
  if (!isValidObjectId(userId)) return sendError(res, "Invalid User Id", 400);

  // Check if user exists and verified
  const user = await User.findById(userId);
  if (!user) return sendError(res, "User not found", 404);

  if (user.isVerified) return sendError(res, "User already verified", 400);

  // Check if token exists
  const emailVerificationToken = await EmailVerificationToken.findOne({
    owner: userId,
  });

  if (emailVerificationToken) {
    // Check if token is expired
    const now = await new Date();
    if (now > emailVerificationToken.expiresAt) {
      await EmailVerificationToken.deleteMany({ owner: user._id });
    } else {
      return sendError(
        res,
        "Token already sent, please check your email, You can request for a new activation link after 24 hours",
        400
      );
    }
  }

  // Generate token
  const token = await generateToken();

  // Create email verification token
  await EmailVerificationToken.create({
    owner: userId,
    token,
  });

  // Send email
  const transporter = generateMailTransporter();
  transporter.sendMail({
    from: "verification@reviewapp.com",
    to: user.email,
    subject: "Email Verification",
    html: `
              <p>Please click on the link below to activate your account</p>
              <h1>${token}</h1>
        
            `,
  });

  res.status(201).json({
    success: true,
    user,
    message:
      "Please verify your email to activate your account. Activation Link has been sent to your email accont!",
  });
});

module.exports = resendVerifyEmailController;
