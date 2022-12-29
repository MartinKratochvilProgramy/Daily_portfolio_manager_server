interface PurchaseInterface {
    date: string,
    amount: number,
    currentPrice: number,
    totalAmount: number
}

export interface FormattedStockInterface {
    ticker: string;
    amount: number;
    prevClose: number;
    _id: string;
    firstPurchase: string;
    lastPurchase: string;
    purchaseHistory: PurchaseInterface[];
}

export interface StockInterface {
    ticker: string;
    amount: number;
    prevClose: number;
}

export interface PurchaseHistoryInterface {
    ticker: string;
    purchases: PurchaseInterface[];
}

export interface TotalInvestedHistoryInterface {
    date: string;
    total: number;
}

export interface StocksInterface {
    username: string;
    stocks: StockInterface[];
    purchaseHistory: PurchaseHistoryInterface[];
    netWorthHistory: {
        date: string;
        netWorth: number;
    }[];
    relativeChangeHistory: {
        date: string;
        relativeChange: number;
    }[];
    totalInvestedHistory: TotalInvestedHistoryInterface[];

}