import { View, Text } from "react-native";
import React from "react";

export default function UniversityBuildingDetails({ route }) {
  const { building } = route.params;

  return (
    <View>
      <Text>University Building Details</Text>
      <Text>Building Name: {building.name}</Text>
      {/* Add more university-specific building details */}
    </View>
  );
}