import React from "react";
import { TouchableOpacity, View, Image, Text } from "react-native";
import styles from "../common/style";
import Styles from "../styles/components/topbar2";
import { ICON_LEFT_ARROW } from "../assets/index";

export default function Topbar(props) {
  return (
    <View style={styles.topVw}>
      <TouchableOpacity onPress={() => props?.goBack()}>
        <Image
          source={ICON_LEFT_ARROW}
          style={[styles.imgTopIcon, Styles.leftArrowIcon]}
        />
      </TouchableOpacity>
      <View style={Styles.iconName}>
        <Text style={styles.topbarTitle}>2COOL 2Q</Text>
      </View>
    </View>
  );
}
