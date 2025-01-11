import axios from "axios";
import { Coin } from "../model/coin.model.js";
import cron from "node-cron";

export const fetchStats = async (req, res, next) => {
  try {
    let { coin } = req.params;
    coin = coin.trim().toLowerCase();
    const stats = await Coin.find({ coin });

    if (stats.length == 0) {
      return res.status(404).send({ error: "Coin not found", success: false });
    }

    const data = [];
    stats.map(stat =>
      data.push({
        price: stat.curPrice,
        marketCap: stat.marketCap,
        price_change_24h: stat.priceChange_24hr,
      })
    );
    res.status(200).send({
      message: "Data stored successfully",
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).send({
      error: "Internal Server Error",
      success: false,
    });
  }
};

export const fetchStdDeviation = async (req, res) => {
  try {
    let { coin } = req.params;
    coin = coin.trim().toLowerCase();

    const result = await Coin.aggregate([
      // Match the specific coin by its 'coin' field
      { $match: { coin } },
      // Project only the last 100 entries of price_history
      { $project: { last100Prices: { $slice: ["$price_history", -100] } } },
      // Unwind the array to process each price individually
      { $unwind: "$last100Prices" },
      // Group and calculate the standard deviation
      {
        $group: {
          _id: "$coin", // Group by 'coin' name
          stdDev: { $stdDevPop: "$last100Prices" }, // Use $stdDevSamp if sample standard deviation is needed
          count: { $sum: 1 }, // To ensure sufficient data points
        },
      },
    ]);

    if (!result || result.length === 0) {
      return res
        .status(404)
        .json({ error: "Coin not found or no price history available." });
    }

    const { stdDev, count } = result[0];

    if (count === 0) {
      return res.status(400).json({
        error:
          "Insufficient price history data to calculate standard deviation.",
      });
    }

    return res.json({
      coin: coin,
      standardDeviation: stdDev,
      dataPoints: count,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

async function fetchDataAndUpdateDB(coin) {
  try {
    const { data } = await axios.get(`${process.env.coinServer}/${coin}`, {
      withCredentials: true,
    });
    const price = data.market_data.current_price.usd;
    const marketCap = data.market_data.market_cap.usd;
    const pc24h = data.market_data.price_change_24h_in_currency.usd;
    let updateCoin = await Coin.findOneAndUpdate(
      { coin },
      {
        curPrice: price,
        marketCap: marketCap,
        priceChange_24hr: pc24h,
        $push: { price_history: price },
      }
    );
  } catch (error) {
    console.log(error);
  }
}

cron.schedule("0 */2 * * *", () => fetchDataAndUpdateDB("bitcoin"));
cron.schedule("0 */2 * * *", () => fetchDataAndUpdateDB("matic-network"));
cron.schedule("0 */2 * * *", () => fetchDataAndUpdateDB("ethereum"));
