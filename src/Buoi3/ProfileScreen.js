import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    // TODO: Implement logout logic
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Profile Image */}
        <View style={styles.profileImageContainer}>
          <Image
            source={require("../../assets/HaloraSpaLogo.png")}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>Doãn Quốc Hiếu</Text>
          <Text style={styles.profileRole}>Admin</Text>
        </View>

        {/* Profile Options */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionItem}>
            <Icon name="person" size={24} color="#e57373" />
            <Text style={styles.optionText}>Personal Information</Text>
            <Icon name="chevron-right" size={24} color="#888" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Icon name="notifications" size={24} color="#e57373" />
            <Text style={styles.optionText}>Notifications</Text>
            <Icon name="chevron-right" size={24} color="#888" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Icon name="security" size={24} color="#e57373" />
            <Text style={styles.optionText}>Security</Text>
            <Icon name="chevron-right" size={24} color="#888" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Icon name="help" size={24} color="#e57373" />
            <Text style={styles.optionText}>Help & Support</Text>
            <Icon name="chevron-right" size={24} color="#888" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" size={24} color="#fff" />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#e57373",
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  profileImageContainer: {
    alignItems: "center",
    paddingVertical: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 16,
    color: "#666",
  },
  optionsContainer: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: "#222",
    marginLeft: 16,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e57373",
    marginHorizontal: 16,
    marginVertical: 30,
    paddingVertical: 16,
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});

export default ProfileScreen;
