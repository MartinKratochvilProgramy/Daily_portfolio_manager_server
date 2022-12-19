const Stocks = require("../models/stocks");

async function stockRemove(
    username,
    ticker,
    newAmount
) {
    const stocks = await Stocks.findOne({ username: username }).exec();
    const currentAmount = stocks.stocks[stocks.stocks.findIndex((stocks => stocks.ticker === ticker))].amount;

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

    let newPurchaseHistory;
    if (newAmount <= 0) {
        newPurchaseHistory = stocks.purchaseHistory.filter((purchase) => purchase.ticker !== ticker);
    } else if (newAmount > 0) {
        const purchasesIndex = stocks.purchaseHistory.findIndex((purchase => purchase.ticker === ticker));
        newPurchaseHistory = stocks.purchaseHistory[purchasesIndex].purchases;

        const target = currentAmount - newAmount;
        let count = 0;
        const res = [];

        for (let i = 0; i < newPurchaseHistory.length; i++) {
            if (newPurchaseHistory[i].amount + count <= target) {
                count += newPurchaseHistory[i].amount;
            } else if (count < target && target < count + newPurchaseHistory[i].amount) {
                const newPurchase = newPurchaseHistory[i];
                newPurchase.amount = newPurchase.amount - (target - count);
                console.log(newPurchase);
                res.push(newPurchase);
                count += newPurchaseHistory[i].amount
            } else {
                res.push(newPurchaseHistory[i]);
            }
        }

        stocks.purchaseHistory[purchasesIndex].purchases = res;
    }

    stocks.stocks = newStocks;

    await stocks.save();
}

module.exports = stockRemove;