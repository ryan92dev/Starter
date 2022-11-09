const asyncHandler = require("express-async-handler");
const sendError = require("../../utils/sendError");
const User = require("../../models/User");

const meController = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) return sendError(res, "User not found", 404);
  res.status(200).json({
    success: true,
    user,
  });
});

module.exports = meController;
