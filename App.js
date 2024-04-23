import React, { useState, useEffect } from "react";
import HomeScreen from "./App/Screens/HomeScreen/HomeScreen";
import { NavigationContainer } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import StudentBuildingDetails from "./App/Screens/BuildingDetails/StudentBuildingDetails";
import UniversityBuildingDetails from "./App/Screens/BuildingDetails/UniversityBuildingDetails";
import { auth, db } from "./App/Config/firebase";
import { doc, getDoc } from "firebase/firestore";
import LoginScreen from "./App/Screens/LoginScreen/LoginScreen";
import ProfileScreen from "./App/Screens/ProfileScreen/ProfileScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { LogBox } from "react-native";

LogBox.ignoreAllLogs();

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = {
              id: userDoc.id,
              ...userDoc.data(),
            };
            setUserData(userData);
          } else {
            console.error("User document does not exist!");
            setUserData(null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserData(null);
        }
        setUser(user);
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    // Display a loading screen while checking the authentication state
    return null;
  }

  function BuildingsStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Home">
          {(props) => <HomeScreen {...props} userRole={userData?.role} />}
        </Stack.Screen>
        <Stack.Screen
          name="Building Details"
          component={StudentBuildingDetails}
        />
        <Stack.Screen
          name="Building Details for University"
          component={UniversityBuildingDetails}
        />
      </Stack.Navigator>
    );
  }

  function ProfileStack() {
    const navigation = useNavigation();

    return (
      <Stack.Navigator>
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          initialParams={{ userData }}
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        <Tab.Navigator>
          <Tab.Screen
            name="Buildings"
            component={BuildingsStack}
            options={{ headerShown: false }}
          />
          <Tab.Screen name="Profile" component={ProfileStack} />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
