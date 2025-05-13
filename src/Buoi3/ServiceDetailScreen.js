import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ref, update, remove, get, push } from "firebase/database";
import { db } from "../../firebaseConfig";
import * as ImagePicker from "expo-image-picker";
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
} from "../config/cloudinaryConfig";
import { getAuth } from "firebase/auth";

const ServiceDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { serviceId } = route.params;
  const auth = getAuth();
  const currentUser = auth.currentUser;

  // Add console log for debugging
  console.log("ServiceDetailScreen rendered with serviceId:", serviceId);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [formattedPrice, setFormattedPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isEditing, setIsEditing] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [creatorInfo, setCreatorInfo] = useState({});
  const [creationTime, setCreationTime] = useState("");
  const [updateTime, setUpdateTime] = useState("");
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(9);
  const [selectedMinute, setSelectedMinute] = useState(0);

  // Debug state changes
  useEffect(() => {
    console.log("isEditing state changed:", isEditing);
  }, [isEditing]);

  useEffect(() => {
    // Fetch service details from Firebase
    const fetchServiceDetails = async () => {
      const serviceRef = ref(db, `services/${serviceId}`);
      try {
        const snapshot = await get(serviceRef);
        if (snapshot.exists()) {
          const serviceData = snapshot.val();
          setName(serviceData.name || "");
          setPrice(serviceData.price ? serviceData.price.toString() : "0");
          setFormattedPrice(serviceData.formattedPrice || "0đ");
          setImageUrl(serviceData.imageUrl || "");
          setCreationTime(serviceData.createdAt || "");
          setUpdateTime(serviceData.updatedAt || "");
        } else {
          Alert.alert("Error", "Service not found!");
          navigation.goBack();
        }
      } catch (error) {
        console.error("Error fetching service details:", error);
        Alert.alert("Error", "Failed to load service details");
      }
    };

    fetchServiceDetails();
  }, [serviceId]);

  const formatCurrency = (value) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    if (numericValue) {
      return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
    }
    return "0đ";
  };

  const handlePriceChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setPrice(numericValue);
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

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        Alert.alert("Đang tải lên", "Vui lòng đợi trong giây lát...");
        const newImageUrl = await uploadToCloudinary(result.assets[0].uri);
        setImageUrl(newImageUrl);
        Alert.alert("Thành công", "Đã cập nhật hình ảnh!");
      }
    } catch (error) {
      console.error("Error picking/uploading image:", error);
      Alert.alert("Lỗi", "Không thể cập nhật ảnh. Vui lòng thử lại.");
    }
  };

  const handleUpdateService = async () => {
    if (!name || !price) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // Make sure price is a valid number
    const priceValue = parseInt(price);
    if (isNaN(priceValue)) {
      Alert.alert("Error", "Please enter a valid price");
      return;
    }

    const serviceRef = ref(db, `services/${serviceId}`);
    try {
      const currentDate = new Date().toLocaleString();
      await update(serviceRef, {
        name: name.trim(),
        price: priceValue,
        formattedPrice: formattedPrice,
        imageUrl: imageUrl,
        updatedAt: currentDate,
      });

      Alert.alert("Cập nhật thành ", "Dịch vụ đã được cập nhật!");
      setIsEditing(false);
      setUpdateTime(currentDate);
    } catch (error) {
      console.error("Error updating service:", error);
      Alert.alert("Error", "Could not update service. Please try again.");
    }
  };

  const handleDeleteService = async () => {
    const serviceRef = ref(db, `services/${serviceId}`);
    try {
      await remove(serviceRef);
      Alert.alert("Xóa thành công", "Dịch vụ đã được xóa!");
      navigation.goBack();
    } catch (error) {
      console.error("Error deleting service:", error);
      Alert.alert("Error", "Could not delete service. Please try again.");
    }
  };

  const formatDateTime = (dateTimeString) => {
    return dateTimeString || "N/A";
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (hour, minute) => {
    return `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
  };

  const handleDateChange = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    if (newDate >= new Date()) {
      setSelectedDate(newDate);
    }
  };

  const handleHourChange = (hours) => {
    const newHour = selectedHour + hours;
    if (newHour >= 8 && newHour <= 20) {
      setSelectedHour(newHour);
    }
  };

  const handleMinuteChange = (minutes) => {
    const newMinute = selectedMinute + minutes;
    if (newMinute >= 0 && newMinute < 60) {
      setSelectedMinute(newMinute);
    }
  };

  const handleOrder = async () => {
    if (!currentUser) {
      Alert.alert("Lỗi", "Vui lòng đăng nhập để đặt hàng");
      return;
    }
    setShowAppointmentModal(true);
  };

  const confirmOrder = async () => {
    try {
      const appointmentDateTime = `${formatDate(selectedDate)} lúc ${formatTime(
        selectedHour,
        selectedMinute
      )}`;
      const orderRef = ref(db, "orders");
      const newOrder = {
        serviceId: serviceId,
        serviceName: name,
        price: price,
        formattedPrice: formattedPrice,
        imageUrl: imageUrl,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        status: "pending",
        createdAt: new Date().toLocaleString(),
        appointmentDateTime: appointmentDateTime,
        appointmentTimestamp: selectedDate.setHours(
          selectedHour,
          selectedMinute
        ),
      };

      await push(orderRef, newOrder);
      setShowAppointmentModal(false);
      Alert.alert("Thành công", "Đơn hàng của bạn đã được đặt thành công!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error("Error placing order:", error);
      Alert.alert("Lỗi", "Không thể đặt hàng. Vui lòng thử lại.");
    }
  };

  const renderDeleteConfirmation = () => {
    return (
      <Modal visible={confirmDelete} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.warningTitle}>Xác nhận</Text>
              <Text style={styles.warningText}>
                Bạn có muốn xóa dịch vụ này không !
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setConfirmDelete(false)}
                >
                  <Text style={styles.cancelButtonText}>CANCEL</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={handleDeleteService}
                >
                  <Text style={styles.deleteButtonText}>DELETE</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderAppointmentModal = () => (
    <Modal
      visible={showAppointmentModal}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn thời gian đặt lịch</Text>

            <View style={styles.dateTimeContainer}>
              <Text style={styles.sectionTitle}>Ngày đặt lịch</Text>
              <View style={styles.dateSelector}>
                <TouchableOpacity
                  style={styles.selectorButton}
                  onPress={() => handleDateChange(-1)}
                >
                  <Icon name="chevron-left" size={24} color="#e57373" />
                </TouchableOpacity>
                <Text style={styles.dateTimeText}>
                  {formatDate(selectedDate)}
                </Text>
                <TouchableOpacity
                  style={styles.selectorButton}
                  onPress={() => handleDateChange(1)}
                >
                  <Icon name="chevron-right" size={24} color="#e57373" />
                </TouchableOpacity>
              </View>

              <Text style={styles.sectionTitle}>Giờ đặt lịch</Text>
              <View style={styles.timeSelector}>
                <View style={styles.timeSection}>
                  <Text style={styles.timeLabel}>Giờ</Text>
                  <View style={styles.timeControls}>
                    <TouchableOpacity
                      style={styles.selectorButton}
                      onPress={() => handleHourChange(-1)}
                    >
                      <Icon name="remove" size={24} color="#e57373" />
                    </TouchableOpacity>
                    <Text style={styles.dateTimeText}>
                      {selectedHour.toString().padStart(2, "0")}
                    </Text>
                    <TouchableOpacity
                      style={styles.selectorButton}
                      onPress={() => handleHourChange(1)}
                    >
                      <Icon name="add" size={24} color="#e57373" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.timeSection}>
                  <Text style={styles.timeLabel}>Phút</Text>
                  <View style={styles.timeControls}>
                    <TouchableOpacity
                      style={styles.selectorButton}
                      onPress={() => handleMinuteChange(-15)}
                    >
                      <Icon name="remove" size={24} color="#e57373" />
                    </TouchableOpacity>
                    <Text style={styles.dateTimeText}>
                      {selectedMinute.toString().padStart(2, "0")}
                    </Text>
                    <TouchableOpacity
                      style={styles.selectorButton}
                      onPress={() => handleMinuteChange(15)}
                    >
                      <Icon name="add" size={24} color="#e57373" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAppointmentModal(false)}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={confirmOrder}
              >
                <Text style={styles.confirmButtonText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Service detail</Text>
        {currentUser?.email?.includes("admin") ? (
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{ marginRight: 15 }}
              onPress={() => {
                console.log("Edit icon pressed");
                setIsEditing(true);
              }}
            >
              <Icon name="edit" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setConfirmDelete(true)}>
              <Icon name="delete" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ width: 24 }} />
        )}
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.serviceImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Icon name="add-a-photo" size={40} color="#666" />
              <Text style={styles.imagePlaceholderText}>Chọn hình ảnh</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Service name *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Service name"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Price *</Text>
          <TextInput
            style={styles.input}
            value={formattedPrice}
            onChangeText={handlePriceChange}
            placeholder="Price"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Time</Text>
          <Text style={styles.detailText}>{formatDateTime(creationTime)}</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Final update</Text>
          <Text style={styles.detailText}>{formatDateTime(updateTime)}</Text>
        </View>

        {currentUser?.email?.includes("admin") && (
          <TouchableOpacity
            style={styles.updateButton}
            onPress={handleUpdateService}
          >
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
        )}

        {!currentUser?.email?.includes("admin") && (
          <TouchableOpacity style={styles.orderButton} onPress={handleOrder}>
            <Text style={styles.orderButtonText}>Đặt hàng</Text>
          </TouchableOpacity>
        )}
      </View>

      {renderAppointmentModal()}
      {renderDeleteConfirmation()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  detailText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  input: {
    fontSize: 16,
    color: "#333",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 6,
  },
  updateButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
  },
  modalContent: {
    padding: 20,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  warningText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 20,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e57373",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#e57373",
    fontSize: 16,
    fontWeight: "600",
  },
  deleteButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  deleteButtonText: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
  imageContainer: {
    width: "100%",
    height: 200,
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
  },
  serviceImage: {
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
    marginTop: 8,
  },
  orderButton: {
    backgroundColor: "#e57373",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 16,
  },
  orderButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  dateTimeContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginBottom: 10,
  },
  dateSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  timeSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 10,
  },
  timeSection: {
    flex: 1,
    alignItems: "center",
  },
  timeLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  timeControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectorButton: {
    padding: 8,
  },
  dateTimeText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    marginHorizontal: 15,
    minWidth: 40,
    textAlign: "center",
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 10,
    borderRadius: 8,
    backgroundColor: "#e57373",
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ServiceDetailScreen;
