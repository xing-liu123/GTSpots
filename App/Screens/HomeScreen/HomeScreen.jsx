import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

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

export default function HomeScreen({ buildings }) {
  const navigation = useNavigation();
  const renderBuilding = ({ item }) => (
    <TouchableOpacity
      style={styles.buildingContainer}
      onPress={() =>
        navigation.navigate("Building Details", { building: item })
      }
    >
      <Image
        source={{
          uri: `http://localhost:5001/api/buildings/images/${item.imageUrl}`,
        }}
        style={styles.buildingImage}
      />
      <Text style={styles.buildingName}>{item.name}</Text>
      <Text style={{ color: getStatusColor(item.status) }}>{item.status}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={buildings}
        renderItem={renderBuilding}
        keyExtractor={(item) => item._id}
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
