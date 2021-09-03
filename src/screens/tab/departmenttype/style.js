import { StyleSheet } from "react-native";
import { BaseColor } from "../../../common/color";

export default StyleSheet.create({
  bannerTitleContainerLeft: {
    flex: 1,
  },
  bannerTitleContainerRight: {
    flex: 1,
    alignItems: "flex-end",
  },

  typeTitle: {
    marginLeft: 5,
    color: BaseColor.primaryBlueColor,
    fontSize: 19,
    fontWeight: "700",
  },
  typeTitleDes: {
    marginRight: 0,
    color: BaseColor.primaryBlueColor,
    fontSize: 13,
    fontWeight: "700",
  },
});
