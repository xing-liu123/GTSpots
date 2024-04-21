import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import moment from "moment";
import {
  doc,
  updateDoc,
  serverTimestamp,
  onSnapshot,
  increment,
} from "firebase/firestore";

import { auth, db } from "../../Config/firebase";

const statusOptions = ["Available", "Limited", "Full"];
const noiseLevelOptions = ["Quiet", "Moderate", "Loud"];
const wifiStabilityOptions = ["Strong", "Unstable", "Weak"];

export default function BuildingDetails({ route }) {
  const { building } = route.params;
  const [buildingData, setBuildingData] = useState(building);
  const [status, setStatus] = useState(building.status);
  const [noiseLevel, setNoiseLevel] = useState(building.noiseLevel || "Quiet");
  const [wifiStability, setWifiStability] = useState(
    building.wifiStability || "Strong"
  );
  const [monitor, setMonitor] = useState(building.monitor || false);
  const [socket, setSocket] = useState(building.socket || false);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(Date.now() / 1000);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteType, setVoteType] = useState(null);
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(true);

  const handleLike = async () => {
    const userId = auth.currentUser.uid;
    const buildingRef = doc(db, "buildings", building.id);

    if (voteType === "like") {
      // User has already liked, so remove the like
      await updateDoc(buildingRef, {
        likeCount: increment(-1),
        [`votes.${userId}`]: null,
      });
      setHasVoted(false);
      setVoteType(null);
    } else {
      // User hasn't liked or has disliked, so add/update the like
      const updates = {
        likeCount: increment(1),
        [`votes.${userId}`]: "like",
      };
      if (voteType === "dislike") {
        updates.dislikeCount = increment(-1);
      }
      await updateDoc(buildingRef, updates);
      setHasVoted(true);
      setVoteType("like");
    }
  };

  const handleDislike = async () => {
    const userId = auth.currentUser.uid;
    const buildingRef = doc(db, "buildings", building.id);

    if (voteType === "dislike") {
      // User has already disliked, so remove the dislike
      await updateDoc(buildingRef, {
        dislikeCount: increment(-1),
        [`votes.${userId}`]: null,
      });
      setHasVoted(false);
      setVoteType(null);
    } else {
      // User hasn't disliked or has liked, so add/update the dislike
      const updates = {
        dislikeCount: increment(1),
        [`votes.${userId}`]: "dislike",
      };
      if (voteType === "like") {
        updates.likeCount = increment(-1);
      }
      await updateDoc(buildingRef, updates);
      setHasVoted(true);
      setVoteType("dislike");
    }
  };

  const resetVotes = async () => {
    const buildingRef = doc(db, "buildings", building.id);
    await updateDoc(buildingRef, {
      likeCount: 0,
      dislikeCount: 0,
      votes: {},
    });
    setHasVoted(false);
    setVoteType(null);
  };

  useEffect(() => {
    const userId = auth.currentUser.uid;
    const buildingRef = doc(db, "buildings", building.id);
    const unsubscribe = onSnapshot(buildingRef, (doc) => {
      const updatedData = doc.data();
      setBuildingData(updatedData);
      setStatus(updatedData.status);
      setNoiseLevel(updatedData.noiseLevel);
      setWifiStability(updatedData.wifiStability);
      setMonitor(updatedData.monitor);
      setSocket(updatedData.socket);
      setLastUpdateTime(
        updatedData.lastUpdateTime ? updatedData.lastUpdateTime.toDate() : null
      );

      // Check if the user has already voted
      if (updatedData.votes && updatedData.votes[userId]) {
        setHasVoted(true);
        setVoteType(updatedData.votes[userId]);
      } else {
        setHasVoted(false);
        setVoteType(null);
      }
    });

    return () => unsubscribe();
  }, [building.id]);

  useEffect(() => {
    // Check if any fields have been modified (except likes/dislikes)
    const isModified =
      status !== buildingData.status ||
      noiseLevel !== buildingData.noiseLevel ||
      wifiStability !== buildingData.wifiStability ||
      monitor !== buildingData.monitor ||
      socket !== buildingData.socket;

    setIsUpdateDisabled(!isModified);
  }, [status, noiseLevel, wifiStability, monitor, socket, buildingData]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(Date.now() / 1000);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const getTimeDifference = () => {
    if (!lastUpdateTime) return null;

    const difference = currentTime - lastUpdateTime.getTime() / 1000;
    const duration = moment.duration(difference, "seconds");

    if (duration.asHours() >= 1) {
      return `${Math.floor(duration.asHours())} hours ago`;
    } else if (duration.asMinutes() >= 1) {
      return `${Math.floor(duration.asMinutes())} minutes ago`;
    } else {
      return "Just now";
    }
  };

  const handleUpdateStatus = async () => {
    const updatedBuilding = {
      status,
      noiseLevel,
      wifiStability,
      monitor,
      socket,
      lastUpdateTime: serverTimestamp(),
    };
    await updateDoc(doc(db, "buildings", building.id), updatedBuilding);
    Alert.alert("Success", "Updates successfully saved.");
    if (status !== buildingData.status) {
      resetVotes();
    }

    setIsUpdateDisabled(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: buildingData.imageUrl }}
        style={styles.buildingImage}
      />
      <Text style={styles.buildingName}>{buildingData.name}</Text>

      <View style={styles.optionContainer}>
        <Text style={styles.label}>Availability:</Text>
        <View style={styles.circleContainer}>
          {statusOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.circle,
                status === option ? styles.selectedCircle : null,
              ]}
              onPress={() => setStatus(option)}
            >
              <Text style={styles.circleText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.updateTime}>
          Last updated: {getTimeDifference()}
        </Text>
        <View style={styles.votingContainer}>
          <TouchableOpacity
            style={[
              styles.voteButton,
              voteType === "like" && styles.activeVoteButton,
            ]}
            onPress={handleLike}
          >
            <Text style={styles.voteButtonText}>
              👍 {buildingData.likeCount || 0}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.voteButton,
              voteType === "dislike" && styles.activeVoteButton,
            ]}
            onPress={handleDislike}
          >
            <Text style={styles.voteButtonText}>
              👎 {buildingData.dislikeCount || 0}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.optionContainer}>
        <Text style={styles.label}>Noise Level:</Text>
        <View style={styles.circleContainer}>
          {noiseLevelOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.circle,
                noiseLevel === option ? styles.selectedCircle : null,
              ]}
              onPress={() => setNoiseLevel(option)}
            >
              <Text style={styles.circleText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.optionContainer}>
        <Text style={styles.label}>WiFi Stability:</Text>
        <View style={styles.circleContainer}>
          {wifiStabilityOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.circle,
                wifiStability === option ? styles.selectedCircle : null,
              ]}
              onPress={() => setWifiStability(option)}
            >
              <Text style={styles.circleText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.facilityContainer}>
        <View style={styles.facilityOption}>
          <Text style={styles.facilityLabel}>Monitor</Text>
          <TouchableOpacity
            style={styles.facilityButton}
            onPress={() => setMonitor(!monitor)}
          >
            <Text style={styles.facilityButtonText}>{monitor ? "✓" : ""}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.facilityOption}>
          <Text style={styles.facilityLabel}>Socket</Text>
          <TouchableOpacity
            style={styles.facilityButton}
            onPress={() => setSocket(!socket)}
          >
            <Text style={styles.facilityButtonText}>{socket ? "✓" : ""}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.updateButton, isUpdateDisabled && styles.disabledButton]}
        onPress={handleUpdateStatus}
        disabled={isUpdateDisabled}
      >
        <Text style={styles.updateButtonText}>Update Status</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = {
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 24,
    alignItems: "center",
  },
  buildingImage: {
    width: 280,
    height: 190,
    borderRadius: 8,
    marginBottom: 16,
  },
  buildingName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  optionContainer: {
    marginBottom: 24,
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  circleContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "lightgray",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedCircle: {
    backgroundColor: "gray",
  },
  circleText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  facilityContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 24,
  },
  facilityOption: {
    alignItems: "center",
  },
  facilityLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  facilityButton: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  facilityButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  updateButton: {
    backgroundColor: "#007fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    width: 130,
    height: 45,
    justifyContent: "center",
  },
  updateButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  updateTime: {
    marginTop: 8,
    fontSize: 14,
    color: "gray",
  },
  votingContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  voteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  activeVoteButton: {
    backgroundColor: "#e0e0e0",
  },
  voteButtonText: {
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
};
