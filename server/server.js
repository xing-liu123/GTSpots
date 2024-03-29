const express = require("express");
const mongoose = require("mongoose");
const buildingRoutes = require("./routes/buildingRoutes");
const admin = require("firebase-admin");
const serviceAccount = require("./Config/GTSpots-credentials.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

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

  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      const userRecord = await admin.auth().getUserByEmail(email);
      const userCredential = await admin.auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      res.json({ user });
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        try {
          const userRecord = await admin.auth().createUser({ email, password });
          res.json({ user: userRecord });
        } catch (createError) {
          console.error("Error creating user:", createError);
          res.status(500).json({ error: "Error creating user" });
        }
      } else {
        console.error("Error during login:", error);
        res.status(401).json({ error: "Invalid credentials" });
      }
    }
  });

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to Campus Study Spots API");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
