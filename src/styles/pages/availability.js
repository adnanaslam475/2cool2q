import { StyleSheet } from "react-native";
import { BaseColor } from "common/color";
export default StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: BaseColor.mainBackground },
  imageSlider: { height: 168 },
  bannerTitleView: { flex: 1, flexDirection: "row" },
  bannerTitleText: { zIndex: 1, flexWrap: "wrap" },
  iconSize: { width: 17, height: 17 },
  kmPosition: { flex: 1, flexDirection: "row" },
  expandView: { alignItems: "flex-end" },
  arrowIcon: {
    width: 28,
    height: 28,
    marginRight: 20,
    marginTop: -13,
  },
  expandViewStart: { flexDirection: "row", marginTop: 5, padding: 15 },
  availibilityHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  openingTime: {
    flex: 2.4,
    flexDirection: "row",
    marginLeft: 20,
    alignItems: "center",
  },
  opanTimeText: { fontSize: 11, marginLeft: 10 },
  departmwntListContainer: { flex: 1, marginRight: 30, alignItems: "flex-end" },
  mainModal: { margin: 10, borderRadius: 3 },
  modalViewConatiner: {
    backgroundColor: BaseColor.whiteColor,
    padding: 10,
    borderRadius: 10,
  },
  modalView: { marginVertical: 0, width: "100%", marginBottom: 20 },
  modalDialogText: { marginTop: 15, marginLeft: 15 },
  setOpeningTime: { position: "absolute", right: 0, top: 0, margin: 10 },
  iconWidth: { width: 25, height: 25, marginBottom: 10 },
});
