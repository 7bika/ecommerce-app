import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import OnBoardingScreen from "./src/screens/onBoarding/OnBoardingScreen";
import LoginScreen from "./src/screens/auth/LoginScreen";
import SignupScreen from "./src/screens/auth/SignupScreen";
import ForgotPasswordScreen from "./src/screens/auth/ForgotPasswordScreen";
import ResetPasswordScreen from "./src/screens/auth/ResetPasswordScreen";
import BottomTab from "./src/navigations/BottomTab";
import HomeScreen from "./src/screens/layout/HomeScreen";
import Welcome from "./src/screens/Welcome";
import DetailsScreen from "./src/screens/layout/DetailsScreen";
import ChatBot from "./src/screens/layout/ChatBot";
import EditUser from "./src/screens/layout/EditUser";

import { AuthProvider } from "./src/contexts/AuthContext";
import { ProductProvider } from "./src/contexts/ProductContext";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <AuthProvider>
          <ProductProvider>
            <Stack.Navigator>
              <Stack.Screen
                options={{ headerShown: false }}
                name="onBoardingScreen"
                component={OnBoardingScreen}
              />
              <Stack.Screen
                options={{ headerShown: false }}
                name="Welcome"
                component={Welcome}
              />
              <Stack.Screen
                options={{ headerShown: false }}
                name="LoginScreen"
                component={LoginScreen}
              />
              <Stack.Screen
                options={{ headerShown: false }}
                name="SignupScreen"
                component={SignupScreen}
              />
              <Stack.Screen
                name="ForgotPassword"
                component={ForgotPasswordScreen}
                options={{
                  headerShown: false,
                  useNativeDriver: true,
                  cardStyleInterpolator: ({ current: { progress } }) => ({
                    cardStyle: {
                      opacity: progress,
                    },
                  }),
                }}
              />
              <Stack.Screen
                options={{ headerShown: false }}
                name="ResetPasswordScreen"
                component={ResetPasswordScreen}
              />
              <Stack.Screen
                name="BottomTab"
                component={BottomTab}
                options={{
                  headerShown: false,
                  useNativeDriver: true,
                  cardStyleInterpolator: ({ current: { progress } }) => ({
                    cardStyle: {
                      opacity: progress,
                    },
                  }),
                }}
              />

              <Stack.Screen
                options={{ headerShown: false }}
                name="Home"
                component={HomeScreen}
              />

              <Stack.Screen
                name="DetailsScreen"
                component={DetailsScreen}
                options={{
                  headerShown: false,
                  useNativeDriver: true,
                  cardStyleInterpolator: ({ current: { progress } }) => ({
                    cardStyle: {
                      opacity: progress,
                    },
                  }),
                }}
              />
              <Stack.Screen
                name="ChatBot"
                component={ChatBot}
                options={{
                  headerShown: false,
                  useNativeDriver: true,
                  cardStyleInterpolator: ({ current: { progress } }) => ({
                    cardStyle: {
                      opacity: progress,
                    },
                  }),
                }}
              />
              <Stack.Screen
                name="EditUser"
                component={EditUser}
                options={{
                  headerShown: false,
                  useNativeDriver: true,
                  cardStyleInterpolator: ({ current: { progress } }) => ({
                    cardStyle: {
                      opacity: progress,
                    },
                  }),
                }}
              />
            </Stack.Navigator>
          </ProductProvider>
        </AuthProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
