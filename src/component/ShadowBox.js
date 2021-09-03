import React from "react";
import { StyleSheet, View } from "react-native";
import { BaseColor } from "../common/color";

export const ShadowBoxType = {
  SQUARE: "square",
  ROUND: "round",
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    alignContent: "center",
    elevation: 4,
  },
  square: {
    borderRadius: 3,
  },
  round: {
    borderRadius: 30,
    paddingHorizontal: 12,
  },
});
const ShadowBox = ({ style, type, ...otherProps }) => {
  const containerStyle = [
    styles.container,
    type === ShadowBoxType.ROUND ? styles.round : null,
    type === ShadowBoxType.SQUARE ? styles.square : null,
    style,
  ];

  return <View style={containerStyle}>{otherProps.children}</View>;
};

ShadowBox.defaultProps = {
  type: ShadowBoxType.SQUARE,
};

export default ShadowBox;
