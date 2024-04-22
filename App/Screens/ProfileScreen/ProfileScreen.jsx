import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../Config/firebase";

export default function ProfileScreen({ route }) {
  const { userData } = route.params;
  const [username, setUsername] = useState(userData?.username || "");

  const handleUpdateUsername = async () => {
    console.log(userData.id);
    try {
      const userDocRef = doc(db, "users", userData.id);
      await updateDoc(userDocRef, { username });
      alert("Username updated successfully!");
    } catch (error) {
      console.error("Error updating username:", error);
      alert("Failed to update username. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.info}>{userData?.email}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Role:</Text>
        <Text style={styles.info}>{userData?.role}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Likes:</Text>
        <Text style={styles.info}>{userData?.likes || 0}</Text>
      </View>
      <TouchableOpacity style={styles.updateButton} onPress={handleUpdateUsername}>
        <Text style={styles.updateButtonText}>Update Username</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
    width: 80,
  },
  info: {
    fontSize: 18,
  },
  input: {
    flex: 1,
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 5,
  },
  updateButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: "flex-start",
    marginTop: 20,
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});