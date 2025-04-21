import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./HomeScreen";
import Lab1 from "./src/Buoi1/Lab1";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Trang chủ", headerShown: false }}
        />
        <Stack.Screen
          name="Lab1"
          component={Lab1}
          options={{ title: "Buổi 1" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
