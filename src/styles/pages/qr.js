import { StyleSheet } from "react-native";
import { BaseColor } from "common/color";
export default StyleSheet.create({
  mainContainer: { 
    justifyContent: "center", 
    alignItems: "center" },
  qrView: {
    alignItems: "center",
    marginTop: 100,
    marginBottom: 0,
    paddingLeft: 20,
    paddingRight: 20,
  },
  alignContentCenter: { alignContent: "center" },
  onSuccessView: { marginTop: 0 },
  scanText: { fontSize: 15, color: BaseColor.grayColor },
});
