import { Dimensions, StyleSheet } from "react-native";
import { BaseColor } from "common/color";

const { width, height } = Dimensions.get('window')
export default StyleSheet.create({
  mainContainer: { flexDirection: "column", flex: 1 },
  keyBordStyle: {
    alignItems: "center",
    backgroundColor: BaseColor.mainBackgroundTh,
  },
  imageContainer: { alignItems: "center" },
  imageSize: { width: 100, height: 100, borderRadius: 50 },
  editIcon: {
    width: 30,
    height: 30,
    position: "absolute",
    right: 0,
  },
  userNamePosition: { marginTop: 10 },
  emailContainer: { flexDirection: "column-reverse", },
  validationError: {
    marginLeft: 10,
    marginTop: 2,
    color: BaseColor.redColor,
    fontSize: 12,
    fontStyle: 'italic',
    fontWeight: "600",
  },
  verificationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  VerificationErrorContainer: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
  },
  verfyContainer: { flex: 1, justifyContent: "center" },
  sendOtpBtn: {
    flex: 1,
    marginLeft: 0,
  },
  marginTop20: {
    marginTop: 10,
    marginBottom: 5
  },
  vaccinemargin: { marginTop: 0 },
  vaccineinpmargin: { marginTop: -height * 0.038 },
  languageContainer: {
    flexDirection: "row",
    height: 40,
    marginTop: 10,
  },
  pickerContainer: { marginTop: -6 },
  pickerSelection: {
    marginTop: 0, width: 340,
    height: 40, borderRadius: 0
  },
  countrySelection: {
    flexDirection: "row",
    height: 40,
    marginTop: 10,
  },
  updateButonContainer: {
    flex: 1, marginTop: 10,
    alignItems: "flex-end"
  },
  modalMainContainer: { margin: 5 },
  modalContainer: {
    backgroundColor: BaseColor.whiteColor,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  modalVertical: { marginVertical: 0 },
  modalError: {
    color: BaseColor.redColor,
    fontSize: 18,
    textAlign: "center",
    marginVertical: 20,
  },
  setError: { alignSelf: "center" },
  closeIcon: { width: 25, height: 25, marginBottom: 10 },
  SettingTextContainer: { width: "100%", padding: 30 },
});
