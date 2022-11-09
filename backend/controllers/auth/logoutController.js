const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const sendError = require("../../utils/sendError");

const logoutController = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.cookies;

  // Check if refresh token exists
  if (!refreshToken) return sendError(res, "Unauthorized", 403);

  // Check if refresh token is in database
  const userFound = await User.findOne({
    refreshToken: { $in: [refreshToken] },
  });

  // Delete refresh token from database
  if (userFound) {
    userFound.refreshToken = userFound.refreshToken.filter(
      (token) => token !== refreshToken
    );

    await userFound.save();
  }

  // Clear refresh token
  res
    .clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "none",
      secure: false,
    })
    .status(204)
    .send("Logged out");
});

module.exports = logoutController;
