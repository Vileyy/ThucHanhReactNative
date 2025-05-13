import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  TextInput,
  ScrollView,
} from "react-native";
import { ref, onValue, update } from "firebase/database";
import { db } from "../../firebaseConfig";
import { getAuth } from "firebase/auth";
import Icon from "react-native-vector-icons/MaterialIcons";

const OrderManagementScreen = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser?.email?.includes("admin")) return;

    const ordersRef = ref(db, "orders");
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const ordersList = [];
      snapshot.forEach((childSnapshot) => {
        const order = childSnapshot.val();
        ordersList.push({
          id: childSnapshot.key,
          ...order,
        });
      });
      // Sắp xếp đơn hàng theo thời gian tạo, mới nhất lên đầu
      ordersList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(ordersList);
      setFilteredOrders(ordersList);
    });

    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    let result = [...orders];

    // Lọc theo trạng thái
    if (selectedStatus !== "all") {
      result = result.filter((order) => order.status === selectedStatus);
    }

    // Tìm kiếm theo email hoặc tên dịch vụ
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (order) =>
          order.userEmail.toLowerCase().includes(query) ||
          order.serviceName.toLowerCase().includes(query)
      );
    }

    setFilteredOrders(result);
  }, [orders, selectedStatus, searchQuery]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#FFA500";
      case "confirmed":
        return "#4CAF50";
      case "cancelled":
        return "#FF0000";
      default:
        return "#666666";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "confirmed":
        return "Đã xác nhận";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const handleConfirmOrder = async (orderId) => {
    Alert.alert(
      "Xác nhận đơn hàng",
      "Bạn có chắc chắn muốn xác nhận đơn hàng này không?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xác nhận",
          onPress: async () => {
            try {
              const orderRef = ref(db, `orders/${orderId}`);
              await update(orderRef, {
                status: "confirmed",
                confirmedAt: new Date().toLocaleString(),
                confirmedBy: currentUser.email,
              });
              Alert.alert("Thành công", "Đã xác nhận đơn hàng!");
            } catch (error) {
              console.error("Error confirming order:", error);
              Alert.alert(
                "Lỗi",
                "Không thể xác nhận đơn hàng. Vui lòng thử lại."
              );
            }
          },
        },
      ]
    );
  };

  const handleCancelOrder = async (orderId) => {
    Alert.alert(
      "Hủy đơn hàng",
      "Bạn có chắc chắn muốn hủy đơn hàng này không?",
      [
        {
          text: "Không",
          style: "cancel",
        },
        {
          text: "Có, hủy đơn hàng",
          style: "destructive",
          onPress: async () => {
            try {
              const orderRef = ref(db, `orders/${orderId}`);
              await update(orderRef, {
                status: "cancelled",
                cancelledAt: new Date().toLocaleString(),
                cancelledBy: currentUser.email,
              });
              Alert.alert("Thành công", "Đã hủy đơn hàng!");
            } catch (error) {
              console.error("Error cancelling order:", error);
              Alert.alert("Lỗi", "Không thể hủy đơn hàng. Vui lòng thử lại.");
            }
          },
        },
      ]
    );
  };

  const renderFilterButtons = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filterContainer}
    >
      <TouchableOpacity
        style={[
          styles.filterButton,
          selectedStatus === "all" && styles.filterButtonActive,
        ]}
        onPress={() => setSelectedStatus("all")}
      >
        <Text
          style={[
            styles.filterButtonText,
            selectedStatus === "all" && styles.filterButtonTextActive,
          ]}
        >
          Tất cả
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.filterButton,
          selectedStatus === "pending" && styles.filterButtonActive,
        ]}
        onPress={() => setSelectedStatus("pending")}
      >
        <Text
          style={[
            styles.filterButtonText,
            selectedStatus === "pending" && styles.filterButtonTextActive,
          ]}
        >
          Chờ xác nhận
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.filterButton,
          selectedStatus === "confirmed" && styles.filterButtonActive,
        ]}
        onPress={() => setSelectedStatus("confirmed")}
      >
        <Text
          style={[
            styles.filterButtonText,
            selectedStatus === "confirmed" && styles.filterButtonTextActive,
          ]}
        >
          Đã xác nhận
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.filterButton,
          selectedStatus === "cancelled" && styles.filterButtonActive,
        ]}
        onPress={() => setSelectedStatus("cancelled")}
      >
        <Text
          style={[
            styles.filterButtonText,
            selectedStatus === "cancelled" && styles.filterButtonTextActive,
          ]}
        >
          Đã hủy
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Image source={{ uri: item.imageUrl }} style={styles.serviceImage} />
      <View style={styles.orderDetails}>
        <Text style={styles.serviceName}>{item.serviceName}</Text>
        <Text style={styles.price}>{item.formattedPrice}</Text>
        <Text style={styles.customerInfo}>Khách hàng: {item.userEmail}</Text>
        <Text style={styles.appointmentTime}>
          Thời gian đặt lịch: {item.appointmentDateTime}
        </Text>
        <Text style={styles.orderDate}>Ngày đặt: {item.createdAt}</Text>

        {item.status === "confirmed" && item.confirmedAt && (
          <Text style={styles.statusInfo}>
            Đã xác nhận lúc: {item.confirmedAt}
            {item.confirmedBy && ` bởi ${item.confirmedBy}`}
          </Text>
        )}

        {item.status === "cancelled" && item.cancelledAt && (
          <Text style={[styles.statusInfo, { color: "#FF0000" }]}>
            Đã hủy lúc: {item.cancelledAt}
            {item.cancelledBy && ` bởi ${item.cancelledBy}`}
          </Text>
        )}

        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          >
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>
      </View>
      {item.status === "pending" && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.confirmButton]}
            onPress={() => handleConfirmOrder(item.id)}
          >
            <Icon name="check" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={() => handleCancelOrder(item.id)}
          >
            <Icon name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quản lý đơn hàng</Text>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.searchContainer}>
          <Icon
            name="search"
            size={24}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm theo email hoặc tên dịch vụ..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              style={styles.clearButton}
            >
              <Icon name="close" size={20} color="#666" />
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.filterWrapper}>{renderFilterButtons()}</View>

        {filteredOrders.length === 0 ? (
          <View style={styles.emptyOrders}>
            <Icon name="receipt" size={64} color="#ccc" />
            <Text style={styles.emptyOrdersText}>
              {searchQuery || selectedStatus !== "all"
                ? "Không tìm thấy đơn hàng phù hợp"
                : "Chưa có đơn hàng nào"}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredOrders}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.orderList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#e57373",
    paddingTop: 40,
    paddingBottom: 12,
    paddingHorizontal: 16,
    zIndex: 1,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
  },
  clearButton: {
    padding: 4,
  },
  filterWrapper: {
    backgroundColor: "#f5f5f5",
    paddingBottom: 8,
    marginBottom: 8,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  filterButton: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: "#fff",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  filterButtonActive: {
    backgroundColor: "#e57373",
    borderColor: "#e57373",
  },
  filterButtonText: {
    color: "#666",
    fontSize: 13,
    fontWeight: "500",
  },
  filterButtonTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  orderList: {
    padding: 16,
    paddingTop: 0,
  },
  orderItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  serviceImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  orderDetails: {
    flex: 1,
    marginLeft: 12,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    color: "#e57373",
    fontWeight: "bold",
    marginBottom: 4,
  },
  customerInfo: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  appointmentTime: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "500",
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  statusContainer: {
    marginTop: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  statusInfo: {
    fontSize: 12,
    color: "#4CAF50",
    marginTop: 4,
    fontStyle: "italic",
  },
  actionButtons: {
    justifyContent: "center",
    marginLeft: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
  },
  cancelButton: {
    backgroundColor: "#FF0000",
  },
  emptyOrders: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
  emptyOrdersText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default OrderManagementScreen;
