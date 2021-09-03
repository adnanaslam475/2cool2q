import { StyleSheet } from "react-native";
import { BaseColor } from "../../../common/color";

export default StyleSheet.create({
  itemIcon: {
    width: 20,
    height: 20,
  },

  itemBox: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderColor: BaseColor.primaryBlueColor,
    borderWidth: 1,
  },
  itemContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  bannerTitleContainerLeft: {
    flex: 1,
  },
  bannerTitleContainerRight: {
    flex: 1,
    alignItems: "flex-end",
  },

  // eslint-disable-next-line react-native/no-color-literals
  bannerBottom: {
    flex: 1,
    flexDirection: "row",
    left: 0,
    bottom: 0,
    position: "absolute",
    backgroundColor: "#0d97dfed",
    opacity: 0.9,
    padding: 15,
    width: "100%",
    height: 67,
    alignItems: "center",
  },
  bannerTitle: {
    fontSize: 18,
    color: BaseColor.whiteColor,
    fontWeight: "800",
  },
  bannerDescription: {
    color: BaseColor.whiteColor,
    fontSize: 13,
  },

  typeTitle: {
    marginLeft: 5,
    color: BaseColor.primaryBlueColor,
    fontSize: 19,
    fontWeight: "700",
  },
  typeTitleDes: {
    marginRight: 5,
    color: BaseColor.primaryBlueColor,
    fontSize: 14,
    fontWeight: "700",
  },

  circle_button: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    width: 49,
    height: 49,
    borderRadius: 25,
  },

  circle: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    width: 49,
    height: 49,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: BaseColor.primaryBlueColor,
  },
  container: { flex: 1, backgroundColor: BaseColor.mainBackground },
  imageHeight: { height: 168 },
  iconView: { flex: 1, flexDirection: "row" },
  iconPhone: { flexDirection: "row", marginTop: 10, padding: 15 },
  divederMain: { marginBottom: 20 },
  deviderView: { flexDirection: "row", alignItems: "center" },
  imageView: {
    flex: 1.3,
    flexDirection: "row",
    marginLeft: 20,
    alignItems: "center",
  },
  menuView: { flex: 1, marginRight: 30, alignItems: "flex-end" },
});
