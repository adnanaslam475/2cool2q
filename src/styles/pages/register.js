import { StyleSheet } from "react-native";
import { BaseColor } from "../../common/color";
export default StyleSheet.create({
  keyBordView: { alignItems: "center" },
  nameField: { flexDirection: "row", alignItems: "center" },
  errorText: { 
    marginLeft: 10, 
    fontSize: 12, 
    fontStyle: 'italic', 
    fontWeight: "600",
    color: BaseColor.redColor 
  },
  errorTextBlack: { marginLeft: 10, color: BaseColor.blackColor },
  fieldPosition: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  buttonInforImage: { height: 15, width: 15, marginTop: 4, marginLeft: 6, },
  phoneContainer: { flexDirection: "row", marginTop: 10 },
  phoneView: { flex: 1, justifyContent: "center", marginLeft: 10 },
  sendOtpButton: { flex: 1, marginLeft: 0 },
  forgetPasswordPosition: { marginTop: 15 },
  forgetPasswordError: {
    textAlign: "center",
    color: BaseColor.primaryBlueColor,
  },
  forgetpasswordAction: { marginTop: 30 },
  marginTop20: { marginTop: 20 },
  margin5: { margin: 5 },
  errorWithBorder: {
    backgroundColor: BaseColor.whiteColor,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  mainVertical: { marginVertical: 0 },
  errorWithBorderText: {
    color: BaseColor.redColor,
    fontSize: 18,
    textAlign: "center",
    marginVertical: 20,
  },
  modalContainer: {
    alignSelf: "center",
  },
  closeIconSize: { width: 25, height: 25, marginBottom: 10 },
  errorWithBorderTextWhite: {
    color: BaseColor.whiteColor,
    fontSize: 18,
    textAlign: "center",
    marginVertical: 20,
  },
  setPasswordInfo: {
    alignSelf: "center",
    marginTop: 20,
  },
  mainModalContainer: {
    backgroundColor: BaseColor.whiteColor,
    margin: 0,
    left: 0,
    right: 0,
  },
  mainModelContaint: { marginVertical: 0, justifyContent: "flex-end", flex: 1 },
  // eslint-disable-next-line react-native/no-color-literals
  termsIcon: {
    width: 25,
    height: 25,
    marginBottom: 10,
    backgroundColor: "red",
  },
});
