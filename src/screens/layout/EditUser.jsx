import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getToken } from "../../composable/local";
import colors from "../../constants/colors";
import dayjs from "dayjs";

const EditUser = () => {
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = await getToken();
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}users/me`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const data = await response.json();
      setUserProfile(data.data.user);
      setName(data.data.user.name);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      Alert.alert(
        "Error",
        "An error occurred while fetching the user profile."
      );
    }
  };

  const handleUpdateName = async () => {
    try {
      const token = await getToken();
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}users/updateMe`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update name");
      }

      Alert.alert("Success", "Name updated successfully!");
    } catch (error) {
      console.error("Error updating name:", error);
      Alert.alert("Error", "An error occurred while updating the name.");
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== passwordConfirm) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      const token = await getToken();
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}users/updateMyPassword`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            oldPassword,
            newPassword,
            passwordConfirm,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update password");
      }

      Alert.alert("Success", "Password updated successfully!");
      navigation.navigate("Profile");
    } catch (error) {
      console.error("Error updating password:", error);
      Alert.alert("Error", "An error occurred while updating the password.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Modifier le Profil</Text>

      {userProfile && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>Email: </Text>
            {userProfile.email}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>Role: </Text>
            {userProfile.role}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>Joined: </Text>
            {dayjs(userProfile.createdAt).format("MMM D, YYYY")}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>Last Updated: </Text>
            {dayjs(userProfile.updatedAt).format("MMM D, YYYY")}
          </Text>
        </View>
      )}

      <TextInput
        style={styles.input}
        placeholder="Enter new name"
        value={name}
        onChangeText={setName}
      />
      <TouchableOpacity style={styles.button} onPress={handleUpdateName}>
        <Text style={styles.buttonText}>Modifier le Nom</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Enter old password"
        secureTextEntry
        value={oldPassword}
        onChangeText={setOldPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter new password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm new password"
        secureTextEntry
        value={passwordConfirm}
        onChangeText={setPasswordConfirm}
      />
      <TouchableOpacity style={styles.button} onPress={handleUpdatePassword}>
        <Text style={styles.buttonText}>modifier Mot de passe</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.grayLight,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: colors.dark,
  },
  infoContainer: {
    width: "100%",
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    color: colors.dark,
    marginBottom: 5,
  },
  infoLabel: {
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: 15,
    marginVertical: 10,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderColor: colors.grayLight,
    borderWidth: 1,
    fontSize: 16,
  },
  button: {
    width: "100%",
    backgroundColor: colors.primary,
    padding: 15,
    alignItems: "center",
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default EditUser;
