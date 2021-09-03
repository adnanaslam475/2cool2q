import { StyleSheet } from "react-native";
import { BaseColor } from "common/color";
export default StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexGrow: 1,
    marginRight: 20, // TODO remove this margin when creating a component for the whole OrderItem (probably use space-between)
  },
  text: {
    color: BaseColor.blackColor,
  },
});
