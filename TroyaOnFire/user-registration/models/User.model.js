const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    username: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    region: {
      type: String,
    },
    sessionToken: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
  },
  { collection: "users" }
);

const User = mongoose.model("user", UserSchema);
module.exports = User;
