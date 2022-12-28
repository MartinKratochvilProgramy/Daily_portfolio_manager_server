"use strict";
exports.__esModule = true;
exports.app = void 0;
var express = require("express");
var cors = require('cors');
require('dotenv').config();
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var investments_history_1 = require("./middleware/investments_history");
var login_1 = require("./middleware/login");
var register_1 = require("./middleware/register");
var relative_change_1 = require("./middleware/relative_change");
var set_theme_1 = require("./middleware/set_theme");
var stock_add_1 = require("./middleware/stock_add");
var stock_remove_1 = require("./middleware/stock_remove");
var stocks_history_1 = require("./middleware/stocks_history");
var stocks_1 = require("./middleware/stocks");
var update_1 = require("./middleware/update");
var validate_username_1 = require("./middleware/validate_username");
exports.app = express();
var PORT = process.env.PORT || 4000;
var DATABASE_ROUTE = process.env.DATABASE_ROUTE;
exports.app.use(cors());
exports.app.use(express.json());
exports.app.use(cookieParser());
exports.app.get("/investments_history", investments_history_1.investments_history);
exports.app.post("/login", login_1.login);
exports.app.post("/register", register_1.register);
exports.app.get("/relative_change", relative_change_1.relative_change);
exports.app.post("/set_theme", set_theme_1.set_theme);
exports.app.post("/stock_add", stock_add_1.stock_add);
exports.app.post("/stock_remove", stock_remove_1.stock_remove);
exports.app.get("/stocks_history", stocks_history_1.stocks_history);
exports.app.get("/stocks", stocks_1.stocks);
exports.app.post("/update", update_1.update);
exports.app.post("/validate_username", validate_username_1.validate_username);
mongoose.connect(DATABASE_ROUTE, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    exports.app.listen(PORT, function () {
        console.log("Connected @ ".concat(PORT));
    });
});
