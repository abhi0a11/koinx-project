import express from "express";
import { config } from "dotenv";
import { connectDB } from "./database.js";
import coinRouter from "./src/routes/coin.route.js";
import axios from "axios";
import cron from "node-cron";
// configure env file
config({
  path: ".env",
});

// create server
const app = express();

// connect server with database
connectDB;

// uses json with express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// create routes
app.use("/coin", coinRouter);

// to keep server alive
app.get("/ping", (req, res) => res.status(200).send("server is alive!"));
cron.schedule("*/14 * * * *", async (req, res) => {
  try {
    await axios.get(`${process.env.server}/ping`);
  } catch (error) {
    res.send("Error");
  }
});

app.listen(process.env.PORT, () => {
  console.log(`server is running on port ${process.env.PORT}`);
});
