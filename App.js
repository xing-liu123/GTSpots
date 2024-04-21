import React, { useState, useEffect } from "react";
import HomeScreen from "./App/Screens/HomeScreen/HomeScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import StudentBuildingDetails from "./App/Screens/BuildingDetails/StudentBuildingDetails";
import { auth } from "./App/Config/firebase";
import LoginScreen from "./App/Screens/LoginScreen/LoginScreen";

const Stack = createStackNavigator();
const API_BASE_URL = "http://172.16.39.27:5001";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
              component={HomeScreen}
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
            />
            <Stack.Screen
              name="Building Details"
              component={StudentBuildingDetails}
            />
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
