const express = require("express");
const cors = require('cors');
require('dotenv').config()
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const login = require("./routes/login")
const register = require("./routes/register")
const stock_add = require("./routes/stock_add")
const stock_remove = require("./routes/stock_remove")
const stocks = require("./routes/stocks")
const stocks_history = require("./routes/stocks_history")
const stock_purchases = require("./routes/stock_purchases")
const investments_history = require("./routes/investments_history")
const relative_change = require("./routes/relative_change")
const update = require("./routes/update")
const set_theme = require("./routes/set_theme")
const validate_username = require("./routes/validate_username")

const app = express();

const PORT = process.env.PORT || 4000;

app.use(cors());  //
app.use(express.json());
app.use(cookieParser());
// mongodb+srv://martvil96:mypassword@daily-portfolio-app.in35sv9.mongodb.net/?retryWrites=true&w=majority
// mongodb://localhost:27017/portfolio
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
app.use("/", relative_change);
app.use("/", update);
app.use("/", set_theme);
app.use("/", validate_username);


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  app.listen(PORT, () => {
    console.log(`Connected @ ${PORT}`);
  });
});