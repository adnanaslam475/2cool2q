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
    flex: 3,
  },
  bannerTitleContainerRight: {
    flex: 1,
    alignItems: "flex-end",
  },

  bannerBottom: {
    flex: 1,
    flexDirection: "row",
    left: 0,
    bottom: 0,
    position: "absolute",
    backgroundColor: "#0d97dfed",
    opacity: 0.8,
    padding: 15,
    width: "100%",
    height: 67,
    alignItems: "center",
  },
  bannerBottomTitle: {
    flex: 1,
    flexDirection: "row",
    left: 0,
    bottom: 0,
    position: "absolute",
    padding: 15,
    width: "100%",
    height: 67,
    alignItems: "center",
  },

  bannerTitle: {
    opacity: 1,
    fontSize: 18,
    color: BaseColor.whiteColor,
    fontWeight: "800",
  },
  bannerDescription: {
    opacity: 1,
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
});
