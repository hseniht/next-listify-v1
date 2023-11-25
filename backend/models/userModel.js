const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true, //prevents duplication from mongoose
  },
  password: {
    type: String,
    required: true,
  },
});

//static signup method
userSchema.statics.signup = async function (email, password) {
  // validation
  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  //if email not valid
  if (!validator.isEmail(email)) {
    throw Error("Email is not valid");
  }

  if (!validator.isStrongPassword(password)) {
    throw Error("Password is not strong enough");
  }

  // Some Note: When you use `this` within a method of an object, it refers to the object itself.
  // so `this` keyword refers to the model. In this case : "User"
  const exist = await this.findOne({ email });

  if (exist) {
    throw Error("Email already in use");
  }
  //salt - random characters string that is added to a user's password before hash
  const salt = await bcrypt.genSalt(10); //this will take time. Higher value, the longer it takes
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, password: hash });

  return user;
};

// static login method
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }
  // find user
  const user = await this.findOne({ email });

  if (!user) {
    // for login, this means email not found in db, so its incorrectly type
    throw Error("Incorrect email");
  }

  const hashedPassword = user.password;

  const match = await bcrypt.compare(password, hashedPassword);

  if (!match) {
    throw Error("Incorrect password");
  }

  // if everything is success, then only send back user
  return user;
};

module.exports = mongoose.model("User", userSchema);
