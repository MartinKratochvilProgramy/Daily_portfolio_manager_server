import { Request, Response } from 'express';
import { getCurrentDate } from "../utils/getCurrentDate";
const User = require("../models/user")
const Stocks = require("../models/stocks")
const { verifyToken } = require("../utils/jwt");

interface FormattedRelativeChangeHistory {
  date: string;
  relativeChange: number;
}

export const relative_change = async (req: Request, res: Response) => {
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

  try {
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

    if (foundInvestments.relativeChangeHistory.length > 0) {
      // user has some history
      const relativeChangeHistory = foundInvestments.relativeChangeHistory;
      const formattedRelativeChangeHistory: FormattedRelativeChangeHistory[] = [];
      // strip _id propety from stocks
      for (let i = 0; i < relativeChangeHistory.length; i++) {
        formattedRelativeChangeHistory.push({
          date: relativeChangeHistory[i].date,
          relativeChange: relativeChangeHistory[i].relativeChange
        })
      }

      res.json(formattedRelativeChangeHistory);

    } else if (foundInvestments.relativeChangeHistory.length === 0) {
      // user history is empty
      res.json([{
        date: getCurrentDate(),
        relativeChange: 1,
      }])

    } else {

      res.status(404);
      res.json({
        message: "Relative change not found",
      });
    }
  } catch (error) {
    console.log(error);
  }
};