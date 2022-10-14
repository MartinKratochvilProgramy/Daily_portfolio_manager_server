const express = require("express");
const cors = require('cors');
require('dotenv').config()

const mongoose = require('mongoose');
const Stocks = require("./schemas/stocks")

const login = require("./routes/login")
const register = require("./routes/register")
const stock_add = require("./routes/stock_add")
const stock_remove = require("./routes/stock_remove")
const stocks = require("./routes/stocks")
const stocks_history = require("./routes/stocks_history")
const stock_purchases = require("./routes/stock_purchases")
const investments_history = require("./routes/investments_history")
const relative_change = require("./routes/relative_change")

const updateStock = require("./functions/updateStocks")

const app = express();

const PORT = process.env.PORT || 4000;

app.use(cors()); // allow localhost 3000 (client) requests
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/portfolio", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});


app.use("/", login);
app.use("/", register);
app.use("/", stock_add);
app.use("/", stock_remove);
app.use("/", stocks);
app.use("/", stocks_history);
app.use("/", stock_purchases);
app.use("/", investments_history);
app.use("/", relative_change);


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  app.listen(PORT, () => {
    console.log(`Connected @ ${PORT}`);
  });
});


async function updateStocks () {
  // loops through all user accounts and updates prev close
  // prices for each stocks
  // function should run every weekday
  const allStocks = await Stocks.find();
  for (let i = 0; i < allStocks.length; i++) {
    updateStock(allStocks[i].username);
  }
  console.log("-------------------");
}

setInterval(function () {updateStocks()}, 1 * 20000 * 1000);