import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
} from "react-native";
import { Avatar, Card } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { getToken } from "../../composable/local";
import colors from "../../constants/colors";
import dayjs from "dayjs";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "./../../contexts/AuthContext";

const ProfileScreen = () => {
  const { handleLogout } = useContext(AuthContext);
  const navigation = useNavigation();
  const [userProfile, setUserProfile] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

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
      setProfileImage(data.data.user.photo); // The photo already contains the full URL now
    } catch (error) {
      console.error("Error fetching user profile:", error);
      Alert.alert(
        "Error",
        "An error occurred while fetching the user profile."
      );
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUserProfile();
    }, [])
  );

  const askForMediaLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission to access media library is required!");
      return false;
    }
    return true;
  };

  const askForCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission to access camera is required!");
      return false;
    }
    return true;
  };

  const handleSelectImageFromGallery = async () => {
    const hasPermission = await askForMediaLibraryPermission();
    if (!hasPermission) {
      return;
    }
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        await handleImageUpload(result.assets[0].uri);
      } else {
        Alert.alert("You did not select any image.");
      }
    } catch (error) {
      console.error("Error selecting image from gallery:", error);
      Alert.alert("An error occurred while selecting an image.");
    }
  };

  const handleSelectImageFromCamera = async () => {
    const hasPermission = await askForCameraPermission();
    if (!hasPermission) {
      return;
    }
    try {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        await handleImageUpload(result.assets[0].uri);
      } else {
        Alert.alert("You did not take any picture.");
      }
    } catch (error) {
      console.error("Error selecting image from camera:", error);
      Alert.alert("An error occurred while taking a picture.");
    }
  };

  const handleImageUpload = async (uri) => {
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("photo", {
        uri: uri,
        type: "image/jpeg",
        name: "profile.jpg",
      });

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}users/updateMe`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProfileImage(data.data.user.photo); // The photo already contains the full URL now
      } else {
        Alert.alert("Failed to upload image. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("An error occurred while uploading the image.");
    }
  };

  if (!userProfile) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: "https://via.placeholder.com/800x400" }}
        style={styles.background}
      >
        <Card style={styles.card}>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigation.navigate("EditUser")}
          >
            <Ionicons name="settings-outline" size={24} color={colors.white} />
          </TouchableOpacity>
          <Card.Content style={styles.content}>
            {userProfile && (
              <View style={styles.userInfo}>
                <View style={styles.avatarContainer}>
                  <TouchableOpacity onPress={handleSelectImageFromGallery}>
                    <Avatar.Image
                      size={120}
                      source={{
                        uri: profileImage || "https://via.placeholder.com/100",
                      }}
                      style={styles.avatar}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.cameraButton}
                    onPress={handleSelectImageFromCamera}
                  >
                    <Ionicons name="camera" size={24} color={colors.white} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.userName}>{userProfile.name}</Text>
                <Text style={styles.userRole}>{userProfile.role}</Text>
                <Text style={styles.userDate}>
                  Created: {dayjs(userProfile.createdAt).format("MMM D, YYYY")}
                </Text>
                <Text style={styles.userDate}>
                  Updated: {dayjs(userProfile.updatedAt).format("MMM D, YYYY")}
                </Text>

                <TouchableOpacity style={styles.button} onPress={handleLogout}>
                  <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
              </View>
            )}
          </Card.Content>
        </Card>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
  },
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  settingsButton: {
    position: "absolute",
    top: -10,
    right: -60,
    backgroundColor: colors.grayLight,
    padding: 8,
    borderRadius: 20,
    zIndex: 10,
  },
  card: {
    width: "90%",
    backgroundColor: colors.white,
    borderRadius: 20,
    elevation: 5,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  content: {
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    alignItems: "center",
    marginBottom: 15,
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 10,
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 8,
  },
  userInfo: {
    alignItems: "center",
    marginTop: 20,
  },
  avatar: {
    marginBottom: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.dark,
    marginBottom: 5,
  },
  userRole: {
    fontSize: 18,
    color: colors.gray,
    marginBottom: 5,
  },
  userDate: {
    fontSize: 14,
    color: colors.gray,
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.danger,
    borderRadius: 5,
  },
  buttonText: {
    color: colors.white,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
