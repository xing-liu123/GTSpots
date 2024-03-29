const express = require("express");
const admin = require("firebase-admin");
const serviceAccount = require("./Config/GTSpots-credentials.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(express.json());

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    const userCredential = await admin
      .auth()
      .signInWithEmailAndPassword(email, password);
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

app.get("/api/buildings", async (req, res) => {
  try {
    const snapshot = await db.collection("buildings").get();
    const buildings = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(buildings);
  } catch (error) {
    console.error("Error fetching buildings:", error);
    res.status(500).json({ error: "Error fetching buildings" });
  }
});

app.put("/api/buildings/:id", async (req, res) => {
  const { id } = req.params;
  const updatedBuilding = req.body;

  try {
    await db.collection("buildings").doc(id).update(updatedBuilding);
    const updatedBuildingDoc = await db.collection("buildings").doc(id).get();
    const updatedBuildingData = updatedBuildingDoc.data();
    res.json({ id: updatedBuildingDoc.id, ...updatedBuildingData });
  } catch (error) {
    console.error("Error updating building:", error);
    res.status(500).json({ error: "Error updating building" });
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
