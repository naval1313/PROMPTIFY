import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/AuthRoute.js";

const app = express();
const PORT = process.env.PORT || 8080;

//to parse incoming request from frontend client
app.use(express.json());
app.use(cors());

//merging rotes here, jese hi "/api" pe koi req aye chatRoutes pe jao, upr chatRouite import he.
app.use("/api", chatRoutes);
app.use("/api/auth", authRoutes);

//connecting to DB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("DB Connected Successfully!");
  } catch (error) {
    console.log("Failed to Connect with DB", error);
  }
};

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();