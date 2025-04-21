import { View, Text, StyleSheet } from "react-native";
import React from "react";

export default function Project1() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello World !</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "blue",
    borderRadius: 10,
    padding: 10,
  },
});
