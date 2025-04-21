import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";

export default function Project5() {
  return (
    <View style={styles.container}>
      <Text style={[styles.text, { backgroundColor: "green" }]}>Square 1</Text>
      <Text style={[styles.text, { backgroundColor: "blue" }]}>Square 2</Text>
      <Text style={[styles.text, { backgroundColor: "pink" }]}>Square 3</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
    width: 100,
    height: 100,
    borderColor: "black",
    borderRadius: 10,
  },
});
