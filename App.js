import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigation from "./App/Navigations/TabNavigation";
import { createStackNavigator } from "@react-navigation/stack";
import BuildingDetails from "./App/Screens/BuildingDetails/BuildingDetails"; // Import the BuildingDetails component

const Stack = createStackNavigator();

export default function App() {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="TabNav" component={TabNavigation} options={{ headerShown: false }} />
          <Stack.Screen name="BuildingDetails" component={BuildingDetails} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
  },
});
