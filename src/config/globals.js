import GetLocation from "react-native-get-location";

export const Globals = {
  userNo: 0,
  userName: "",
  userEmail: "",
  roomNo: 0,
  socketInst: null,
  connectedPlayers: 1,
  isBanker: false,
  previousPageStack: [],
  isBackClicked: false,
  selectedBusiness: { type: "" },
  allBusinessList: {},
  selectedDepartment: {},
  selectedSlot: {},
  selectedSlotId: -1,
  isBookChange: false,
  isInTime: 1,
  isClosed: 1,
  differentTime: 0,
  scanQrDepartmentId: 0,
  notification: 0,
  fcmKey: "",
};

export const MyLocation = {
  // Seven Dials - London
  lat: 51.513809,
  lng: -0.127031,
};

GetLocation.getCurrentPosition({
  enableHighAccuracy: true,
  timeout: 15000,
})
  .then((location) => {
    console.log("location ==========", location);
    // Temp location for v.1 - use GPS location for UK only, outside UK map set to Seven Dials location
    //if (
    // location.latitude <= 59 &&
    //  location.latitude >= 50 &&
    //  location.longitude <= -6 &&
    //  location.longitude >= 2.5
    //) {
      MyLocation.lat = location.latitude;
      MyLocation.lng = location.longitude;
    //}
  })
  .catch((error) => {
    const { code, message } = error;
    console.warn(code, message);
  });

/*
const unwantedRepetition = (str, chr, rep) =>{
 //return ((str.match(new RegExp(str, chr)) || []).length > rep);
 return ((str.match(/,/g) || []).length > rep);
}
*/

export const validateEmail = (email) => {
  const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
  return expression.test(String(email).toLowerCase());
};

// User Id regex rules
export const validateUserName = (username) => {
  // const expression = /^\S*.{6,}$/;
  const expression = /^[a-zA-Z0-9_.-]{6,20}$/;
  if ( username.length < 6 
    || username.length > 20 
    || !expression.test(username)
    || ((username.match(/\./g) || []).length > 3)
    || ((username.match(/-/g) || []).length > 3)
    || ((username.match(/_/g) || []).length > 3)) {
    return false;
  }
  return true;
};

// Validate password regex rules
export const validatePassword = (password) => {
  // var regularExpression = /^(?=.*\d)(?=.*[!@#$%^&*-_])(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
  var regularExpression = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
  
  return regularExpression.test(password);
};

// Validate verification code
export const validateCode = (code, originalCode) => {
  if (code.length === 6 && code?.toString() === originalCode?.toString()) {
    return true;
  }
  return false;
};

// Validate phone number regex rules
export const validatePhone = (phone) => {
  console.log("phone", phone);
  var regularExpression = /^[0-9]{7,12}$/;

  return regularExpression.test(phone);
};
