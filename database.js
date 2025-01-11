import mongoose from "mongoose";
import { config } from "dotenv";
config({
  path: ".env",
});
export const connectDB = mongoose
  .connect(process.env.MONGOURL, {
    dbName: "KoinX",
  })
  .then(c => console.log(`Database connected ${c.connection.host}`))
  .catch(e => console.error(e));
