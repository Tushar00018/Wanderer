const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passporttLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
});

//GENERATED THE RANDOM USERNAME AND PASSWORD FOR AUTHENTICATION
userSchema.plugin(passporttLocalMongoose);

module.exports = mongoose.model("user", userSchema);
