const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const _ = require('lodash');
const utils = require("../utils/utils");

module.exports.login = async (req, res) => {
  const { userName, password } = req.body;
  if (!userName || !password) {
    return res.status(400).json({
      error: true,
      message: "Bad Request",
    });
  }

  let queryObj = {};
  if (userName.includes("@")) {
    queryObj["email"] = userName;
  } else {
    queryObj = {
      userName,
    };
  }

  const user = await User.findOne(queryObj).select("_id password");
  if (!user) {
    return res.status(400).json({
      error: true,
      message: "User is not valid",
    });
  }
  if (bcrypt.compareSync(password, user.password)) {
    var token = jwt.sign({ id: user._id }, config.get("jwtKey"));
    return res.status(200).json({
      error: false,
      data: {
        token,
        user: _.pick(user, ['_id'])
      },
    });
  }
};

module.exports.register = async (req, res) => {
  const { firstName, lastName, userName, email, password } = req.body;

  if (!firstName || !lastName || !userName || !email || !password) {
    return res.status(400).json({
      error: true,
      message: "Bad Request",
    });
  }

  const userExists = await User.findOne({
    $or: [{ email }, { userName }],
  }).select("email userName");
  if (userExists) {
    return res.status(200).json({
      error: true,
      message: "User already Registered with same email/username",
    });
  }

  let user = new User({
    firstName,
    lastName,
    userName,
    email,
    password: utils.hashPassword(password),
  });

  const result = await user.save();

  return res.status(200).json({
    error: false,
    message: "User Registered Succesfully",
  });
};
