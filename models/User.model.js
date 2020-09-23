const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Always create the name of the collection in SINGULAR
const User = model("user", userSchema);

module.exports = User;
