import React from "react";
import { View } from "react-native";
import Styles from "../styles/components/overlay";

export default function Overlay(props) {
  return props.isVisible ? <View style={Styles.container} /> : null;
}
