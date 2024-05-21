import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import colors from "./../constants/colors";

const Welcome = ({ navigation }) => {
  const handleLoginPress = () => {
    navigation.navigate("LoginScreen");
  };

  const handleSignUpPress = () => {
    navigation.navigate("SignupScreen");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue</Text>
      <Text style={styles.subtitle}>Choisissez Ce Que Vous Voulez</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.loginButton]}
          onPress={handleLoginPress}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.signUpButton]}
          onPress={handleSignUpPress}
        >
          <Text style={styles.buttonText}>Créer un compte</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.dark, // Dark background
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#ffffff", // White text
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "300",
    color: "#d3d3d3", // Light gray text
    marginBottom: 50,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginHorizontal: 10,
    elevation: 3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff", // White text
  },
  loginButton: {
    backgroundColor: "#0a74da", // Dark blue
  },
  signUpButton: {
    backgroundColor: "#004080", // Darker blue
  },
});

export default Welcome;
