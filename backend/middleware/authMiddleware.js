const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendError = require("../utils/sendError");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token = req.body.token || req.query.token || req.headers["authorization"];

  if (!token) return sendError(res, "Not authorized", 401);

  if (token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_JWT_SECRET,
      (err, decoded) => {
        if (err) return sendError(res, "Not authorized", 401);

        return decoded;
      }
    );

    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return sendError(res, "Not authorized", 401);
  }
});

module.exports = authMiddleware;
