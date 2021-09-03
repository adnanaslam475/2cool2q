import { StyleSheet } from "react-native";
export default StyleSheet.create({
  // eslint-disable-next-line react-native/no-color-literals
  ratingContainer: {
    backgroundColor: "transparent",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  // eslint-disable-next-line react-native/no-color-literals
  reviewText: {
    fontSize: 25,
    fontWeight: "bold",
    margin: 10,
    color: "rgba(230, 196, 46, 1)",
  },
  starContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
