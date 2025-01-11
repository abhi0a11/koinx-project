import express from "express";
import { config } from "dotenv";
import { connectDB } from "./database.js";
import coinRouter from "./src/routes/coin.route.js";
config({
  path: ".env",
});
const app = express();

connectDB;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/coin", coinRouter);

app.listen(process.env.PORT, () => {
  console.log(`server is running on port ${process.env.PORT}`);
});
