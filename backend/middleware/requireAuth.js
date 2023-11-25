const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const requireAuth = async (req, res, next) => {
  // verify authentication
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  //Eg: "Bearer eyJhbGcdsfcCI6MTY5ODMzMjA5NH0.L1tz9i7VXVNh05TeblgNt6_0U1iTBI"
  const token = authorization.split(" ")[1]; // get the second sentence (- "Bearer")

  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // attach it so it carries on to other request
    req.user = await User.findOne({ _id }).select("_id"); // find in db then return "_id" field only
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Request is not authorized" });
  }
};

module.exports = requireAuth;
