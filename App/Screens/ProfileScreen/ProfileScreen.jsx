import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ProfileScreen({ route }) {
  const { userRole, userEmail } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.info}>Email: {userEmail}</Text>
      <Text style={styles.info}>Role: {userRole}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  info: {
    fontSize: 18,
    marginBottom: 10,
  },
});
