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

const updateStock = require("./functions/updateStocks")

const app = express();

app.use(cors()); // allow localhost 3000 (client) requests
app.use(express.json());

mongoose.connect("mongodb+srv://martvil96:mypassword@daily-portfolio-app.in35sv9.mongodb.net/?retryWrites=true&w=majority", {
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

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  app.listen(process.env.PORT || 4000, () => {
    console.log(`Connected`);
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

setInterval(function () {updateStocks()}, 24 * 3600 * 1000);