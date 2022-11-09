const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const passwordResetTokenSchema = mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      default: Date.now() + 1000 * 60 * 60 * 24, // 24 hours
    },
  },
  {
    timestamps: true,
  }
);

passwordResetTokenSchema.pre("save", async function (next) {
  if (!this.isModified("token")) {
    next();
  }
  this.token = await bcrypt.hash(this.token, 10);
});

passwordResetTokenSchema.methods.compareToken = async function (token) {
  const result = await bcrypt.compare(token, this.token);
  return result;
};

module.exports = mongoose.model("PasswordResetToken", passwordResetTokenSchema);
