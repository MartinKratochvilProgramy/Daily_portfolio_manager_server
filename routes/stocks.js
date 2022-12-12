const express = require("express");
const app = express();
const User = require("../schemas/user")
const getUserStocks = require("../functions/getUserStocks");

const stocks = app.get("/stocks", async (req, res) => {
    // send stocks to client
    const { authorization } = req.headers;

    // get username password from headers
    const [, token] = authorization.split(" ");
    const [username, password] = token.split(":");
    // auth user, if not found send back 403 err
    const user = await User.findOne({ username }).exec();
    if (!user || user.password !== password) {
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