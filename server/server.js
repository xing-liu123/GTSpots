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

app.post("/api/buildings/:id/comments", async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  try {
    await db
      .collection("buildings")
      .doc(id)
      .update({
        comments: admin.firestore.FieldValue.arrayUnion(comment),
      });
    res.status(201).json({ message: "Comment submitted successfully" });
  } catch (error) {
    console.error("Error submitting comment:", error);
    res.status(500).json({ error: "Error submitting comment" });
  }
});

app.put("/api/buildings/:id/votes", async (req, res) => {
  const { id } = req.params;
  const { userId, voteType } = req.body;
  try {
    const buildingRef = db.collection("buildings").doc(id);
    const buildingDoc = await buildingRef.get();

    if (buildingDoc.exists) {
      const buildingData = buildingDoc.data();
      const votes = buildingData.votes || {};

      if (votes[userId] === voteType) {
        // User has already voted with the same vote type, so remove the vote
        await buildingRef.update({
          [`votes.${userId}`]: admin.firestore.FieldValue.delete(),
          [voteType === "like" ? "likeCount" : "dislikeCount"]:
            admin.firestore.FieldValue.increment(-1),
        });
      } else {
        // User hasn't voted or has changed their vote type
        await buildingRef.update({
          [`votes.${userId}`]: voteType,
          [voteType === "like" ? "likeCount" : "dislikeCount"]:
            admin.firestore.FieldValue.increment(1),
          [voteType === "like" ? "dislikeCount" : "likeCount"]:
            admin.firestore.FieldValue.increment(votes[userId] ? -1 : 0),
        });
      }

      res.json({ message: "Vote updated successfully" });
    } else {
      res.status(404).json({ error: "Building not found" });
    }
  } catch (error) {
    console.error("Error updating vote:", error);
    res.status(500).json({ error: "Error updating vote" });
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
