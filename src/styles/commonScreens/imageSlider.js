import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";
export default StyleSheet.create({
  mainModal: { margin: 0 },
  container: { padding: 10, borderRadius: 10, alignItems: "center" },
  mainView: { marginVertical: 0 },
  mainViewContainer: { flexDirection: "row", alignItems: "center" },
  mainContainer: { width: Dimensions.get("window").width, height: 268 },
  imageSize: {
    width: Dimensions.get("window").width,
    height: 268,
  },
  selectImage: { position: "absolute", left: 0 },
  imageView: { width: 48, alignItems: "center" },
  iconSize: { width: 30, height: 30 },
  selectScroll: { position: "absolute", right: 0 },
  mainImageView: {
    width: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  imageClick: { position: "absolute", right: 0, top: -40, margin: 5 },
  iconSizeValue: { width: 25, height: 25, marginBottom: 10 },
});
