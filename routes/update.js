const express = require("express");
const app = express();
const getCurrentDate = require("../utils/getCurrentDate");
const updateStocks = require("../utils/updateStocks");
const updateRelativeChange = require("../utils/updateRelativeChange");
const Stocks = require("../models/stocks");

const update = app.post("/update", async (req, res) => {
  // after auth run through all user's stocks and update current price,
  // net worth and relative change
  const { password } = req.headers;

  if (password !== process.env.SECRET) {
    res.status(403);
    res.json({
      message: "Failed, wrong credentials"
    })
    return;
  }

  let response = [];

  const today = new Date();
  response.push(`Updating stock info at day ${getCurrentDate()}`);
  if (today.getDay() !== 6 && today.getDay() !== 0) {
    // only run on weekdays
    const allUsers = await Stocks.find();
    for (let i = 0; i < allUsers.length; i++) {
      // loop through all users and update stock info
      // updateStocks and updateRelativeChange returns response
      // response is saved in response = [] and sent to client
      try {
        const stocksResponse = await updateStocks(allUsers[i].username);
        response.push(stocksResponse);
        const relativeChangeResponse = await updateRelativeChange(allUsers[i].username);
        response.push(relativeChangeResponse);
      } catch (error) {
        response.push(`ERROR: ${error} USER: ${allUsers[i].username}`)
      }
    }
    response.push("-------------------");
  }

  res.json({
    message: "Success",
    response: response,
  });

});

module.exports = update;