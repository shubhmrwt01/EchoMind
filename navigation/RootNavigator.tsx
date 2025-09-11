import React from "react";
import * as SecureStore from "expo-secure-store";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import LoginScreen from "../Login";
import { ClerkProvider, ClerkLoaded, useAuth } from "@clerk/clerk-expo";

// 🔐 Token cache setup
const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (item) console.log(`${key} was used 🔐`);
      return item;
    } catch (error) {
      console.error("SecureStore get item error: ", error);
      await SecureStore.deleteItemAsync(key); // Clean bad cache
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (err) {
      console.error("SecureStore set item error: ", err);
    }
  },
};

const Stack = createNativeStackNavigator();

function Navigator() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    // 🌀 Loading state (you can replace with a Tailwind spinner)
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isSignedIn ? (
        <Stack.Screen name="Tabs" component={TabNavigator} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}

const RootNavigator = () => {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <Navigator />
      </ClerkLoaded>
    </ClerkProvider>
  );
};

export default RootNavigator;
