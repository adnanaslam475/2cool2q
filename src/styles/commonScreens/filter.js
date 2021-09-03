import { StyleSheet } from "react-native";
import { BaseColor } from "common/color";
import { Dimensions } from "react-native";
export default StyleSheet.create({
  container: { flexDirection: "column", flex: 1 },
  filterView: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    marginLeft: -20,
  },
  selectFilter: { flexDirection: "row" },
  iconLogo: { width: 30, height: 20 },
  caltegoriesText: { marginTop: 20, color: BaseColor.primaryBlueColor },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 0,
    marginLeft: -20,
  },
  distanceContainer: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: -10,
    alignItems: "center",
  },
  iconBubble: { width: 43, height: 25 },
  kmText: {
    position: "absolute",
    fontSize: 12,
    left: 2,
    top: 1,
    fontWeight: "500",
  },
  slider: {
    width: Dimensions.get("window").width - 50,
    height: 40,
    marginTop: 0,
  },
  dimention: {
    alignItems: "flex-end",
    width: Dimensions.get("window").width - 50,
  },
});
