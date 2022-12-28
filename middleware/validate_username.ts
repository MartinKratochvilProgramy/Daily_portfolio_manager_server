import { Request, Response } from 'express';
const User = require("../models/user")

export const validate_username = async (req: Request, res: Response) => {
    // create user account, return 500 err if no password or username given
    let { username } = req.body;

    // find if user exists, if yes send 500 err
    const existingUser = await User.findOne({ username }).exec();
    if (existingUser) {
        res.status(500);
        res.json({ message: 'User already exists' });
        return;
    }
    res.json({
        message: "Success",
    });
};