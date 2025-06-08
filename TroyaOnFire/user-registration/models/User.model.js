const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
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
    workingStatus:{
      type: String,
      required: true,
    },
    region: {
      type: String,
      required: true,
    }
  },
  { timestamps: true, collection: 'users' } // Specify collection name
);

const User = mongoose.model("user", UserSchema);
module.exports = User;