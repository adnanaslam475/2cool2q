import React from "react";
import { TouchableOpacity, View, Image, Text } from "react-native";
import styles from "../common/style";
import Styles from "../styles/components/topBarSearch";
import { ICON_MENU } from "../assets/index";

export default function Topbar(props) {
  return (
    <View style={styles.topVw}>
      <View style={Styles.container}>
        <Text style={styles.topbarTitle}>2COOL 2Q</Text>
      </View>
      <TouchableOpacity onPress={() => openMenu()}>
        <Image
          source={ICON_MENU}
          style={[styles.imgTopIcon, Styles.imagePosition]}
        />
      </TouchableOpacity>
    </View>
  );
}
