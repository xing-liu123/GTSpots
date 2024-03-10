const express = require("express");
const path = require("path");
const Building = require("../models/building");

const router = express.Router();

// GET all buildings
router.get("/", async (req, res) => {
  try {
    const buildings = await Building.find();
    res.json(buildings);
  } catch (err) {
    res.status(500).json({ error: "Error retrieving buildings" });
  }
});

router.get("/images/:filename", (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(__dirname, "../images", filename);
  res.sendFile(imagePath);
});

// POST a new building
router.post("/", async (req, res) => {
  try {
    const building = new Building(req.body);
    await building.save();
    res.status(201).json(building);
  } catch (err) {
    res.status(500).json({ error: "Error creating building" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedBuilding = await Building.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedBuilding) {
      return res.status(404).json({ error: "Building not found" });
    }
    res.json(updatedBuilding);
  } catch (err) {
    res.status(500).json({ error: "Error updating building" });
  }
});

module.exports = router;

