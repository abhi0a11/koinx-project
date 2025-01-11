import axios from "axios";
import { Coin } from "../model/coin.model.js";
import cron from "node-cron";

// API to fetch the stats from DB
export const fetchStats = async (req, res, next) => {
  try {
    let { coin } = req.params; // extract coin name from parameter
    coin = coin.trim().toLowerCase(); // normalise text
    const stats = await Coin.findOne({ coin }); // searcch in db

    if (!stats) {
      // if coin is not present in database
      return res.status(404).send({
        error: "Coin not found",
        success: false,
      });
    }

    // send response
    res.status(200).send({
      message: "Data fetched successfully",
      data: {
        price: stats.curPrice,
        marketCap: stats.marketCap,
        price_change_24h: stats.priceChange_24hr,
      },
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "Internal Server Error",
      success: false,
    });
  }
};

//  API for standard deviation calculation of latest 100 records
export const fetchStdDeviation = async (req, res) => {
  try {
    let { coin } = req.params; // extract coin name from parameter
    coin = coin.trim().toLowerCase(); // normalise text

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
          stdDev: { $stdDevPop: "$last100Prices" },
          count: { $sum: 1 }, // To ensure sufficient data points
        },
      },
    ]);

    // if coin is not found or array is empty
    if (!result || result.length === 0) {
      return res
        .status(404)
        .json({ error: "Coin not found or no price history available." });
    }

    const { stdDev, count } = result[0];

    // if there are not sufficient entries in the array to calculate std deviation
    if (count === 0) {
      return res.status(400).json({
        error:
          "Insufficient price history data to calculate standard deviation.",
      });
    }

    //  send response
    return res.json({
      coin: coin,
      standardDeviation: stdDev,
      dataPoints: count,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

//  function to fetch coin data every 2 hour.
async function fetchDataAndUpdateDB(coin) {
  try {
    // fetch data from coingecko api endpoint
    const { data } = await axios.get(`${process.env.coinServer}/${coin}`, {
      withCredentials: true,
    });
    const price = data.market_data.current_price.usd;
    const marketCap = data.market_data.market_cap.usd;
    const pc24h = data.market_data.price_change_24h_in_currency.usd;

    // update the database with latest proce
    let updateCoin = await Coin.findOneAndUpdate(
      { coin },
      {
        curPrice: price,
        marketCap: marketCap,
        priceChange_24hr: pc24h,
        $push: { price_history: price }, // push value in the array at end
      }
    );
  } catch (error) {
    console.log(error);
  }
}

//  calls function every 2 hours
cron.schedule("0 */2 * * *", () => fetchDataAndUpdateDB("bitcoin"));
cron.schedule("0 */2 * * *", () => fetchDataAndUpdateDB("matic-network"));
cron.schedule("0 */2 * * *", () => fetchDataAndUpdateDB("ethereum"));
