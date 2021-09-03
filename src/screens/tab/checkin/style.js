import { Dimensions, StyleSheet } from "react-native";
import { BaseColor } from "../../../common/color";

export default StyleSheet.create({
  title: {
    fontSize: 16,
    color: BaseColor.blackColor,
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
  },

  description: {
    fontSize: 14,
    color: BaseColor.grayColor,
    fontWeight: "500",
  },
  sign: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    borderColor: BaseColor.primaryBlueColor,
  },

  icon: {
    width: 20,
    height: 20,
  },

  icon2: {
    width: 20,
    height: 17,
  },

  time_circle: {
    width: (Dimensions.get("window").width - 110) / 3,
    height: (Dimensions.get("window").width - 110) / 3,
    borderWidth: 5,
    borderColor: BaseColor.whiteColor,
    backgroundColor: BaseColor.primaryBlueColor,
    borderRadius: 49,
    alignItems: "center",
    justifyContent: "center",
  },
  time_circle_clicked: {
    width: (Dimensions.get("window").width - 110) / 3 + 10,
    height: (Dimensions.get("window").width - 110) / 3 + 10,
    borderWidth: 5,
    borderColor: BaseColor.whiteColor,
    backgroundColor: BaseColor.primaryBlueColor,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 0,
  },

  time_circle_title: {
    fontSize: 12,
    color: BaseColor.whiteColor,
    fontWeight: "500",
  },
  time_circle_title_clicked: {
    fontSize: 16,
    color: BaseColor.whiteColor,
    fontWeight: "800",
  },
  container: {
    flex: 1,
  },
  mainView: { margin: 25 },
  checkInContainer: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center",
  },
  openCheckIn: { flex: 1, alignItems: "flex-end" },
});
