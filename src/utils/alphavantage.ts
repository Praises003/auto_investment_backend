// src/utils/alphavantage.ts
import axios from 'axios';

const API_KEY = process.env.ALPHA_API_KEY;

export const getStockPrice = async (symbol: string): Promise<number> => {
  if (!API_KEY) {
    throw new Error("Missing Alpha Vantage API key");
  }

  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;

  try {
    const response = await axios.get(url);
    const quote = response.data?.["Global Quote"];
    
    if (!quote || !quote["05. price"]) {
      console.error(`AlphaVantage error: No price found for ${symbol}`, response.data);
      throw new Error(`Price not found for symbol: ${symbol}`);
    }

    const price = parseFloat(quote["05. price"]);
    if (isNaN(price)) {
      throw new Error(`Invalid price format for ${symbol}`);
    }

    return price;
  } catch (error: any) {
    console.error(`Error fetching stock price for ${symbol}:`, error.message);
    throw new Error(`Failed to fetch stock price for ${symbol}`);
  }
};
