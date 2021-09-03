import { Text, View } from "react-native";
import React from "react";
import Styles from "../../styles/components/quantity";

const Quantity = ({ item }) => (
  <View style={Styles.container}>
    <Text style={Styles.text}>£ {item.unit_price.toFixed(2)}</Text>
    <Text style={Styles.text}>*</Text>
    <Text style={Styles.text}>{item.count}</Text>
  </View>
);

export default Quantity;
