const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Indexes
userSchema.index({ email: 1 }); // Single-field index on 'email' for unique constraint

const User = mongoose.model("users", userSchema);

module.exports = User;
