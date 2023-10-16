const User_model = require("../models/userModel");

// login user
const loginUser = async (req, res) => {
  res.json({ msg: "login user" });
};

// signup user
const signUpUser = async (req, res) => {
  res.json({ msg: "signup user" });
};

module.exports = {
  loginUser,
  signUpUser,
};
