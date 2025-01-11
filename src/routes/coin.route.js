import express from "express";
import {
  fetchStats,
  fetchStdDeviation,
} from "../controller/coin.controller.js";

// ecpress router
const router = express.Router();

router.get("/:coin/stats", fetchStats);
router.get("/:coin/deviation", fetchStdDeviation);
export default router;
