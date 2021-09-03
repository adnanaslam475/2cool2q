import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import styles from "common/style";

const TextButtonFilledColor = ({ ...props }) => {
  return (
    <TouchableOpacity {...props} style={props.style}>
      <View style={styles.primaryBtn}>
        <Text style={styles.btnText}>{props.text} </Text>
      </View>
    </TouchableOpacity>
  );
};

const TextButtonOutline = (props) => {
  return (
    <TouchableOpacity {...props} style={props.style}>
      <View style={styles.primaryEmptyBtn}>
        <Text style={styles.btnTextEmpty}>{props.text} </Text>
      </View>
    </TouchableOpacity>
  );
};

export { TextButtonFilledColor, TextButtonOutline };
