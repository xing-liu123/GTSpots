import { View, Text, Image } from "react-native";
import React from "react";

export default function BuildingDetails({ route }) {
  const { building } = route.params;

  return (
    <View style={styles.container}>
      <Image source={building.imageUrl} style={styles.buildingImage} />
      <Text style={styles.buildingName}>{building.name}</Text>
      <Text style={styles.buildingStatus}>Status: {building.status}</Text>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 24,
    alignItems: "center",
  },
  buildingImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  buildingName: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
  },
  buildingStatus: {
    fontSize: 16,
    color: "#888",
    marginTop: 8,
  },
};