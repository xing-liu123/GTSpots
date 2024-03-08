// import { View, Text } from "react-native";
// import React from "react";

// const buildings = [
//   { id: "1", name: "", status: "Available" },
//   { id: "2", name: "", status: "Full" },
// ];

// export default function HomeScreen() {
//   return (
//     <View>
//       <Text>Home</Text>
//     </View>
//   );
// }

import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const buildings = [
  {
    id: "1",
    name: "Building A",
    status: "Available",
    imageUrl: require("../../../assets/clough.jpeg"),
  },
  
];

export default function HomeScreen() {
  const navigation = useNavigation();

  const renderBuilding = ({ item }) => (
    <TouchableOpacity
      style={styles.buildingContainer}
      onPress={() => navigation.navigate("BuildingDetails", { building: item })}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.buildingImage} />
      <Text style={styles.buildingName}>{item.name}</Text>
      <Text style={styles.buildingStatus}>{item.status}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Study Spots</Text>
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
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
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
    width: 100,
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