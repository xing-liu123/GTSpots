const mongoose = require("mongoose");

const buildingSchema = new mongoose.Schema({
  name: String,
  description: String,
  status: String,
  noiseLevel: String,
  wifiStability: String,
  monitor: Boolean,
  socket: Boolean,
  imageUrl: String,
});

const Building = mongoose.model("Building", buildingSchema);

module.exports = Building;

