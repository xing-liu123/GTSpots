import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../Screens/HomeScreen/HomeScreen";
import ProfileScreen from "../Screens/ProfileScreen/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigation() {
  return (
   <Tab.Navigator>
    <Tab.Screen name="Study Spots" component={HomeScreen} />
    <Tab.Screen name="profile" component={ProfileScreen} />
   </Tab.Navigator>
  );
}
