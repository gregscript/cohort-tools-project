const mongoose = require("mongoose");
const {Schema, model} = mongoose;

const userModel = new Schema (
  {
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    name: {type: String, required: true}
  }
)

const User = model("User", userModel);

module.exports = User;