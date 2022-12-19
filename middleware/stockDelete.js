const Stocks = require("../models/stocks");

async function stockDelete(
    username,
    ticker,
    newAmount
) {
    const stocks = await Stocks.findOne({ username: username }).exec();
    if (!stocks) {
        res.status(403);
        res.json({
            message: "invalid access",
        });
        return;
    }

    let newStocks;
    if (newAmount === 0) {
        newStocks = stocks.stocks.filter((stock) => stock.ticker !== ticker);
    } else if (newAmount > 0) {
        newStocks = stocks.stocks;
        const objIndex = stocks.stocks.findIndex((stocks => stocks.ticker === ticker));
        newStocks[objIndex].amount = newAmount;
    }

    stocks.stocks = newStocks;

    await stocks.save();
    // update net worth
}

module.exports = stockDelete;