import { Request, Response } from 'express';
const User = require("../models/user")
const Stocks = require("../models/stocks");
const { verifyToken } = require("../utils/jwt");

interface InvestmentHistory {
  date: string;
  total: number;
}

export const investments_history = async (req: Request, res: Response) => {
  // send invested amounts to client
  const { authorization } = req.headers;

  if (!authorization) {
    res.json({
      message: "Invalid header"
    })
    return;
  }

  // get username password from headers
  const [, auth] = authorization.split(" ");
  const [username, token] = auth.split(":");
  // auth user, if not found send back 403 err
  const decoded = verifyToken(token);
  const user = await User.findById(decoded.id).exec();

  if (!user) {
    res.status(403);
    res.json({
      message: "Invalid access",
    });
    return;
  }
  const foundInvestments = await Stocks.findOne({ username: username }).exec();
  if (foundInvestments) {
    const investments = foundInvestments.totalInvestedHistory;
    // create array of res objects -> this is to remove the _id property from value returned 
    // by MongoDB
    const investmentHistory: InvestmentHistory[] = [];
    for (const investment of investments) {
      investmentHistory.push({
        date: investment.date,
        total: investment.total
      })
    }
    res.json(investmentHistory);
  } else {

    res.status(404);
    res.json({
      message: "Stocks not found",
    });
  }
};