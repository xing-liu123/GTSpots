import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

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

export default function HomeScreen() {
  const navigation = useNavigation();
  const [buildings, setBuildings] = useState([]);

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

  const renderBuilding = ({ item }) => (
    <TouchableOpacity
      style={styles.buildingContainer}
      onPress={() =>
        navigation.navigate("Building Details", { building: item })
      }
    >
      <Image source={{ uri: item.imageUrl }} style={styles.buildingImage} />
      <Text style={styles.buildingName}>{item.name}</Text>
      <Text style={{ color: getStatusColor(item.status) }}>{item.status}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={buildings}
        renderItem={renderBuilding}
        keyExtractor={(item) => item.id}
        numColumns={2}
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
};
