const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const userSchema = Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  addedOn: {
    type: Date,
    default: new Date(),
  },
});

module.exports = model("User", userSchema);
