import { StyleSheet } from "react-native";
import { BaseColor } from "common/color";
export default StyleSheet.create({
  container: { marginLeft: 20, marginRight: 20, marginTop: 5 },
  menuView: {
    flexDirection: "row",
    alignItems: "center",
    height: 45,
    marginTop: 1,
  },
  selectMenu: { flex: 3, justifyContent: "center" },
  subTotal: {
    flex: 1.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  subTotalText: { marginLeft: 10, fontWeight: "700" },
  // eslint-disable-next-line no-dupe-keys
  container: { flex: 1 },
  mainDetailsView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  flateList: { marginTop: 10, marginBottom: 10 },
  devider: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 10,
    marginTop: 0,
    marginLeft: 30,
    marginRight: 30,
  },
  totalPrice: { flex: 1, alignItems: "flex-end" },
  devider2: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 5,
    marginTop: 0,
    marginLeft: 30,
    marginRight: 30,
  },
  textView: { flex: 1, alignItems: "flex-end" },
  smallDevider: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 0,
    marginBottom: 10,
  },
  setBorder: {
    borderRadius: 20,
    backgroundColor: BaseColor.primaryBlueColor,
    padding: 7,
  },
  setText: {
    color: BaseColor.whiteColor,
    marginLeft: 20,
    marginRight: 20,
  },
  saved: {
    flexDirection: "row",
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
  },
  customfont: { fontSize: 15 },
});
