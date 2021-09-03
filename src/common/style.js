import { StyleSheet, Dimensions } from "react-native";
import { BaseColor } from "./color";

const primaryBlueColor = "#0d97df";
const whiteColor = "#fff";


const { width, height } = Dimensions.get('window')
export default StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  margin: { marginTop: height * 0.015 },
  loading: {
    marginBottom: -100,
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    opacity: 0.8,
    zIndex: 9999999999999999,
    elevation: 10,
  },
  loaderView: {
    width: 250,
    height: 60,
    backgroundColor: "#fff",
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  activityIndicator: {
    margin: 15,
  },
  loadingText: {
    fontSize: 14,
  },
  primaryFullBG: {
    flex: 1,
  },
  vwTopLogo: {
    height: 200,
    justifyContent: "center",
    width: "100%",
    alignItems: "center",
    backgroundColor: primaryBlueColor,
    padding: 30,
  },
  vwSearchlistMinimize: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  vwInputContainer: {
    marginTop: 20,
    width: "100%",
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 50,
  },
  itemImg: {
    width: 140,
    height: 120,
  },
  itemImgActivity: {
    width: 110,
    height: 105,
  },

  itemIcon: {
    width: 12,
    height: 12,
  },
  itemStarText: {
    color: primaryBlueColor,
    fontSize: 12,
    fontWeight: "400",
  },
  itemTimeText: {
    color: primaryBlueColor,
    fontSize: 12,
    fontWeight: "400",
  },

  itemTitle: {
    color: BaseColor.textColor,
    fontSize: 16,
    fontWeight: "bold",
  },
  itemDescription: {
    color: BaseColor.grayColor,
    fontSize: 14,
    fontWeight: "400",
  },
  imgTopLogo: {
    width: "100%",
    height: "100%",
  },
  primaryText: {
    color: BaseColor.textColor,
    fontSize: 16,
    fontWeight: "700",
  },
  marginpadding: {
    marginTop: -height * 0.02,
  },
  categoryTextNoBorder: {
    color: BaseColor.textColor,
    fontSize: 15,
    fontWeight: "500",
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 7,
    marginLeft: 20,
  },

  categoryText: {
    color: BaseColor.textColor,
    fontSize: 15,
    fontWeight: "500",
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 1,
    borderColor: BaseColor.blackColor,
    marginTop: 7,
    marginLeft: 20,
  },

  categoryTextSelected: {
    color: BaseColor.primaryBlueColor,
    fontSize: 15,
    fontWeight: "500",
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 1,
    borderColor: BaseColor.primaryBlueColor,
    marginTop: 7,
    marginLeft: 20,
  },

  secondaryText: {
    color: BaseColor.textColor,
    fontSize: 14,
    fontWeight: "500",
  },
  width: { width: width * 0.89, bottom: height*0.01, },
  primaryInput: {
    marginTop: 10,
    borderColor: BaseColor.borderColor,
    borderWidth: 1,
    borderStyle: "solid",
    color: "#495057",
    fontSize: 16,
    fontWeight: "400",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 6,
    paddingBottom: 6,
  },

  vwRightAlign: {
    width: "100%",
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  primaryLightText: {
    color: "#b5b5b5",
    fontSize: 16,
    fontWeight: "400",
  },
  primaryBtn: {
    backgroundColor: primaryBlueColor,
    paddingLeft: 30,
    paddingRight: 30,
    borderRadius: 30,
    height: 40,
    justifyContent: "center",
    alignContent: "center",
  },
  secondaryBtn: {
    backgroundColor: primaryBlueColor,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    alignContent: "center",
  },

  primaryEmptyBtn: {
    flexDirection: "row",
    borderColor: primaryBlueColor,
    borderWidth: 1,
    paddingLeft: 30,
    paddingRight: 30,
    borderRadius: 30,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  borderColorGray: {
    borderColor: BaseColor.borderColor,
  },
  colorGray: {
    color: "#495057",
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },

  btnTextEmpty: {
    color: primaryBlueColor,
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    flex: 1,
  },

  separator: {
    height: 1,
    backgroundColor: "#b9b7b7",
    marginTop: 20,
  },
  tabTextActive: {
    color: whiteColor,
    marginTop: 5,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
  },
  tabText: {
    color: primaryBlueColor,
    marginTop: 5,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
  },
  tabButton: {
    flex: 1,
    paddingTop: 10,
    alignItems: "center",
  },
  topVw: {
    paddingTop: 25,
    flexDirection: "row",
    height: 83,
    width: "100%",
    alignItems: "center",
    backgroundColor: primaryBlueColor,
    zIndex: 1,
  },
  imgTopIcon: {
    width: 25,
    height: 25,
  },
  menuImageIcon: {
    width: 20,
    height: 20,
  },
  topbarTitle: {
    color: whiteColor,
    fontSize: 25,
    fontWeight: "bold",
  },
  menuVw: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    marginTop: 10,
  },
  menuText: {
    color: primaryBlueColor,
    marginLeft: 16,
    fontSize: 20,
    fontWeight: "600",
  },
  titleVw: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  centerParent: {
    justifyContent: "center",
    alignItems: "center",
  },
  lblTitle: {
    fontSize: 35,
    fontWeight: "bold",
  },
  lblInput: {
    color: "#555",
    fontSize: 14,
  },
  vwInput: {
    borderRadius: 10,
    borderColor: "#ccc",
    padding: 10,
    borderWidth: 1,
  },
  lblLogo: {
    fontSize: 16,
    fontWeight: "bold",
  },

  disableBtn: {
    backgroundColor: "#64626d",
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 30,
    height: 60,
    justifyContent: "center",
    alignContent: "center",
  },

  darkText: {
    color: "#2F2E35",
    fontSize: 18,
    textAlign: "center",
  },
  whiteText: {
    fontSize: 16,
    color: "#D9D8D6",
    fontWeight: "normal",
  },
  whiteBold: {
    fontSize: 16,
    color: "#D9D8D6",
    fontWeight: "bold",
  },

  separatorPrimary: {
    height: 1,
    backgroundColor: "#FF8136",
    marginTop: 10,
  },
  separatorBlack: {
    height: 1,
    backgroundColor: "#2F2E35",
    marginTop: 4,
    marginBottom: 4,
  },
  btnVw: {
    width: 50,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  bottomTab: {
    height: 63,
    flexDirection: "row",
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imgTabIcon: {
    width: 40,
    height: 40,
  },
  imgTabIcon30: {
    width: 20,
    height: 20,
  },
  divider: {
    backgroundColor: BaseColor.lightGrey,
    height: 1,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 5,
    marginBottom: 5,
  },
  locationItem: {
    flexDirection: "row",
    marginTop: 10,
    marginLeft: 5,
  },
  circle_button: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    marginTop: 10,
    width: 49,
    height: 49,
    borderRadius: 25,
  },
  icon_box: {
    backgroundColor: BaseColor.whiteColor,
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 3, // TODO this margin shouldn't be here. Requires refactor in the whole app
    borderRadius: 3,
  },
  icon_box_clicked: {
    backgroundColor: BaseColor.primaryBlueColor,
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 3,
    borderRadius: 3,
  },
  card_bg: {
    flexDirection: "row",
    height: 120,
    alignItems: "center",
    backgroundColor: BaseColor.whiteColor,
    marginTop: 2,
    borderRadius: 3,
  },
  card_type_bg: {
    flexDirection: "row",
    height: 45,
    alignItems: "center",
    backgroundColor: BaseColor.whiteColor,
    marginTop: 1,
    borderRadius: 3,
  },
  dialog_title: {
    fontSize: 18,
    color: BaseColor.primaryBlueColor,
    marginLeft: 10,
    marginTop: 10,
  },
  open_time_header: {
    fontSize: 16,
    color: BaseColor.blackColor,
    marginLeft: 20,
    marginTop: 10,
    width: 100,
  },
  open_time: {
    fontSize: 16,
    color: BaseColor.blackColor,
    marginLeft: 20,
    marginTop: 10,
  },
  // TODO remove `sign` after refactoring all usages. Replaced by IconButton component
  sign: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 17,
    borderColor: BaseColor.primaryBlueColor,
  },
  notification: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: "red",
    color: BaseColor.whiteColor,
    borderColor: BaseColor.primaryBlueColor,
  },
  counter: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    color: BaseColor.primaryBlueColor,
    fontWeight: "500",
  },

  starContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  flag: {
    height: 20,
    width: 30,
  },
  businessBottom: {
    flexDirection: "row",
    marginTop: 10,
  },
  cardContainer: {
    flex: 1,
    marginLeft: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
  modalHeader: {
    color: primaryBlueColor,
    fontSize: 18,
    textAlign: "center",
    marginVertical: 20,
  },
  itemPasswordTerm: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  passwordTerm: {
    fontSize: 15,
    color: "#000",
    marginStart: 10,
  },
  passwordTermDot: {
    height: 5,
    width: 5,
    backgroundColor: primaryBlueColor,
    borderRadius: 30,
  },
  flagContainer: {
    width: 80,
    borderColor: "#707070",
    borderWidth: 1,
    flexDirection: "row",
    height: 40,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: BaseColor.whiteColor,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  infoIcon: {
    height: 20,
    width: 20,
  },
  countryCode: {
    textAlign: "center",
    fontSize: 16,
    marginStart: 5,
  },
  textInputMargin: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  whiteColor: {
    color: whiteColor,
  },
  title: {
    color: BaseColor.textColor,
    fontSize: 18,
    fontWeight: "700",
  },
});
