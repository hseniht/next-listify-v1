const User_model = require("../models/userModel");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id: _id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "3d",
  });
};

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User_model.login(email, password);

    // create a token if success
    const token = createToken(user._id);

    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// signup user
const signUpUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User_model.signup(email, password);

    // create a token
    const token = createToken(user._id);

    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  loginUser,
  signUpUser,
};
