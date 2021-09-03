import { StyleSheet } from "react-native";
import { BaseColor } from "common/color";
export default StyleSheet.create({
  container: {
    backgroundColor: BaseColor.whiteColor,
    flex: 1,
    opacity: 0.95,
    flexDirection: "column",
    zIndex: 100,
  },
  sidebarView: { marginTop: 45 },
  sidebarName: { marginTop: 30 },
  sidemenuBG: {
    flexDirection: "row",
    backgroundColor: BaseColor.sideMenuBackGround,
    height: 1,
    marginLeft: 24,
    marginRight: 24,
    marginTop: 10,
  },
});
