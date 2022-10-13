const express = require("express");
const app = express();
const User = require("../schemas/user")
const Stocks = require("../schemas/stocks")
const updateStock = require("../functions/updateStocks")

const stock_remove = app.post("/stock_remove", async (req, res) => {
    // remove stock from db
    const { authorization } = req.headers;
    const stockItems = req.body.newStocks;
  
    // get username password from headers
    const [, token] = authorization.split(" ");
    const [username, password] = token.split(":");
    // auth user, if not found send back 403 err
    const user = await User.findOne({ username }).exec();
    if (!user || user.password !== password) {
      res.status(403);
      res.json({
        message: "invalid access",
      });
      return;
    } 
  
    const stocks = await Stocks.findOne({ username: username }).exec();
    if (!stocks) {
      res.status(403);
      res.json({
        message: "invalid access",
      });
      return;
    }
  
    // save new array of stocks into db
    stocks.stocks = stockItems;
    await stocks.save();
  
    // update net worth history
    await updateStock(username);
    
    res.json({
      message: "Saved to database succesful"
      }
    )
  });

  module.exports = stock_remove;