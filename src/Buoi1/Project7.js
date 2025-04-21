import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React from "react";

export default function Project7() {
  const [name, setName] = React.useState("");
  return (
    <View style={styles.container}>
      <Text style={{fontSize: 20}}>What is your name ?</Text>
      <View>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={(text) => setName(text)}
        />
      </View>
      <TouchableOpacity
        onPress={() => Alert.alert("Thong bao", `Hello ${name}`)}
        style={styles.button}
      >
        <Text style={styles.text}>Say Hello</Text>
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
  input: {
    borderWidth: 1,
    borderColor: "black",
    width: 300,
    height: 60,
    paddingLeft: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  text: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#FF99CC",
    width: 200,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
  },
});
