// src/utils/alphavantage.ts
import axios from 'axios';

const API_KEY = process.env.ALPHA_API_KEY;

export const getStockPrice = async (symbol: string) => {
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;

  const response = await axios.get(url);
  const price = parseFloat(response.data["Global Quote"]["05. price"]);

  return price;
};
