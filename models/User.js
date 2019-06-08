const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Schema } = mongoose;

const User = new Schema(
  {
    name: String,
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    }
  },
  {
    timestamps: true
  }
);

User.methods.genHash = password => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

User.methods.validatePass = (password, passInDb) => {
  return bcrypt.compareSync(password, passInDb);
};

module.exports = mongoose.model("User", User);
