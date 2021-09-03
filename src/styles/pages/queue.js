import { StyleSheet } from "react-native";
import { BaseColor } from "common/color";
import { Globals } from "../../config/globals";
export default StyleSheet.create({
  alignItemCenter: { alignItems: "center" },
  queueText: { marginTop: 30, color: BaseColor.redColor },
  queueTextRed: { marginTop: 10, color: BaseColor.redColor },
  mainContainer: { flex: 1 },
  selectDepartmentContainer: {
    flexDirection: "column",
    marginTop: 15,
    width: 150,
    borderRadius: 20,
    paddingLeft: 20,
    borderWidth: 1,
    borderColor: BaseColor.primaryBlueColor,
  },
  selectDepartmentView: { justifyContent: "center", marginTop: 10 },
  queueMarginLeft: { marginLeft: 0 },
  mainQueue: { justifyContent: "center", marginTop: 10 },
  estimateTime: {
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  mainOpenQueue: {
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 20,
    marginTop:
      Globals.selectedDepartment.isIn === 1 && Globals.isClosed === 0 ? 20 : 70,
  },
  openQueueContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  openQueueList: { flex: 1, alignItems: "flex-end" },
});
