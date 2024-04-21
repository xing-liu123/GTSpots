import React, { useState, useEffect } from "react";
import HomeScreen from "./App/Screens/HomeScreen/HomeScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import StudentBuildingDetails from "./App/Screens/BuildingDetails/StudentBuildingDetails";
import UniversityBuildingDetails from "./App/Screens/BuildingDetails/UniversityBuildingDetails";
import { auth, db } from "./App/Config/firebase";
import { doc, getDoc } from "firebase/firestore";
import LoginScreen from "./App/Screens/LoginScreen/LoginScreen";

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserRole(userData.role || "");
          } else {
            console.error("User document does not exist!");
            setUserRole("");
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setUserRole("");
        }
        setUser(user);
      } else {
        setUser(null);
        setUserRole("");
      }
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
            <Stack.Screen name="Buildings">
              {(props) => <HomeScreen {...props} userRole={userRole} />}
            </Stack.Screen>
            <Stack.Screen
              name="Building Details"
              component={StudentBuildingDetails}
            />
            <Stack.Screen
              name="Building Details for University"
              component={UniversityBuildingDetails}
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
