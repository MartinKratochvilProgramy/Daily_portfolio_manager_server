"use strict";
exports.__esModule = true;
exports.app = void 0;
var middleware_1 = require("./middleware");
var express = require("express");
var cors = require('cors');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
require('dotenv').config();
exports.app = express();
var PORT = process.env.PORT || 4000;
var DATABASE_ROUTE = process.env.DATABASE_ROUTE;
exports.app.use(cors());
exports.app.use(express.json());
exports.app.use(cookieParser());
exports.app.get("/investments_history", middleware_1.investments_history);
exports.app.post("/login", middleware_1.login);
exports.app.post("/register", middleware_1.register);
exports.app.get("/relative_change", middleware_1.relative_change);
exports.app.post("/set_theme", middleware_1.set_theme);
exports.app.post("/stock_add", middleware_1.stock_add);
exports.app.post("/stock_remove", middleware_1.stock_remove);
exports.app.get("/stocks_history", middleware_1.stocks_history);
exports.app.get("/stocks", middleware_1.stocks);
exports.app.post("/update", middleware_1.update);
exports.app.post("/validate_username", middleware_1.validate_username);
exports.app.post("/ticker_chart", middleware_1.ticker_chart);
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
