import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { ref, onValue, remove, update } from "firebase/database";
import { db } from "../../firebaseConfig";
import { getAuth } from "firebase/auth";
import Icon from "react-native-vector-icons/MaterialIcons";

const CartScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) return;

    const ordersRef = ref(db, "orders");
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const orders = [];
      snapshot.forEach((childSnapshot) => {
        const order = childSnapshot.val();
        if (order.userId === currentUser.uid) {
          orders.push({
            id: childSnapshot.key,
            ...order,
          });
        }
      });
      // Sắp xếp đơn hàng theo thời gian tạo, mới nhất lên đầu
      orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setCartItems(orders);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#FFA500"; // Màu cam cho trạng thái chờ xác nhận
      case "confirmed":
        return "#4CAF50"; // Màu xanh lá cho trạng thái đã xác nhận
      case "cancelled":
        return "#FF0000"; // Màu đỏ cho trạng thái đã hủy
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

  const handleRemoveItem = async (orderId) => {
    Alert.alert("Xác nhận", "Bạn có muốn hủy đơn hàng này không?", [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Xác nhận hủy",
        style: "destructive",
        onPress: async () => {
          try {
            const orderRef = ref(db, `orders/${orderId}`);
            await update(orderRef, {
              status: "cancelled",
            });
            Alert.alert("Thành công", "Đã hủy đơn hàng!");
          } catch (error) {
            console.error("Error cancelling order:", error);
            Alert.alert("Lỗi", "Không thể hủy đơn hàng. Vui lòng thử lại.");
          }
        },
      },
    ]);
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.imageUrl }} style={styles.serviceImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.serviceName}>{item.serviceName}</Text>
        <Text style={styles.price}>{item.formattedPrice}</Text>
        <Text style={styles.appointmentTime}>
          Thời gian đặt lịch: {item.appointmentDateTime}
        </Text>
        <Text style={styles.orderDate}>Ngày đặt: {item.createdAt}</Text>
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
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveItem(item.id)}
        >
          <Icon name="cancel" size={24} color="#e57373" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Đơn hàng của tôi</Text>
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyCart}>
          <Icon name="shopping-cart" size={64} color="#ccc" />
          <Text style={styles.emptyCartText}>Chưa có đơn hàng nào</Text>
        </View>
      ) : (
        <FlatList
          data={cartItems}
          renderItem={renderCartItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.cartList}
        />
      )}
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
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  cartList: {
    padding: 16,
  },
  cartItem: {
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
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
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
  appointmentTime: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "500",
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    color: "#666",
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
  removeButton: {
    padding: 8,
    justifyContent: "center",
  },
  emptyCart: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyCartText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
});

export default CartScreen;
