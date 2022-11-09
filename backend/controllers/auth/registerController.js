const asyncHandler = require("express-async-handler");
const User = require("../../models/User");
const EmailVerificationToken = require("../../models/EmailVerificationToken");
const generateToken = require("../../utils/generateToken");
const { generateMailTransporter } = require("../../utils/email");
const sendError = require("../../utils/sendError");

const registerController = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) return sendError(res, 400, "User already exists");

  // Create user
  const user = await User.create({
    username,
    email,
    password,
  });

  const token = await generateToken();

  // Create email verification token
  await EmailVerificationToken.create({
    owner: user._id,
    token,
  });

  // Send email verification token to user
  const transporter = generateMailTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: "Email Verification",
    html: `<h1>Click the link below to verify your email</h1>
    <a href="${process.env.CLIENT_URL}/verify-email/${user.id}/${token}">Verify Email</a>`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
      return sendError(res, 500, "Something went wrong");
    }
    console.log(info);
  });

  // transporter.sendMail({
  //   from: "verification@reviewapp.com",
  //   to: user.email,
  //   subject: "Email Verification",
  //   html: `
  //         <p>Please click on the link below to activate your account</p>
  //         <h1>${token}</h1>

  //       `,
  // });

  res.status(201).json({
    success: true,
    user,
    message:
      "Please verify your email to activate your account. Activation Link has been sent to your email accont!",
  });
});

module.exports = registerController;
