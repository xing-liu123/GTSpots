const mongoose = require("mongoose");
const Building = require("./models/building");

const buildings = [
  {
    name: "Clough Undergraduate Learning Commons",
    status: "Available",
    imageUrl: "clough.jpeg",
    noiseLevel: "Quiet",
    wifiStability: "Strong",
    monitor: false,
    socket: false,
  },
  {
    name: "Price Gilbert Memorial Library",
    status: "Available",
    imageUrl: "price-gilbert.jpeg",
    noiseLevel: "Quiet",
    wifiStability: "Strong",
    monitor: false,
    socket: false,
  },
  {
    name: "Crossland Tower",
    status: "Available",
    imageUrl: "crossland-tower.jpeg",
    noiseLevel: "Quiet",
    wifiStability: "Strong",
    monitor: false,
    socket: false,
  },
  {
    name: "Klaus Advanced Computing Building",
    status: "Available",
    imageUrl: "klaus-building.jpeg",
    noiseLevel: "Quiet",
    wifiStability: "Strong",
    monitor: false,
    socket: false,
  },
];

mongoose
  .connect("mongodb://localhost:27017/GTSpots?directConnection=true")
  .then(() => {
    console.log("Connected to MongoDB");

    Building.insertMany(buildings)
      .then(() => {
        console.log("Data seeded successfully");
        mongoose.connection.close();
      })
      .catch((error) => {
        console.error("Error seeding data:", error);
        mongoose.connection.close();
      });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });