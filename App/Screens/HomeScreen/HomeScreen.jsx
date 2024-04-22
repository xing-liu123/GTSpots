import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  Button,
  SafeAreaView,
} from "react-native";
import React, { useState } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const API_BASE_URL = "http://172.16.39.27:5001";

const getStatusColor = (status) => {
  switch (status) {
    case "Available":
      return "green";
    case "Limited":
      return "orange";
    case "Full":
      return "red";
    default:
      return "black";
  }
};

const FilterModal = ({ visible, onClose, onApply, onClear }) => {
  const [selectedAvailability, setSelectedAvailability] = useState([]);
  const [selectedNoiseLevel, setSelectedNoiseLevel] = useState([]);
  const [selectedWifiStability, setSelectedWifiStability] = useState([]);
  const [selectedMonitor, setSelectedMonitor] = useState(false);
  const [selectedSocket, setSelectedSocket] = useState(false);

  const handleAvailabilitySelection = (option) => {
    if (selectedAvailability.includes(option)) {
      setSelectedAvailability(selectedAvailability.filter((item) => item !== option));
    } else {
      setSelectedAvailability([...selectedAvailability, option]);
    }
  };

  const handleNoiseLevelSelection = (option) => {
    if (selectedNoiseLevel.includes(option)) {
      setSelectedNoiseLevel(selectedNoiseLevel.filter((item) => item !== option));
    } else {
      setSelectedNoiseLevel([...selectedNoiseLevel, option]);
    }
  };

  const handleWifiStabilitySelection = (option) => {
    if (selectedWifiStability.includes(option)) {
      setSelectedWifiStability(selectedWifiStability.filter((item) => item !== option));
    } else {
      setSelectedWifiStability([...selectedWifiStability, option]);
    }
  };

  const handleApplyFilter = () => {
    onApply({
      availability: selectedAvailability,
      noiseLevel: selectedNoiseLevel,
      wifiStability: selectedWifiStability,
      monitor: selectedMonitor,
      socket: selectedSocket,
    });
    onClose();
  };

  const handleClearFilter = () => {
    setSelectedAvailability([]);
    setSelectedNoiseLevel([]);
    setSelectedWifiStability([]);
    setSelectedMonitor(false);
    setSelectedSocket(false);
    onClear();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Filter Options</Text>

          {/* Availability */}
          <Text style={styles.modalLabel}>Availability:</Text>
          <View style={styles.modalOptionContainer}>
            {["Available", "Limited", "Full"].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.modalOption,
                  selectedAvailability.includes(option) && styles.selectedModalOption,
                ]}
                onPress={() => handleAvailabilitySelection(option)}
              >
                <Text style={styles.modalOptionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Noise Level */}
          <Text style={styles.modalLabel}>Noise Level:</Text>
          <View style={styles.modalOptionContainer}>
            {["Quiet", "Moderate", "Loud"].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.modalOption,
                  selectedNoiseLevel.includes(option) && styles.selectedModalOption,
                ]}
                onPress={() => handleNoiseLevelSelection(option)}
              >
                <Text style={styles.modalOptionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* WiFi Stability */}
          <Text style={styles.modalLabel}>WiFi Stability:</Text>
          <View style={styles.modalOptionContainer}>
            {["Strong", "Unstable", "Weak"].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.modalOption,
                  selectedWifiStability.includes(option) && styles.selectedModalOption,
                ]}
                onPress={() => handleWifiStabilitySelection(option)}
              >
                <Text style={styles.modalOptionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Monitor */}
          <View style={styles.modalCheckboxContainer}>
            <Text style={styles.modalLabel}>Monitor:</Text>
            <TouchableOpacity
              style={[
                styles.modalCheckbox,
                selectedMonitor && styles.selectedModalCheckbox,
              ]}
              onPress={() => setSelectedMonitor(!selectedMonitor)}
            >
              {selectedMonitor && <Text style={styles.modalCheckboxText}>✓</Text>}
            </TouchableOpacity>
          </View>

          {/* Socket */}
          <View style={styles.modalCheckboxContainer}>
            <Text style={styles.modalLabel}>Socket:</Text>
            <TouchableOpacity
              style={[
                styles.modalCheckbox,
                selectedSocket && styles.selectedModalCheckbox,
              ]}
              onPress={() => setSelectedSocket(!selectedSocket)}
            >
              {selectedSocket && <Text style={styles.modalCheckboxText}>✓</Text>}
            </TouchableOpacity>
          </View>

          <View style={styles.modalButtonContainer}>
            <Button title="Apply" onPress={handleApplyFilter} />
            <Button title="Clear" onPress={handleClearFilter} />
            <Button title="Close" onPress={onClose} />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default function HomeScreen({ userRole }) {
  const navigation = useNavigation();
  const [buildings, setBuildings] = useState([]);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({});

  useFocusEffect(
    React.useCallback(() => {
      const fetchBuildings = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/buildings`);
          if (!response.ok) {
            throw new Error("Error fetching buildings");
          }
          const data = await response.json();
          setBuildings(data);
        } catch (error) {
          console.error("Error fetching buildings:", error);
        }
      };
      fetchBuildings();
    }, [])
  );

  const openFilterModal = () => {
    setIsFilterModalVisible(true);
  };

  const closeFilterModal = () => {
    setIsFilterModalVisible(false);
  };

  const applyFilters = (filters) => {
    setSelectedFilters(filters);
  };

  const clearFilters = () => {
    setSelectedFilters({});
  };

  const filteredBuildings = buildings.filter((building) => {
    const {
      availability,
      noiseLevel,
      wifiStability,
      monitor,
      socket,
    } = selectedFilters;

    if (
      Object.keys(selectedFilters).length === 0 ||
      (availability.length === 0 &&
        noiseLevel.length === 0 &&
        wifiStability.length === 0 &&
        monitor === false &&
        socket === false)
    ) {
      return true;
    }

    if (availability.length > 0 && !availability.includes(building.status)) {
      return false;
    }
    if (noiseLevel.length > 0 && !noiseLevel.includes(building.noiseLevel)) {
      return false;
    }
    if (wifiStability.length > 0 && !wifiStability.includes(building.wifiStability)) {
      return false;
    }
    if (monitor && !building.monitor) {
      return false;
    }
    if (socket && !building.socket) {
      return false;
    }
    return true;
  });

  const renderBuilding = ({ item }) => (
    <TouchableOpacity
      style={styles.buildingContainer}
      onPress={() => {
        if (userRole === "university") {
          navigation.navigate("Building Details for University", {
            building: item,
          });
        } else {
          navigation.navigate("Building Details", { building: item });
        }
      }}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.buildingImage} />
      <Text style={styles.buildingName}>{item.name}</Text>
      <Text style={{ color: getStatusColor(item.status) }}>{item.status}</Text>
    </TouchableOpacity>
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={openFilterModal}
          style={styles.filterButton}
        >
          <Ionicons name="filter" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredBuildings}
        renderItem={renderBuilding}
        keyExtractor={(item) => item.id}
        numColumns={2}
      />
      <FilterModal
        visible={isFilterModalVisible}
        onClose={closeFilterModal}
        onApply={applyFilters}
        onClear={clearFilters}
      />
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  buildingContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 8,
    marginVertical: 8,
    alignItems: "center",
  },
  buildingImage: {
    width: 150,
    height: 100,
    borderRadius: 8,
  },
  buildingName: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },
  buildingStatus: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 48,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  modalOptionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  modalOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedModalOption: {
    backgroundColor: "#ccc",
  },
  modalOptionText: {
    fontSize: 16,
  },
  modalCheckboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  modalCheckbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedModalCheckbox: {
    backgroundColor: "#ccc",
  },
  modalCheckboxText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  filterButton: {
    marginRight: 16,
  },
};