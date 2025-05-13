import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import {
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import { useNavigation } from "@react-navigation/native";

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const navigation = useNavigation();

  // Hàm tạo mật khẩu ngẫu nhiên
  const generateRandomPassword = () => {
    const length = 8;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let newPassword = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      newPassword += charset[randomIndex];
    }
    return newPassword;
  };

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Lỗi", "Vui lòng nhập email của bạn");
      return;
    }

    try {
      const auth = getAuth();
      const db = getDatabase();

      // Kiểm tra xem email có tồn tại trong hệ thống không
      const usersRef = ref(db, "users");
      const snapshot = await get(usersRef);
      let userExists = false;
      let userUid = null;

      snapshot.forEach((childSnapshot) => {
        const userData = childSnapshot.val();
        if (userData.email === email) {
          userExists = true;
          userUid = childSnapshot.key;
        }
      });

      if (!userExists) {
        Alert.alert("Lỗi", "Không tìm thấy tài khoản với email này");
        return;
      }

      // Tạo mật khẩu mới
      const newPassword = generateRandomPassword();

      // Gửi email reset mật khẩu
      await sendPasswordResetEmail(auth, email);

      Alert.alert(
        "Thành công",
        "Đã gửi email đặt lại mật khẩu đến địa chỉ email của bạn.\nVui lòng kiểm tra hộp thư và làm theo hướng dẫn trong email để đặt lại mật khẩu.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login"),
          },
        ]
      );
    } catch (error) {
      console.error("Reset password error:", error);
      let errorMessage =
        "Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại.";

      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Email không hợp lệ";
          break;
        case "auth/user-not-found":
          errorMessage = "Không tìm thấy tài khoản với email này";
          break;
        case "auth/too-many-requests":
          errorMessage = "Quá nhiều yêu cầu. Vui lòng thử lại sau";
          break;
        case "auth/network-request-failed":
          errorMessage = "Lỗi kết nối mạng. Vui lòng kiểm tra lại";
          break;
      }

      Alert.alert("Lỗi", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/HaloraSpaLogo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Quên mật khẩu</Text>
        <Text style={styles.description}>
          Nhập email của bạn để nhận mật khẩu mới
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleResetPassword}
        >
          <Text style={styles.resetButtonText}>Gửi mật khẩu mới</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.backButtonText}>Quay lại đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 40,
  },
  logo: {
    width: 200,
    height: 150,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#e57373",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: "#e57373",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    marginTop: 20,
    alignItems: "center",
  },
  backButtonText: {
    color: "#e57373",
    fontSize: 14,
  },
});

export default ForgotPasswordScreen;
