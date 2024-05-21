import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CartScreen from "../screens/layout/CartScreen";
import ProfileScreen from "../screens/layout/ProfileScreen";
import FavoritesScreen from "../screens/layout/FavoritesScreen";
import AntDesign from "react-native-vector-icons/AntDesign";
import HomeScreen from "../screens/layout/HomeScreen";
import { View, Text, StyleSheet } from "react-native";

const Tab = createBottomTabNavigator();

const BottomTab = () => {
  //setIsAuthenticated
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <AntDesign
                name="home"
                size={40}
                color={focused ? "#000" : "#8e8e93"}
              />
              <Text
                style={focused ? styles.iconLabelFocused : styles.iconLabel}
              >
                Home
              </Text>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <AntDesign
                name="heart"
                size={40}
                color={focused ? "#000" : "#8e8e93"}
              />
              <Text
                style={focused ? styles.iconLabelFocused : styles.iconLabel}
              >
                Favorites
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <AntDesign
                name="shoppingcart"
                size={40}
                color={focused ? "#000" : "#8e8e93"}
              />
              <Text
                style={focused ? styles.iconLabelFocused : styles.iconLabel}
              >
                Cart
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <AntDesign
                name="user"
                size={40}
                color={focused ? "#000" : "#8e8e93"}
              />
              <Text
                style={focused ? styles.iconLabelFocused : styles.iconLabel}
              >
                Profile
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#f8f8f8",
    borderTopWidth: 0,
    height: 60,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconLabel: {
    fontSize: 12,
    color: "#8e8e93",
  },
  iconLabelFocused: {
    fontSize: 12,
    color: "#000",
  },
});

export default BottomTab;
