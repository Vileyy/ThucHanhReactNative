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
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, get, set } from "firebase/database";
import { useNavigation } from "@react-navigation/native";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ email và mật khẩu");
      return;
    }

    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Kiểm tra trong database
      const db = getDatabase();
      const userRef = ref(db, `users/${user.uid}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();
        // Nếu là admin
        if (userData.role === "admin") {
          Alert.alert("Thành công", "Đăng nhập thành công!", [
            {
              text: "OK",
              onPress: () => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: "AdminHome" }],
                });
              },
            },
          ]);
        } else {
          // Nếu là user thường
          Alert.alert("Thành công", "Đăng nhập thành công!", [
            {
              text: "OK",
              onPress: () => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: "UserHome" }],
                });
              },
            },
          ]);
        }
      } else {
        // Nếu user chưa có trong database
        const userData = {
          email: user.email,
          role: "user",
          createdAt: new Date().toISOString(),
        };
        await set(ref(db, `users/${user.uid}`), userData);

        Alert.alert("Thành công", "Đăng nhập thành công!", [
          {
            text: "OK",
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: "UserHome" }],
              });
            },
          },
        ]);
      }
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage = "Đăng nhập thất bại. Vui lòng thử lại.";

      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Email không hợp lệ";
          break;
        case "auth/user-disabled":
          errorMessage = "Tài khoản đã bị vô hiệu hóa";
          break;
        case "auth/user-not-found":
          errorMessage = "Không tìm thấy tài khoản";
          break;
        case "auth/wrong-password":
          errorMessage = "Mật khẩu không đúng";
          break;
        case "auth/invalid-credential":
          errorMessage = "Email hoặc mật khẩu không đúng";
          break;
        case "auth/too-many-requests":
          errorMessage =
            "Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau";
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
        <Text style={styles.title}>Đăng nhập</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Đăng nhập</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.forgotPasswordButton}
          onPress={() => navigation.navigate("ForgotPassword")}
        >
          <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.registerButtonText}>
            Chưa có tài khoản? Đăng ký ngay
          </Text>
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
    marginBottom: 30,
    textAlign: "center",
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
  loginButton: {
    backgroundColor: "#e57373",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerButton: {
    marginTop: 20,
    alignItems: "center",
  },
  registerButtonText: {
    color: "#e57373",
    fontSize: 14,
  },
  forgotPasswordButton: {
    marginTop: 10,
    alignItems: "center",
  },
  forgotPasswordText: {
    color: "#e57373",
    fontSize: 14,
  },
});

export default LoginScreen;
