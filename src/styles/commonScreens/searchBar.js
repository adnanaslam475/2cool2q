import { StyleSheet } from "react-native";
import { BaseColor } from "common/color";
export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BaseColor.whiteColor,
    height: 37,
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 20,
    borderColor: BaseColor.primaryBlueColor,
    alignItems: "center",
  },
  magIcon: { width: 20, height: 20, marginLeft: 10 },
  textInpute: { marginTop: 0, flex: 1, borderWidth: 0 },
});
