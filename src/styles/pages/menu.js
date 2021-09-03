import { StyleSheet } from "react-native";
import { BaseColor } from "common/color";
export default StyleSheet.create({
  mainMenuContainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: BaseColor.mainBackground,
  },
  mainMenuView: {
    height: 138,
    width: "100%",
    alignSelf: "center",
    justifyContent: "center",
  },
  menuImageSize: { width: "100%", height: 138 },
  menuView: {
    position: "absolute",
    left: 0,
    width: 130,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: BaseColor.primaryBlueColor,
  },
  menuList: {
    position: "absolute",
    right: 0,
    width: 130,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    backgroundColor: BaseColor.whiteColor,
    borderWidth: 1,
    borderColor: BaseColor.primaryBlueColor,
  },
  cartContainer: { flexDirection: "row", alignItems: "center" },
  cartIcon: { marginLeft: 10, width: 26, height: 25 },
  peepView: {
    width: 23,
    height: 23,
    borderRadius: 15,
    backgroundColor: BaseColor.redColor,
    position: "absolute",
    top: 2,
    left: 30,
  },
  peepText: {
    alignSelf: "center",
    color: BaseColor.whiteColor,
    marginTop: 1,
  },
  peepStyle: { marginLeft: 10, alignItems: "center", padding: 7 },
  menuListView: {
    alignSelf: "center",
    position: "absolute",
    bottom: 10,
    width: 100,
    borderRadius: 20,
    backgroundColor: BaseColor.primaryBlueColor,
  },
  menuText: {
    color: BaseColor.whiteColor,
    padding: 7,
    textAlign: "center",
  },
});
