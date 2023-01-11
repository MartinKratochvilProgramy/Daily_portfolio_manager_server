import {
  investments_history,
  login,
  register,
  relative_change,
  set_theme,
  stock_add,
  stock_remove,
  stocks_history,
  stocks,
  update,
  validate_username,
  ticker_chart
} from './middleware';
const express = require("express");
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config()

export const app = express();

const PORT = process.env.PORT || 4000;
const DATABASE_ROUTE = process.env.DATABASE_ROUTE;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/investments_history", investments_history);
app.post("/login", login);
app.post("/register", register);
app.get("/relative_change", relative_change);
app.post("/set_theme", set_theme);
app.post("/stock_add", stock_add);
app.post("/stock_remove", stock_remove);
app.get("/stocks_history", stocks_history);
app.get("/stocks", stocks);
app.post("/update", update);
app.post("/validate_username", validate_username);
app.post("/ticker_chart", ticker_chart);

mongoose.connect(DATABASE_ROUTE, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  app.listen(PORT, () => {
    console.log(`Connected @ ${PORT}`);
  });
});