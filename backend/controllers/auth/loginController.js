const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const asyncHandler = require("express-async-handler");
const sendError = require("../../utils/sendError");

const loginController = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.cookies;
  console.log(refreshToken);

  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) return sendError(res, "Invalid Credentials", 400);

  // Check if password matches
  const passwordMatches = await user.matchPassword(password);

  if (!passwordMatches) return sendError(res, "Invalid Credentials", 400);

  // Check if user is verified
  if (!user.isVerified)
    return sendError(res, "Please verify your email to continue", 400);

  /// Create Access token
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.ACCESS_JWT_SECRET,
    {
      expiresIn: "5min",
    }
  );

  // Create Refresh token
  const newRefreshToken = jwt.sign(
    { id: user._id, email: user.email },
    process.env.REFRESH_JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );

  // Check if refresh token exists in database
  const newRefreshTokenArray = !refreshToken
    ? user.refreshToken
    : user.refreshToken.filter((token) => token !== refreshToken);

  if (refreshToken) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "none",
      secure: false,
    });
  }

  // Save refresh token to database
  user.refreshToken = [...newRefreshTokenArray, newRefreshToken];
  await user.save();

  res
    .cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
    })
    .status(200)
    .json({
      success: true,
      token,
      user,
    });
});

module.exports = loginController;
