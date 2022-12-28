const jwt = require('jsonwebtoken')

const jwtSecret = process.env.JWT_SECRET || 'secretkey'

export const createToken = (payload: string) => {
  return jwt.sign(payload, jwtSecret, { expiresIn: "10h" });
}

export const verifyToken = (token: string) => {
  return jwt.verify(token, jwtSecret);
}