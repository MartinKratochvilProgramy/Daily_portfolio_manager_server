"use strict";
exports.__esModule = true;
exports.verifyToken = exports.createToken = void 0;
var jwt = require('jsonwebtoken');
var jwtSecret = process.env.JWT_SECRET || 'secretkey';
var createToken = function (payload) {
    return jwt.sign(payload, jwtSecret, { expiresIn: "10h" });
};
exports.createToken = createToken;
var verifyToken = function (token) {
    return jwt.verify(token, jwtSecret);
};
exports.verifyToken = verifyToken;
