import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./HomeScreen";
import Lab1 from "./src/Buoi1/Lab1";
import Project1 from "./src/Buoi1/Project1";
import Project2 from "./src/Buoi1/Project2";
import Project3 from "./src/Buoi1/Project3";
import Project4 from "./src/Buoi1/Project4";
import Project5 from "./src/Buoi1/Project5";
import Project6 from "./src/Buoi1/Project6";
import Project7 from "./src/Buoi1/Project7";
import Project8 from "./src/Buoi1/Project8";
import ContactsNavigator from "./src/Buoi2/routes";
import Options from "./src/Buoi2/Options";
import LoginScreen from "./src/Buoi3/LoginScreen";
import RegisterScreen from "./src/Buoi3/RegisterScreen";
import SpaServicesScreen from "./src/Buoi3/SpaServicesScreen";
import AddServiceScreen from "./src/Buoi3/AddServiceScreen";
import ServiceDetailScreen from "./src/Buoi3/ServiceDetailScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        {/* Main Screens */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Trang chủ", headerShown: false }}
        />

        {/* Bài thực hành buổi 1 */}
        <Stack.Screen
          name="Lab1"
          component={Lab1}
          options={{ title: "Bài thực hành buổi 1" }}
        />
        <Stack.Screen
          name="Project1"
          component={Project1}
          options={{ title: "Project 1. Hello World" }}
        />
        <Stack.Screen
          name="Project2"
          component={Project2}
          options={{ title: "Project 2. Capturing Taps" }}
        />
        <Stack.Screen
          name="Project3"
          component={Project3}
          options={{ title: "Project 3. Custom Component" }}
        />
        <Stack.Screen
          name="Project4"
          component={Project4}
          options={{ title: "Project 4. State" }}
        />
        <Stack.Screen
          name="Project5"
          component={Project5}
          options={{ title: "Project 5. Text Input" }}
        />
        <Stack.Screen
          name="Project6"
          component={Project6}
          options={{ title: "Project 6. ScrollView" }}
        />
        <Stack.Screen
          name="Project7"
          component={Project7}
          options={{ title: "Project 7. List" }}
        />
        <Stack.Screen
          name="Project8"
          component={Project8}
          options={{ title: "Project 8. Fetch" }}
        />

        {/* Bài thực hành buổi 2 */}
        <Stack.Screen
          name="Contacts"
          component={ContactsNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Options"
          component={Options}
          options={{ title: "Tùy chọn" }}
        />
        {/* Buoi 3 */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Đăng nhập", headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: "Đăng ký", headerShown: false }}
        />
        <Stack.Screen
          name="SpaServices"
          component={SpaServicesScreen}
          options={{ title: "Dịch vụ Spa", headerShown: false }}
        />
        <Stack.Screen
          name="AddService"
          component={AddServiceScreen}
          options={{ title: "Thêm dịch vụ", headerShown: false }}
        />
        <Stack.Screen
          name="ServiceDetail"
          component={ServiceDetailScreen}
          options={{ title: "Chi tiết dịch vụ", headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
