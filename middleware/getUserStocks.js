const Stocks = require("../models/stocks");

async function getUserStocks(username) {
    // returns array of formatter user stocks
    // [{ticker, amount, prevClose, _id, firstPurchase, lastPurchase}]

    const foundStocks = await Stocks.findOne({ username: username }).exec();

    if (foundStocks) {
        const stocks = foundStocks.stocks;
        const purchaseHistory = foundStocks.purchaseHistory;

        const result = [];

        for (let i = 0; i < stocks.length; i++) {
            // construct array of stock objects {ticker, amount, prevClose, _id, firstPurchase, lastPurchase}
            const stockObject = {};
            stockObject.ticker = stocks[i].ticker;
            stockObject.amount = stocks[i].amount;
            stockObject.prevClose = stocks[i].prevClose;
            stockObject._id = stocks[i]._id;

            const ticker = stockObject.ticker;
            const index = purchaseHistory.findIndex(stock => stock.ticker === ticker);  // index of ticker in purchaseHistory

            stockObject.firstPurchase = purchaseHistory[index].purchases[0].date;                                          // first known purchase history
            stockObject.lastPurchase = purchaseHistory[index].purchases[purchaseHistory[index].purchases.length - 1].date; // last known purchase history
            stockObject.purchaseHistory = purchaseHistory[index].purchases;

            result.push(stockObject)
        }

        return result;

    } else {
        return null;
    }

}

module.exports = getUserStocks;