"use strict";
exports.__esModule = true;
exports.User = void 0;
var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    settings: {
        theme: String,
        currency: String
    }
});
exports.User = mongoose.model("User", userSchema);
