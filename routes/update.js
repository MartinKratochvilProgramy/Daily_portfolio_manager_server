const express = require("express");
const app = express();
const getCurrentDate = require("../functions/getCurrentDate");
const updateStocks = require("../functions/updateStocks");
const updateRelativeChange = require("../functions/updateRelativeChange");
const Stocks = require("../schemas/stocks")

const update = app.post("/update", async (req, res) => {
  
    const { password } = req.body;

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
    if(today.getDay() !== 6 && today.getDay() !== 0) { 
      // only run on weekdays
      const allStocks = await Stocks.find();
      for (let i = 0; i < allStocks.length; i++) {
        try {
          const stocksResponse = await updateStocks(allStocks[i].username);
          response.push(stocksResponse);
          const relativeChangeResponse = await updateRelativeChange(allStocks[i].username);
          response.push(relativeChangeResponse);
        } catch (error) {
          response.push(`ERROR: ${error} USER: ${allStocks[i].username}`)
        }
      }
      response.push("-------------------");
    }

    res.json({
      message: "Success",
      response: response,
    });

    //res.send({ title: 'GeeksforGeeks' });
  });

  module.exports = update;