import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getToken } from "./../composable/local";
import { login as loginApi } from "../apis/api";
import { useNavigation } from "@react-navigation/native";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentlyLoggedIn, setCurrentlyLoggedIn] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = await getToken();
      if (token) {
        const user = await AsyncStorage.getItem("user");
        if (user) {
          setCurrentUser(JSON.parse(user));
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          setCurrentUser(null);
        }
      } else {
        setIsLoggedIn(false);
        setCurrentUser(null);
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  //login
  const login = async (email, password) => {
    try {
      const data = { email, password };
      const res = await loginApi(data);
      if (res.data.status.trim() === "success") {
        setCurrentUser(res.data.data.user);

        console.log("user", currentUser);
        setIsLoggedIn(true);

        fetchUserProfile();
      } else {
        throw new Error(res.data.message || "An error occurred during login");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  //logout
  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}users/logout`,
        {
          method: "POST",
        }
      );
      if (response.ok) {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");
        setCurrentUser(null);
        setIsLoggedIn(false);
        navigation.navigate("LoginScreen");
      } else {
        Alert.alert("Failed to logout. Please try again.");
      }
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert("An error occurred while logging out.");
    }
  };

  //fetch current user
  async function fetchUserProfile() {
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

      const data = response.json();
      if (response.ok) {
        setCurrentlyLoggedIn(data.data.user);
        console.log("gggggggg", currentlyLoggedIn);
      }
      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }
    } catch (err) {
      console.log(err);
    }
  }

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, isLoggedIn, login, handleLogout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
