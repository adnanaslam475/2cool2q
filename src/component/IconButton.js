import React from "react";
import { Image, Pressable } from "react-native";
import Styles from "../styles/components/iconButton";

const IconButton = ({ source, onPress, disabled }) => (
  <Pressable onPress={onPress} disabled={disabled}>
    <Image source={source} style={Styles.icon} />
  </Pressable>
);

export default IconButton;
