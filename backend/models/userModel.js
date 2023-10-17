const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    require: true,
    unique: true, //prevents duplication from mongoose
  },
  password: {
    type: String,
    require: true,
  },
});

//static signup method
userSchema.statics.signup = async function (email, password) {
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

module.exports = mongoose.model("User", userSchema);
