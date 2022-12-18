const express = require("express");
const app = express();
const User = require("../schemas/user")

const validate_user = app.post("/validate_user", async (req, res) => {
    // create user account, return 500 err if no password or username given
    let { username } = req.body;

    // find if user exists, if yes send 500 err
    const existingUser = await User.findOne({ username }).exec();
    console.log(existingUser);
    if (existingUser) {
        res.status(500);
        res.json({ message: 'User already exists' });
        return;
    }
    res.json({
        message: "Success",
    });
});

module.exports = validate_user;