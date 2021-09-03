import { StyleSheet } from "react-native";
import { BaseColor } from "common/color";
export default StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: 75,
  },
  number: {
    color: BaseColor.primaryBlueColor,
    fontWeight: "bold",
  },
});
