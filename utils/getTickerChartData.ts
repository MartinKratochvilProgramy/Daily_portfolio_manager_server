import { TickerChartData } from "../types/tickerChartData";
import { Period } from "../types/period";
const yahooFinance = require('yahoo-finance');

const numberOfMonths = {
    "6m": -6,
    "1y": -12,
    "2y": -24,
    "5y": -60
}

function addMonths(date: Date , period: Period) {
    date.setMonth(date.getMonth() + numberOfMonths[period]);
    return date;
}

export default async function getTickerChartData(
  ticker: string, 
  period: Period,
): Promise<TickerChartData> {

    const startDate = addMonths(new Date(), period);

    const tickerData: TickerChartData = await new Promise((res, rej) => {
        yahooFinance.historical({
        symbol: ticker,
        period: (period === "6m" || period === "1y") ? "d" : "w",
        from: startDate,
        to:  new Date(),
        }, function (err: any, quotes: any) {
        if (err) rej(err);

        const dates: string[] = [];
        const values: number[] = [];

        for (let i = 0; i < quotes.length; i++) {
            if (quotes[i].date !== null && quotes[i].open !== null) {
            dates.push(quotes[i].date.toISOString().split('T')[0]);
            values.push(quotes[i].open.toFixed(2))
            }
        }
        dates.reverse();
        values.reverse();
        res({ticker, dates, values})
        });
    })
    
    return tickerData;
}
