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
import { ref, push } from "firebase/database";
import { useNavigation } from "@react-navigation/native";
import { db } from "../../firebaseConfig";
import * as ImagePicker from "expo-image-picker";
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
} from "../config/cloudinaryConfig";

const AddServiceScreen = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [formattedPrice, setFormattedPrice] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigation = useNavigation();

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể chọn ảnh. Vui lòng thử lại.");
    }
  };

  // Hàm định dạng giá tiền với dấu chấm ngăn cách hàng nghìn
  const formatCurrency = (value) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    if (numericValue) {
      return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
    }
    return "";
  };

  // Hàm xử lý khi người dùng nhập giá
  const handlePriceChange = (text) => {
    // Loại bỏ định dạng để lưu giá trị gốc
    const numericValue = text.replace(/[^0-9]/g, "");
    setPrice(numericValue);

    // Cập nhật giá trị định dạng để hiển thị
    setFormattedPrice(formatCurrency(numericValue));
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

  const handleAddService = async () => {
    console.log("Bắt đầu thêm dịch vụ");

    // Kiểm tra xem các trường nhập liệu có hợp lệ không
    if (!name || !price) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (!image) {
      Alert.alert("Lỗi", "Vui lòng chọn hình ảnh cho dịch vụ");
      return;
    }

    setUploading(true);
    try {
      // Upload image to Cloudinary
      const imageUrl = await uploadToCloudinary(image);

      // Tạo tham chiếu đến vị trí trong Firebase Realtime Database
      const servicesRef = ref(db, "services");

      // Lấy thời gian hiện tại
      const currentDate = new Date().toLocaleString();

      // In ra dữ liệu trước khi gửi lên Firebase
      console.log("Dữ liệu sẽ gửi lên Firebase:", {
        name: name.trim(),
        price: parseInt(price),
        formattedPrice: formattedPrice,
        imageUrl: imageUrl,
        createdAt: currentDate,
        updatedAt: currentDate,
      });

      // Gửi dữ liệu lên Firebase
      await push(servicesRef, {
        name: name.trim(),
        price: parseInt(price),
        formattedPrice: formattedPrice,
        imageUrl: imageUrl,
        createdAt: currentDate,
        updatedAt: currentDate,
      });

      // Xử lý thông báo khi thành công
      Alert.alert("Thành công", "Dịch vụ đã được thêm!");
      navigation.goBack();
    } catch (error) {
      console.error("Lỗi khi thêm dịch vụ:", error);
      Alert.alert("Lỗi", "Không thể thêm dịch vụ. Vui lòng thử lại.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thêm Dịch Vụ Mới</Text>

      <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>Chọn hình ảnh</Text>
          </View>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>Tên dịch vụ</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập tên dịch vụ"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Giá tiền (VNĐ)</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập giá tiền"
        value={formattedPrice}
        onChangeText={handlePriceChange}
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={[styles.button, uploading && styles.buttonDisabled]}
        onPress={handleAddService}
        disabled={uploading}
      >
        <Text style={styles.buttonText}>
          {uploading ? "Đang thêm..." : "Thêm Dịch Vụ"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#e57373",
    marginBottom: 24,
    alignSelf: "center",
  },
  imageContainer: {
    width: "100%",
    height: 200,
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
    borderRadius: 12,
  },
  imagePlaceholderText: {
    color: "#666",
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 6,
  },
  input: {
    height: 44,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: 15,
  },
  button: {
    backgroundColor: "#e57373",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddServiceScreen;
