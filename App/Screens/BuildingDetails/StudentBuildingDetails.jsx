import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import moment from "moment";
import {
  doc,
  updateDoc,
  serverTimestamp,
  onSnapshot,
  increment,
  getDoc,
  arrayUnion,
} from "firebase/firestore";
import { auth, db } from "../../Config/firebase";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const noiseLevelOptions = ["Quiet", "Moderate", "Loud"];
const wifiStabilityOptions = ["Strong", "Unstable", "Weak"];

export default function BuildingDetails({ route }) {
  const { building } = route.params;
  const [buildingData, setBuildingData] = useState(building);
  const [occupancyLevel, setOccupancyLevel] = useState(
    building.occupancyLevel || 0
  );
  const [noiseLevel, setNoiseLevel] = useState(building.noiseLevel || "Quiet");
  const [wifiStability, setWifiStability] = useState(
    building.wifiStability || "Strong"
  );
  const [monitor, setMonitor] = useState(building.monitor || false);
  const [socket, setSocket] = useState(building.socket || false);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(Date.now() / 1000);
  const [hasVoted, setHasVoted] = useState(false);
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(true);
  const [comment, setComment] = useState("");

  const handleVote = async (voteType) => {
    if (hasVoted) return;

    const userId = auth.currentUser.uid;
    const buildingRef = doc(db, "buildings", building.id);

    await updateDoc(buildingRef, {
      [voteType === "like" ? "likeCount" : "dislikeCount"]: increment(1),
      [`votes.${userId}`]: voteType,
    });

    setHasVoted(true);
  };

  const handleCommentSubmit = async () => {
    if (comment.trim() === "") {
      Alert.alert("Error", "Please enter a comment.");
      return;
    }

    const userId = auth.currentUser.uid;
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const newComment = {
        userId,
        username: userData.username || "",
        text: comment.trim(),
        timestamp: new Date(),
      };

      const buildingRef = doc(db, "buildings", building.id);
      try {
        await updateDoc(buildingRef, {
          comments: arrayUnion(newComment),
        });
        Alert.alert("Success", "Comment submitted successfully!");
        setComment("");
      } catch (error) {
        console.error("Error submitting comment:", error);
        Alert.alert("Error", "Failed to submit comment. Please try again.");
      }
    }
  };

  useEffect(() => {
    const userId = auth.currentUser.uid;
    const buildingRef = doc(db, "buildings", building.id);
    const unsubscribe = onSnapshot(buildingRef, (doc) => {
      const updatedData = doc.data();
      setBuildingData(updatedData);
      setOccupancyLevel(updatedData.occupancyLevel || 0);
      setNoiseLevel(updatedData.noiseLevel);
      setWifiStability(updatedData.wifiStability);
      setMonitor(updatedData.monitor);
      setSocket(updatedData.socket);
      setLastUpdateTime(
        updatedData.lastUpdateTime ? updatedData.lastUpdateTime.toDate() : null
      );

      // Check if the user has already voted
      setHasVoted(updatedData.votes && updatedData.votes[userId]);
    });

    return () => unsubscribe();
  }, [building.id]);

  useEffect(() => {
    const isModified =
      occupancyLevel !== buildingData.occupancyLevel ||
      noiseLevel !== buildingData.noiseLevel ||
      wifiStability !== buildingData.wifiStability ||
      monitor !== buildingData.monitor ||
      socket !== buildingData.socket;

    setIsUpdateDisabled(!isModified);
  }, [occupancyLevel, noiseLevel, wifiStability, monitor, socket, buildingData]);

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
      occupancyLevel,
      noiseLevel,
      wifiStability,
      monitor,
      socket,
      lastUpdateTime: serverTimestamp(),
      likeCount: 0,
      dislikeCount: 0,
      votes: {},
    };
    await updateDoc(doc(db, "buildings", building.id), updatedBuilding);

    const userId = auth.currentUser.uid;
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const userLastUpdateTime = userData.lastUpdateTime
        ? userData.lastUpdateTime.toDate()
        : null;
      const currentTime = new Date();
      if (
        !userLastUpdateTime ||
        moment(currentTime).diff(moment(userLastUpdateTime), "hours") >= 1
      ) {
        await updateDoc(userRef, {
          points: increment(1),
          lastUpdateTime: serverTimestamp(),
        });
      }
    } else {
      await setDoc(userRef, {
        points: 1,
        lastUpdateTime: serverTimestamp(),
      });
    }

    Alert.alert("Success", "Updates successfully saved.");
    setIsUpdateDisabled(true);
  };

  const getStatusColor = (occupancyLevel) => {
    if (occupancyLevel >= 0 && occupancyLevel <= 60) {
      return "green";
    } else if (occupancyLevel >= 61 && occupancyLevel <= 90) {
      return "orange";
    } else {
      return "red";
    }
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: buildingData.imageUrl }}
        style={styles.buildingImage}
      />
      <Text style={styles.buildingName}>{buildingData.name}</Text>

      <View style={styles.optionContainer}>
        <Text style={styles.label}>Occupancy Level:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={occupancyLevel.toString()}
          onChangeText={(text) => setOccupancyLevel(parseInt(text) || 0)}
        />
        <Text style={[styles.statusText, { color: getStatusColor(occupancyLevel) }]}>
          {occupancyLevel}%
        </Text>
        <Text style={styles.updateTime}>
          Last updated: {getTimeDifference()}
        </Text>
        <View style={styles.votingContainer}>
          <TouchableOpacity
            style={[styles.voteButton, hasVoted && styles.activeVoteButton]}
            onPress={() => handleVote("like")}
            disabled={hasVoted}
          >
            <Text style={styles.voteButtonText}>
              👍 {buildingData.likeCount || 0}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.voteButton, hasVoted && styles.activeVoteButton]}
            onPress={() => handleVote("dislike")}
            disabled={hasVoted}
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

      <View style={styles.commentSection}>
        <TextInput
          style={styles.commentInput}
          placeholder="Write a comment..."
          value={comment}
          onChangeText={setComment}
        />
        <TouchableOpacity
          style={styles.commentButton}
          onPress={handleCommentSubmit}
        >
          <Text style={styles.commentButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.commentList}>
        {buildingData.comments &&
          buildingData.comments
            .sort((a, b) => b.timestamp - a.timestamp)
            .map((comment, index) => (
              <View key={index} style={styles.commentItem}>
                <Text style={styles.commentUsername}>{comment.username}</Text>
                <Text style={styles.commentText}>{comment.text}</Text>
                <Text style={styles.commentTimestamp}>
                  {comment.timestamp.toDate
                    ? moment(comment.timestamp.toDate()).format(
                        "YYYY-MM-DD HH:mm"
                      )
                    : "Invalid Date"}
                </Text>
              </View>
            ))}
      </View>
    </KeyboardAwareScrollView>
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
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
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
    marginBottom: 16,
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
  commentSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 16,
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  commentButton: {
    backgroundColor: "#007fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  commentButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  commentList: {
    width: "100%",
  },
  commentItem: {
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  commentUsername: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  commentText: {
    marginBottom: 4,
  },
  commentTimestamp: {
    fontSize: 12,
    color: "gray",
  },
};