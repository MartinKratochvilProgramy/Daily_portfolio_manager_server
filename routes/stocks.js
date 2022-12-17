const express = require("express");
const app = express();
const User = require("../schemas/user")
const getUserStocks = require("../utils/getUserStocks");
const { verifyToken } = require("../utils/jwt");

const stocks = app.get("/stocks", async (req, res) => {
  // send stocks to client
  const { authorization } = req.headers;

  // get username password from headers
  const [, auth] = authorization.split(" ");
  const [username, token] = auth.split(":");
  // auth user, if not found send back 403 err
  const decoded = verifyToken(token);
  const user = await User.findById(decoded.id).exec();

  if (!user) {
    res.status(403);
    res.json({
      message: "Invalid access",
    });
    return;
  }
  const foundStocks = await getUserStocks(username);
  if (foundStocks) {
    res.json(foundStocks);

  } else {

    res.status(404);
    res.json({
      message: "Stocks not found",
    });
  }
});

module.exports = stocks;