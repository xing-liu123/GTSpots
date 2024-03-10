import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";

const statusOptions = ["Available", "Limited", "Full"];
const noiseLevelOptions = ["Quiet", "Moderate", "Loud"];
const wifiStabilityOptions = ["Strong", "Unstable", "Weak"];

export default function BuildingDetails({ route, navigation, updateBuilding }) {
  const { building } = route.params;
  const [status, setStatus] = useState(building.status);
  const [noiseLevel, setNoiseLevel] = useState(building.noiseLevel || "Quiet");
  const [wifiStability, setWifiStability] = useState(
    building.wifiStability || "Strong"
  );
  const [monitor, setMonitor] = useState(building.monitor || false);
  const [socket, setSocket] = useState(building.socket || false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (!hasUnsavedChanges) {
        return;
      }

      e.preventDefault();

      Alert.alert(
        "Unsaved Changes",
        "You have unsaved changes. Are you sure you want to go back?",
        [
          { text: "Don't leave", style: "cancel", onPress: () => {} },
          {
            text: "Go back",
            style: "destructive",
            onPress: () => navigation.dispatch(e.data.action),
          },
        ]
      );
    });

    return unsubscribe;
  }, [navigation, hasUnsavedChanges]);

  // const handleUpdateStatus = () => {
  //   const updatedBuilding = {
  //     ...building,
  //     status,
  //     noiseLevel,
  //     wifiStability,
  //     monitor,
  //     socket,
  //   };
  //   updateBuilding(updatedBuilding);
  //   setHasUnsavedChanges(false);
  //   Alert.alert('Success', 'Updates successfully saved.');
  // };

  const handleUpdateStatus = async () => {
    const updatedBuilding = {
      ...building,
      status,
      noiseLevel,
      wifiStability,
      monitor,
      socket,
    };
    await updateBuilding(updatedBuilding);
    setHasUnsavedChanges(false);
    Alert.alert("Success", "Updates successfully saved.");
  };

  useEffect(() => {
    setHasUnsavedChanges(
      status !== building.status ||
        noiseLevel !== building.noiseLevel ||
        wifiStability !== building.wifiStability ||
        monitor !== building.monitor ||
        socket !== building.socket
    );
  }, [status, noiseLevel, wifiStability, monitor, socket]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{
          uri: `http://localhost:5001/api/buildings/images/${building.imageUrl}`,
        }}
        style={styles.buildingImage}
      />
      <Text style={styles.buildingName}>{building.name}</Text>

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
        style={styles.updateButton}
        onPress={handleUpdateStatus}
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
};
