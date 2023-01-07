import { Request, Response } from 'express';
import { getCurrentDate } from "../utils/getCurrentDate";
import { updateStocks } from "../utils/updateStocks";
import { updateRelativeChange } from "../utils/updateRelativeChange";
import { Stocks } from '../models/stocks';

export default async function update(req: Request, res: Response) {
  // after auth run through all user's stocks and update current price,
  // net worth and relative change
  const { password } = req.headers;

  if (password !== process.env.SECRET) {
    res.status(403);
    res.json({
      message: "Failed, wrong credentials"
    })
    return;
  }

  let output: string[] = [];

  const today = new Date();
  output.push(`Updating stock info at day ${getCurrentDate()}`);
  if (today.getDay() !== 6 && today.getDay() !== 0) {
    // only run on weekdays
    const allUsers = await Stocks.find();
    for (let i = 0; i < allUsers.length; i++) {
      // loop through all users and update stock info
      // updateStocks and updateRelativeChange returns output
      // output is saved in output = [] and sent to client
      try {
        const stocksoutput = await updateStocks(allUsers[i].username);
        output.push(stocksoutput);
        const relativeChangeoutput = await updateRelativeChange(allUsers[i].username);
        output.push(relativeChangeoutput);
      } catch (error) {
        output.push(`ERROR: ${error} USER: ${allUsers[i].username}`)
      }
    }
    output.push("-------------------");
  }

  res.json({
    message: "Success",
    output: output,
  });

};