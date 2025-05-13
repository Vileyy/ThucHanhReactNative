import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
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
import ProfileScreen from "./src/Buoi3/ProfileScreen";
import ForgotPasswordScreen from "./src/Buoi3/ForgotPasswordScreen";
import CartScreen from "./src/Buoi3/CartScreen";
import OrderManagementScreen from "./src/Buoi3/OrderManagementScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ===== THỰC HÀNH BUỔI 3: ADMIN TAB NAVIGATOR =====
const AdminTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "SpaServices") {
            iconName = focused ? "list" : "list-outline";
          } else if (route.name === "AddService") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          } else if (route.name === "Orders") {
            iconName = focused ? "receipt" : "receipt-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#e57373",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="SpaServices"
        component={SpaServicesScreen}
        options={{ headerShown: false, title: "Dịch vụ" }}
      />
      <Tab.Screen
        name="AddService"
        component={AddServiceScreen}
        options={{ title: "Thêm dịch vụ" }}
      />
      <Tab.Screen
        name="Orders"
        component={OrderManagementScreen}
        options={{ headerShown: false, title: "Đơn hàng" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false, title: "Cá nhân" }}
      />
    </Tab.Navigator>
  );
};

// ===== THỰC HÀNH BUỔI 3: USER TAB NAVIGATOR =====
const UserTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "UserHome") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Cart") {
            iconName = focused ? "cart" : "cart-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#e57373",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="UserHome"
        component={SpaServicesScreen}
        options={{ headerShown: false, title: "Trang chủ" }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{ headerShown: false, title: "Giỏ hàng" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false, title: "Cá nhân" }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />

        {/* ===== THỰC HÀNH BUỔI 1 ===== */}
        <Stack.Screen name="Lab1" component={Lab1} />
        <Stack.Screen name="Project1" component={Project1} />
        <Stack.Screen name="Project2" component={Project2} />
        <Stack.Screen name="Project3" component={Project3} />
        <Stack.Screen name="Project4" component={Project4} />
        <Stack.Screen name="Project5" component={Project5} />
        <Stack.Screen name="Project6" component={Project6} />
        <Stack.Screen name="Project7" component={Project7} />
        <Stack.Screen name="Project8" component={Project8} />

        {/* ===== THỰC HÀNH BUỔI 2 ===== */}
        <Stack.Screen name="Lab2" component={ContactsNavigator} />
        <Stack.Screen name="Options" component={Options} />

        {/* ===== THỰC HÀNH BUỔI 3 ===== */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="AdminHome" component={AdminTabNavigator} />
        <Stack.Screen name="UserHome" component={UserTabNavigator} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen
          name="ServiceDetail"
          component={ServiceDetailScreen}
          options={{ headerShown: false, title: "Chi tiết dịch vụ" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
