import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import styles from "../common/style";
import Styles from "../styles/components/sidebar";
export default function Sidebar(props) {
  return (
    <View style={Styles.container}>
      <View style={Styles.sidebarView}>
        <TouchableOpacity onPress={() => props.onMenuClicked(0)}>
          <View style={[styles.menuVw, Styles.sidebarName]}>
            <Text style={styles.menuText}>Home</Text>
          </View>
        </TouchableOpacity>
        <View style={Styles.sidemenuBG} />
        <TouchableOpacity onPress={() => props.onMenuClicked(1)}>
          <View style={styles.menuVw}>
            <Text style={styles.menuText}>Privacy Policy</Text>
          </View>
        </TouchableOpacity>
        <View style={Styles.sidemenuBG} />
        <TouchableOpacity onPress={() => props.onMenuClicked(2)}>
          <View style={styles.menuVw}>
            <Text style={styles.menuText}>Contact Us</Text>
          </View>
        </TouchableOpacity>
        <View style={Styles.sidemenuBG} />
        <TouchableOpacity onPress={() => props.onMenuClicked(3)}>
          <View style={styles.menuVw}>
            <Text style={styles.menuText}>Settings</Text>
          </View>
        </TouchableOpacity>
        <View style={Styles.sidemenuBG} />
        <TouchableOpacity onPress={() => props.onMenuClicked(4)}>
          <View style={styles.menuVw}>
            <Text style={styles.menuText}>Logout</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
