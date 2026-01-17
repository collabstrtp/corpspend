import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import connectDB from "../db/db.js";

import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import companyRoutes from "./companyRoutes.js";
import expenseRoutes from "./expenseRoutes.js";
import categoryRoutes from "./categoryRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  cors({
    origin: "*",
  }),
);
app.use(express.json());

(async () => {
  try {
    await connectDB();
  } catch (e) {
    // Optional: log but don't crash the entire runtime in Vercel
    console.error("Failed to connect to DB at startup:", e.message);
  }
})();

app.get("/", (req, res) => {
  res.send("Welcome to CorpSpend Expense Management server");
});

app.use("/auth", authRoutes);
app.use("/company", companyRoutes);
app.use("/users", userRoutes);
app.use("/expenses", expenseRoutes);
app.use("/categories", categoryRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
