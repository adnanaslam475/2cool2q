import { StyleSheet } from "react-native";
import { BaseColor } from "common/color";
export default StyleSheet.create({
  mainView: { flexGrow: 1 },
  inputeContaine: {
    marginTop: 40,
  },
  inputeContainerView: { flexDirection: "row", alignItems: "center" },
  validationText: { marginLeft: 10, color: BaseColor.redColor },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  switchContainer: { flexDirection: "row", flex: 1 },
  remembermePosition: { marginLeft: 10 },
  forgotPasswordPosition: {
    flex: 1,
  },
  flex1: {
    flex: 1,
  },
  buttonContainer: { marginTop: 80 },
  marginTop20: {
    marginTop: 20,
  },
  socialLoginContainer: { flexDirection: "row", marginTop: 20 },
  googleLoginPosition: { flex: 1, marginLeft: 20 },
  modalContainer: {
    margin: 5,
  },
  modalView: {
    backgroundColor: BaseColor.whiteColor,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  modalVerticalView: { marginVertical: 0 },
  modalErrorText: {
    color: BaseColor.redColor,
    fontSize: 18,
    textAlign: "center",
    marginVertical: 20,
  },
  setError: { alignSelf: "center" },
  colseIcon: { width: 25, height: 25, marginBottom: 10 },
});
