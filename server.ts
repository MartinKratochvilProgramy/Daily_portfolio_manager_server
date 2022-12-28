const express = require("express");
const cors = require('cors');
require('dotenv').config()
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

import { investments_history } from "./middleware/investments_history";
import { login } from "./middleware/login";
import { register } from "./middleware/register";
import { relative_change } from "./middleware/relative_change";
import { set_theme } from "./middleware/set_theme";
import { stock_add } from "./middleware/stock_add";
import { stock_remove } from "./middleware/stock_remove";
import { stocks_history } from "./middleware/stocks_history";
import { stocks } from "./middleware/stocks";
import { update } from "./middleware/update";
import { validate_username } from "./middleware/validate_username";

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