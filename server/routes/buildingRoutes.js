import express from "express";
import Building from "../models/building.js";

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

export default router;
