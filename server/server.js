import express from "express";
import mongoose from "mongoose";
import buildingRoutes from "./routes/buildingRoutes.js";

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use("/api/buildings", buildingRoutes);

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/GTSpots?directConnection=true")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB", err));

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to Campus Study Spots API");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
