import React, {useState} from "react";
import HomeScreen from "./App/Screens/HomeScreen/HomeScreen";
import { StyleSheet} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import BuildingDetails from "./App/Screens/BuildingDetails/BuildingDetails";

const Stack = createStackNavigator();

export default function App() {
  const [buildings, setBuildings] = useState([
    {
      id: "1",
      name: "Clough Undergraduate Learning Commons",
      status: "Available",
      imageUrl: require("./assets/clough.jpeg"),
      noiseLevel: "Quiet",
      wifiStability: "Strong",
      monitor: false,
      socket: false,
    },
    {
      id: "2",
      name: "Price Gilbert Memorial Library",
      status: "Available",
      imageUrl: require("./assets/price-gilbert.jpeg"),
      noiseLevel: "Quiet",
      wifiStability: "Strong",
      monitor: false,
      socket: false,
    },
    {
      id: "3",
      name: "Crossland Tower",
      status: "Available",
      imageUrl: require("./assets/crossland-tower.jpeg"),
      noiseLevel: "Quiet",
      wifiStability: "Strong",
      monitor: false,
      socket: false,
    },
    {
      id: "4",
      name: "Klaus Advanced Computing Building",
      status: "Available",
      imageUrl: require("./assets/klaus-building.jpeg"),
      noiseLevel: "Quiet",
      wifiStability: "Strong",
      monitor: false,
      socket: false,
    },
  ]);

  const updateBuilding = (updatedBuilding) => {
    setBuildings((prevBuildings) =>
      prevBuildings.map((building) =>
        building.id === updatedBuilding.id ? updatedBuilding : building
      )
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Location">
          {(props) => <HomeScreen {...props} buildings={buildings} />}
        </Stack.Screen>
        <Stack.Screen name="BuildingDetails">
          {(props) => (
            <BuildingDetails {...props} updateBuilding={updateBuilding} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
  },
});
