import React, { useState, useEffect } from "react";
import HomeScreen from "./App/Screens/HomeScreen/HomeScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import BuildingDetails from "./App/Screens/BuildingDetails/BuildingDetails";
import { auth } from "./App/Config/firebase";
import LoginScreen from "./App/Screens/LoginScreen/LoginScreen";

const Stack = createStackNavigator();
const API_BASE_URL = "http://172.16.39.27:5001";

export default function App() {
  const [buildings, setBuildings] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchBuildings();
  }, []);

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

  const updateBuilding = async ({ id, ...updatedData }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/buildings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        throw new Error("Error updating building");
      }
      const data = await response.json();
      setBuildings((prevBuildings) =>
        prevBuildings.map((building) =>
          building.id === data.id ? data : building
        )
      );
    } catch (error) {
      console.error("Error updating building:", error);
    }
  };

  if (loading) {
    // Display a loading screen while checking the authentication state
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen
              name="Buildings"
              options={{
                title: "Buildings",
                headerStyle: {
                  backgroundColor: "#f5f5f5",
                },
                headerTintColor: "#333",
                headerTitleStyle: {
                  fontWeight: "bold",
                },
              }}
            >
              {(props) => <HomeScreen {...props} buildings={buildings} />}
            </Stack.Screen>
            <Stack.Screen name="Building Details">
              {(props) => (
                <BuildingDetails {...props} updateBuilding={updateBuilding} />
              )}
            </Stack.Screen>
          </>
        ) : (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
