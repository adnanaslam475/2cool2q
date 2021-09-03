import { Globals } from "config/globals";
import React from "react";
import { TouchableOpacity, View, Image, Text } from "react-native";
import styles from "../common/style";
import { ICON_LEFT_ARROW, ICON_MENU } from "../assets/index";
import Styles from "../styles/components/topbar";

export default function Topbar(props) {
  return (
    <View style={styles.topVw}>
      <TouchableOpacity
        onPress={() => {
          Globals.scanQrDepartmentId = 0;
          if (props != null) {
            // console.log("Back", props);
            props?.goBack();
          }
        }}
      >
        <Image
          source={ICON_LEFT_ARROW}
          style={[styles.imgTopIcon, Styles.leftIcon]}
        />
      </TouchableOpacity>
      <View style={Styles.iconText}>
        <Text style={styles.topbarTitle}>2COOL 2Q</Text>
      </View>
      <TouchableOpacity onPress={() => openMenu()}>
        <Image
          source={ICON_MENU}
          style={[styles.imgTopIcon, Styles.menuIconPosition]}
        />
      </TouchableOpacity>
    </View>
  );
}
