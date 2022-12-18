const Stocks = require("../models/stocks");
const fetch = require('node-fetch');
const getCurrentDate = require("./getCurrentDate");

const updateRelativeChange = async (username) => {
    // loop through all user's stocks and update prev close
    // calculate total net worth and push it to netWorthHistory
    // calculate relative change in net worth and push it to relativeChangeHistory

    const stocks = await Stocks.findOne({ username: username }).exec();

    const today = getCurrentDate();

    const totalNetWorth = stocks.netWorthHistory[stocks.netWorthHistory.length - 1].netWorth;
    const previousNetWorth = stocks.netWorthHistory[stocks.netWorthHistory.length - 2].netWorth;
    // relative change fraction compared to previous net worth
    const relativeChange = stocks.relativeChangeHistory[stocks.relativeChangeHistory.length - 1].relativeChange * (totalNetWorth / previousNetWorth);
    stocks.relativeChangeHistory.push({
        date: today,
        relativeChange: relativeChange
    })

    await stocks.save()

    console.log("updating relative change for user " + username);

    const response = "updating relative change for user " + username;
    return response;
}

module.exports = updateRelativeChange;