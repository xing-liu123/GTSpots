import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../Config/firebase";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Login successful, navigate to the main screen
      navigation.navigate("Buildings");
    } catch (error) {
      console.error("Error logging in:", error);
      // Handle login error, display an error message to the user
      if (error.code === "auth/invalid-email") {
        Alert.alert("Invalid email", "Please enter a valid email address.");
      } else if (error.code === "auth/user-not-found") {
        // If user doesn't exist, create a new user
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          // User created successfully, navigate to the main screen
          navigation.navigate("Buildings");
        } catch (createError) {
          console.error("Error creating user:", createError);
          Alert.alert("Error creating user", "An error occurred while creating a new user.");
        }
      } else if (error.code === "auth/wrong-password") {
        Alert.alert("Wrong password", "Please enter the correct password.");
      } else {
        Alert.alert("Login error", "An error occurred during login.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 4,
    paddingVertical: 12,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
