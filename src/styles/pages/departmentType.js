import { StyleSheet } from "react-native";
import { BaseColor } from "common/color";
export default StyleSheet.create({
  mainContainer: { paddingLeft: 3 },
  boxShodowContainer: { marginVertical: 5 },
  boxShadowView: { marginTop: 2 },
  boxShadowContaint: { padding: 12 },
  queueListContainer: { flex: 1, alignItems: "flex-end", marginRight: 10 },
  queurListText: { color: BaseColor.redColor, alignSelf: "flex-end" },
  mainItemList: { flex: 1 },
  itemListContainer: { margin: 15 },
  flateList: { marginTop: 0, marginBottom: 0 },
  dportMain: { alignItems: "center" },
  listText: {
    marginTop: 30,
    color: BaseColor.redColor,
    backgroundColor: BaseColor.grayColor,
    padding: 50,
  },
});
