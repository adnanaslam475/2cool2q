import { StyleSheet } from "react-native";
import { BaseColor } from "../../common/color";
export default StyleSheet.create({
  marginTop20: {
    marginTop: 20,
  },
  modelMainView: {
    backgroundColor: BaseColor.whiteColor,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  modelView: {
    marginVertical: 0,
  },
  modelText: {
    color: BaseColor.redColor,
    fontSize: 18,
    textAlign: "center",
    marginVertical: 20,
  },
  dismissButtonView: { alignSelf: "center" },
  dismissText: {
    padding: 10,
    textAlign: "center",
    color: BaseColor.blackColor,
    fontWeight: "bold",
  },
});
