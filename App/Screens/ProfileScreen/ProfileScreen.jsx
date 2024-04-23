import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../Config/firebase";
import { useNavigation } from "@react-navigation/native";

export default function ProfileScreen({ route }) {
  const { userData } = route.params;
  const [username, setUsername] = useState(userData?.username || "");
  const [points, setPoints] = useState(userData?.points || 0);
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert(
        "Logout Error",
        "An error occurred while logging out. Please try again."
      );
    }
  };

  useEffect(() => {
    const userDocRef = doc(db, "users", userData.id);
    const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const updatedUserData = snapshot.data();
        setPoints(updatedUserData.points || 0);
      }
    });
    return () => unsubscribe();
  }, [userData.id]);

  const handleUpdateUsername = async () => {
    try {
      const userDocRef = doc(db, "users", userData.id);
      await updateDoc(userDocRef, { username });
      Alert.alert("Success", "Username updated successfully!");
    } catch (error) {
      console.error("Error updating username:", error);
      Alert.alert(
        "Update Error",
        "Failed to update username. Please try again."
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Text style={styles.title}>Profile</Text>
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
          <Text style={styles.label}>Bonus Points:</Text>
          <Text style={styles.info}>{points}</Text>
        </View>
        <TouchableOpacity
          style={styles.updateButton}
          onPress={handleUpdateUsername}
        >
          <Text style={styles.updateButtonText}>Update Username</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  profileContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
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
    width: 120,
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
  logoutButton: {
    backgroundColor: "#FF0000",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    alignSelf: "center",
    marginTop: 20,
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
