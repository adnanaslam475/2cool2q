import { StyleSheet } from "react-native";
import { BaseColor } from "common/color";
export default StyleSheet.create({
  mainMenuBlock: { marginVertical: 5 },
  mainMenuContainer: {
    flex: 1,
    marginLeft: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
  menuName: { marginRight: 20 },
  menuTitleView: { flexDirection: "row", marginTop: 10 },
  menuView: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  menuText: { marginTop: 0, fontWeight: "700" },
  menuList: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  menuTitle: {
    fontSize: 20,
    marginLeft: 10,
    marginRight: 10,
    color: BaseColor.primaryBlueColor,
  },
  topBar2: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  menuSize: { height: 168, width: "100%" },
  items: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    marginBottom: 30,
    marginTop: 20,
  },
});
