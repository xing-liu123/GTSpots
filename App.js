import React, { useState, useEffect } from "react";
import HomeScreen from "./App/Screens/HomeScreen/HomeScreen";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import BuildingDetails from "./App/Screens/BuildingDetails/BuildingDetails";

const Stack = createStackNavigator();

export default function App() {
  const [buildings, setBuildings] = useState([]);

  useEffect(() => {
    fetchBuildings();
  }, []);

  const fetchBuildings = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/buildings");
      if (!response.ok) {
        throw new Error("Error fetching buildings");
      }
      const data = await response.json();
      setBuildings(data);
    } catch (error) {
      console.error("Error fetching buildings:", error);
    }
  };

  const updateBuilding = async (updatedBuilding) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/buildings/${updatedBuilding._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedBuilding),
        }
      );
      if (!response.ok) {
        throw new Error("Error updating building");
      }
      const data = await response.json();
      setBuildings((prevBuildings) =>
        prevBuildings.map((building) =>
          building._id === data._id ? data : building
        )
      );
    } catch (error) {
      console.error("Error updating building:", error);
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Buildings">
          {(props) => <HomeScreen {...props} buildings={buildings} />}
        </Stack.Screen>
        <Stack.Screen name="Building Details">
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
