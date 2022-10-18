const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const updateStocks = require("../functions/updateStocks");
const updateRelativeChange = require("../functions/updateRelativeChange");
const Stocks = require("../schemas/stocks")

const update = app.post("/update", async (req, res) => {
  
    const { input } = req.body;

    let response = [];

    // const passwordIsValid = await bcrypt.compare(password, user.password);

    // const today = new Date();
    // if(today.getDay() !== 6 && today.getDay() !== 0) { 
    //   // only run on weekdays
    //   const allStocks = await Stocks.find();
    //   for (let i = 0; i < allStocks.length; i++) {
    //     // await updateStocks(allStocks[i].username);
    //     // await updateRelativeChange(allStocks[i].username);
    //     const stocksResponse = await updateStocks(allStocks[i].username);
    //     response.push(stocksResponse);
    //     const relativeChangeResponse = await updateRelativeChange(allStocks[i].username);
    //     response.push(relativeChangeResponse);
    //   }
    //   response.push("-------------------");
    // }

    const salt = process.env.SECRET || "no process.env.SECRET found";

    res.json({
      message: "Success",
      input: input,
      response: response,
      salt: salt
    });

    //res.send({ title: 'GeeksforGeeks' });
  });

  module.exports = update;