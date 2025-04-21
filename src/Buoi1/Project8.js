import React from "react";
import { FlatList, Text, View } from "react-native";

const people = [
  { id: 1, name: "Doãn Quốc Hiếu", age: 25 },
  { id: 2, name: "Nguyễn Kim Thịnh", age: 30 },
  { id: 3, name: "Phan Minh Đại", age: 35 },
  { id: 4, name: "Châu Minh Đương", age: 20 },
  { id: 5, name: "Mike Brown", age: 40 },
  { id: 6, name: "Emily Davis", age: 28 },
  { id: 7, name: "Tom Wilson", age: 32 },
  { id: 8, name: "Sara Anderson", age: 27 },
  { id: 9, name: "Tommy Martinez", age: 22 },
  { id: 10, name: "Jessica Taylor", age: 29 },
  { id: 11, name: "Chris Lee", age: 31 },
  { id: 12, name: "Patricia White", age: 24 },
  { id: 13, name: "David Harris", age: 26 },
  { id: 14, name: "Laura Clark", age: 33 },
  { id: 15, name: "James Lewis", age: 38 },
  { id: 16, name: "Linda Robinson", age: 21 },
  { id: 17, name: "Robert Walker", age: 36 },
  { id: 18, name: "Barbara Hall", age: 23 },
  { id: 19, name: "William Allen", age: 34 },
  { id: 20, name: "Elizabeth Young", age: 39 },
];

const renderItem = ({ item }) => (
  <View
    style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" }}
  >
    <Text style={{ fontSize: 18 }}>{item.name}</Text>
    <Text style={{ fontSize: 16, color: "#666" }}>{item.age} tuổi</Text>
  </View>
);

const FlatListExample = () => {
  return (
    <FlatList
      data={people}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
    />
  );
};

export default FlatListExample;
