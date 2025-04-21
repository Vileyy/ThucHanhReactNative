import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
export default function Project6() {
  const data = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30,
  ];
  return (
    <ScrollView > 
      {data.map((item) => (
        <TouchableOpacity key={item} style={styles.container}>
          <Text style={styles.text}>Square {item}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FF99CC",
    padding: 10,
    margin: 10,
    width: 200,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    height: 50,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
  },
  text: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
  },
});
