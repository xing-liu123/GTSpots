import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function UniversityBuildingDetails({ route }) {
  const { building } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{building.name}</Text>
      <Text>This is the university building details screen.</Text>
      {/* Add more university-specific building details */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
});
