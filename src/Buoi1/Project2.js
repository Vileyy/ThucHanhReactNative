import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import React from "react";

export default function Project2() {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          Alert.alert(
            "Thông báo", 
            "Bạn đã nhấn vào nút, chúc bạn làm bài thực hành tốt nhé!", 
          )
        }
      >
        <Text style={styles.buttonText}>Hãy nhấn vào nhé!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#FF99CC",
    padding: 10,
    margin: 10,
    width: 200,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
