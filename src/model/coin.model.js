import mongoose from "mongoose";

const coinSchema = mongoose.Schema(
  {
    coin: {
      type: String,
      required: true,
    },
    curPrice: {
      type: Number,
      required: true,
    },
    marketCap: {
      type: Number,
      required: true,
    },
    priceChange_24hr: {
      type: Number,
      required: true,
    },
    price_history: {
      type: [Number],
    },
  },
  {
    collection: "coins",
    timestamps: true,
  }
);

export const Coin = mongoose.model("Coin", coinSchema);
