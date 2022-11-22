const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    settings: {
      theme: String,
      currency: String
    }
  })
const User = mongoose.model("User", userSchema);
  


module.exports = User;