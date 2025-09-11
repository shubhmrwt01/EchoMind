import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

import HomeScreen from "../screens/HomeScreen";
import MeetingScreen from "../screens/MeetingScreen";
import RecordScreen from "../screens/RecordScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

const TABS = [
  { name: "HomeScreen", component: HomeScreen, icon: "home" },
  { name: "MeetingScreen", component: MeetingScreen, icon: "document-text" },
  { name: "RecordScreen", component: RecordScreen, icon: "mic" },
  { name: "ProfileScreen", component: ProfileScreen, icon: "person" },
];

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#d3d3d3",
        tabBarStyle: {
          backgroundColor: "#fff",
          height: 70,
          borderTopWidth: 0,
          elevation: 0,
        },
      }}
    >
      {TABS.map(({ name, component, icon }) => (
        <Tab.Screen
          key={name}
          name={name}
          component={component}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={icon as any} size={size} color={color} />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

export default TabNavigator;
