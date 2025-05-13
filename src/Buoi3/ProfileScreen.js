import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import {
  getAuth,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  signOut,
} from "firebase/auth";
import { getDatabase, ref, update, get } from "firebase/database";
import { db } from "../../firebaseConfig";
import * as ImagePicker from "expo-image-picker";
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
} from "../config/cloudinaryConfig";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const auth = getAuth();
  const db = getDatabase();
  const [user, setUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userInfo, setUserInfo] = useState({
    fullName: "",
    phone: "",
    address: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userRef = ref(db, `users/${currentUser.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          setUser(snapshot.val());
          setUserInfo({
            fullName: snapshot.val().fullName || "",
            phone: snapshot.val().phone || "",
            address: snapshot.val().address || "",
          });
          setProfileImage(snapshot.val().profileImage);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch user data");
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn đăng xuất?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Đăng xuất",
          onPress: async () => {
            try {
              await signOut(auth);
              navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
              });
            } catch (error) {
              Alert.alert("Lỗi", "Đăng xuất thất bại");
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      Alert.alert("Success", "Password updated successfully");
      setModalVisible(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const updates = {
        fullName: userInfo.fullName,
        phone: userInfo.phone,
        address: userInfo.address,
      };
      await update(ref(db, `users/${auth.currentUser.uid}`), updates);
      Alert.alert("Success", "Profile updated successfully");
      setModalVisible(false);
      fetchUserData();
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
    }
  };

  const uploadToCloudinary = async (imageUri) => {
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        type: "image/jpeg",
        name: "upload.jpg",
      });
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      formData.append("cloud_name", CLOUDINARY_CLOUD_NAME);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = await response.json();
      if (data.secure_url) {
        return data.secure_url;
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw error;
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        Alert.alert("Đang tải lên", "Vui lòng đợi trong giây lát...");
        const newImageUrl = await uploadToCloudinary(result.assets[0].uri);
        await updateProfileImage(newImageUrl);
        setProfileImage(newImageUrl);
        Alert.alert("Thành công", "Đã cập nhật ảnh đại diện!");
      }
    } catch (error) {
      console.error("Error picking/uploading image:", error);
      Alert.alert("Lỗi", "Không thể cập nhật ảnh. Vui lòng thử lại.");
    }
  };

  const updateProfileImage = async (imageUrl) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("User not logged in");
      const userRef = ref(db, `users/${currentUser.uid}`);
      await update(userRef, {
        profileImage: imageUrl,
        updatedAt: new Date().toLocaleString(),
      });
    } catch (error) {
      console.error("Error updating profile image:", error);
      throw error;
    }
  };

  const renderModalContent = () => {
    switch (modalType) {
      case "password":
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Đổi mật khẩu</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Mật khẩu hiện tại"
                secureTextEntry={!showCurrentPassword}
                value={currentPassword}
                onChangeText={setCurrentPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                <Icon
                  name={showCurrentPassword ? "visibility" : "visibility-off"}
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Mật khẩu mới"
                secureTextEntry={!showNewPassword}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowNewPassword(!showNewPassword)}
              >
                <Icon
                  name={showNewPassword ? "visibility" : "visibility-off"}
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Xác nhận mật khẩu mới"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Icon
                  name={showConfirmPassword ? "visibility" : "visibility-off"}
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleChangePassword}
            >
              <Text style={styles.modalButtonText}>Cập nhật</Text>
            </TouchableOpacity>
          </View>
        );
      case "profile":
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chỉnh sửa thông tin</Text>

            {/* Profile Image Section */}
            <TouchableOpacity
              style={styles.modalImageContainer}
              onPress={pickImage}
            >
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={styles.modalProfileImage}
                />
              ) : (
                <View style={styles.modalImagePlaceholder}>
                  <Icon name="person" size={40} color="#666" />
                </View>
              )}
              <View style={styles.modalEditIconContainer}>
                <Icon name="edit" size={20} color="#fff" />
              </View>
            </TouchableOpacity>
            <Text style={styles.imageEditText}>Chạm để thay đổi ảnh</Text>

            <TextInput
              style={styles.input}
              placeholder="Họ và tên"
              value={userInfo.fullName}
              onChangeText={(text) =>
                setUserInfo({ ...userInfo, fullName: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Số điện thoại"
              value={userInfo.phone}
              onChangeText={(text) => setUserInfo({ ...userInfo, phone: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Địa chỉ"
              value={userInfo.address}
              onChangeText={(text) =>
                setUserInfo({ ...userInfo, address: text })
              }
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleUpdateProfile}
            >
              <Text style={styles.modalButtonText}>Cập nhật</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
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
          <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Icon name="person" size={60} color="#666" />
              </View>
            )}
            <View style={styles.editIconContainer}>
              <Icon name="edit" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.profileName}>{user?.fullName || "User"}</Text>
          <Text style={styles.profileRole}>{user?.role || "User"}</Text>
        </View>

        {/* Profile Options */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => {
              setModalType("profile");
              setModalVisible(true);
            }}
          >
            <Icon name="person" size={24} color="#e57373" />
            <Text style={styles.optionText}>Chỉnh sửa thông tin</Text>
            <Icon name="chevron-right" size={24} color="#888" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => {
              setModalType("password");
              setModalVisible(true);
            }}
          >
            <Icon name="security" size={24} color="#e57373" />
            <Text style={styles.optionText}>Đổi mật khẩu</Text>
            <Icon name="chevron-right" size={24} color="#888" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" size={24} color="#fff" />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            {renderModalContent()}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  imageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#e57373",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContent: {
    width: "100%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  modalButton: {
    backgroundColor: "#e57373",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
  },
  closeButtonText: {
    color: "#666",
    fontSize: 16,
  },
  modalImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 10,
    position: "relative",
  },
  modalProfileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  modalImagePlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  modalEditIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#e57373",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  imageEditText: {
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
    fontSize: 14,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    position: "relative",
  },
  passwordInput: {
    flex: 1,
    paddingRight: 40, // Space for the eye icon
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    padding: 5,
  },
});

export default ProfileScreen;
