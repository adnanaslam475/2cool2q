import React, { useState, useEffect, useRef } from "react";
import {
  ScrollView,
  KeyboardAvoidingView,
  View,
  Image,
  Text,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import Modal from "react-native-modal";
import { Input as TextInput, Picker } from "native-base";
import styles from "../../common/style";
// import RNFetchBlob from "rn-fetch-blob";
import { Globals, validateCode, validateEmail, validatePhone } from "../../config/globals";
import DefaultPreference from "react-native-default-preference";
import { BaseColor } from "../../common/color";
import { Constants } from "../../config/constants";
import {
  loadProfile,
  otp,
  updateProfile,
  updateProfile2,
  removeProfile
} from "../../service/user";
import Topbar from "../../component/topbar";
import ImagePicker from "react-native-image-picker";
import Toast from "react-native-simple-toast";
import PhoneTextInput from "component/PhoneTextInput";
import { getCountry } from "service/country";
import { ActivityIndicator } from "react-native-paper";
import { getAllCountries } from "react-native-country-picker-modal";
import Styles from "../../styles/pages/setting";
import { EDITICON, BUTTONDONE, CloseIcon } from "../../assets/index";
import { TextButtonFilledColor } from "../../component/textButton";

let _data;
var dataset = [];

const { width, height } = Dimensions.get('window')
export default function SettingScreen(props) {
  const [userInfo, setUserInfo] = useState({});
  const [language, setLanguage] = useState([]);
  const [errInfo, setError] = useState({ isActive: false, msg: "" });
  const [removeprofile, setremoveprofile] = useState({ open: false, msg: "" })
  const [email, setEmail] = useState("");
  const [vaccinelink, setVaccinelink] = useState("");
  const [prefix, setPrefix] = useState("+44");
  const [cca2, setCca2] = useState("GB");
  const [phone, setPhone] = useState("");
  const [lanId, setLanId] = useState("");
  const [countryId, setCountryId] = useState("");
  const [sms, setSms] = useState("0");
  const [notification, setNotification] = useState("0");
  const [vibration, setVibration] = useState("0");
  const [enabled, setenabled] = useState(false);
  const [sound, setSound] = useState("0");
  const [avatarSource, setAvatarSource] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [prefixList, setPrefixList] = useState([]);
  const [verificationCode, setVerification] = useState("");
  const [code, setCode] = useState("");
  const [isPhoneChanged, setPhoneChanged] = useState(false);
  const [oldPhone, setOldPhone] = useState(false);
  const [isChanged, setisChanged] = useState(false);
  const [isSent, setSent] = useState(false);
  const [isInvalidEmail, setInvalidEmail] = useState({
    isActive: false,
    msg: "",
  });
  const [isInvalidUrl, setInvalidUrl] = useState({
    isActive: false,
    msg: "",
  });
  const [isInvalidCode, setInvalidCode] = useState({
    isActive: false,
    msg: "",
  });
  const [isInvalidPhone, setInvalidPhone] = useState({
    isActive: false,
    msg: "",
  });
  const [iInfo, setIndicator] = useState({
    isActive: false,
    msg: "Signing User...",
  });
  const [stateEnable, setStateEnable] = useState({
    profileEnable: false,
    emailEnable: false,
    phoneEnable: false,
    languageEnable: false,
    countryEnable: false,
  });
  const opacity = 0.4;
  const pickerRef = useRef();

  const options = {
    title: "Select Avatar",
    storageOptions: {
      skipBackup: true,
      path: "images",
    },
  }


  // const toggleEnableDisable = (updatedState) => {
  //   stateEnable[`${updatedState}`] = !stateEnable[`${updatedState}`];
  //   setStateEnable({ ...stateEnable });
  // };

  useEffect(() => {
    callProfile();
    DefaultPreference.getMultiple(["sms", "notification", "vibration", "sound"])
      .then(function (values) {
        if (
          values[0] != null &&
          values[1] != null &&
          values[2] != null &&
          values[2] != null
        ) {
          setSms(values[0]);
          setNotification(values[1]);
          setVibration(values[2]);
          setSound(values[3]);
        }
      })
      .catch((err) => { });
  }, []);

  goBack = () => {
    Globals.isBackClicked = true;
    props.changeContentPage(Constants.TAB_SEARCH_PAGE);
  };

  useEffect(() => {
    loadCountry();
  }, []);

  const loadCountry = () => {
    let params = {
      name: "",
    };

    getCountry(params)
      .then((res) => {
        if (res.status === 200) {
          dataset = [];
          for (var i = 0; i < res.country.length; i++) {
            var tmp = {
              label: res.country[i].COUNTRY_code,
              value: res.country[i].COUNTRY_ID,
              name: res.country[i].COUNTRY_name,
            };
            dataset.push(tmp);
          }
          setPrefixList(dataset);
        } else {
        }
      })
      .catch((err) => {
      });
  };

  const showImagePicker = () => {
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
      } else if (response.error) {
      } else if (response.customButton) {
      } else {
        //const source = { uri: response.uri };
        // You can also display the image using data:
        const source = { uri: "data:image/jpeg;base64," + response.data };
        setAvatarSource(source);
        _data = response;
      }
    });
  };

  const callProfile = async () => {
    const list = await getAllCountries();
    DefaultPreference.getMultiple(["user_id"])
      .then(function (values) {
        if (values[0] != null) {
          let params = {
            login_id: values[0],
          };
          loadProfile(params)
            .then((res) => {
              if (res.status === 200) {
                // console.log('user---------->',res.user);
                const phone = res.user?.phone;
                const cca1 = res.user?.cca2 != null ? res.user?.cca2 : "GB";
                setUserInfo(res.user);
                setLanguage(res.language);
                setEmail(res.user.email);
                setVaccinelink(res.user.vaccinelink);
                try {
                  // TODO: Change this to validate all pssible numbers. different size of numbers, different size
                  const phoneWithoutPref = phone?.substr(
                    phone.indexOf(" ") + 1
                  );
                  const phoneWithPref = phone?.substring(0, phone.indexOf(" "));
                  const callingCode = phone?.substring(1, phone.indexOf(" "));
                  const cca2 = list.find((c) => {
                    return c.callingCode[0] === callingCode && c.cca2 === cca1;
                  });
                  setCca2(cca2.cca2);
                  setOldPhone(phoneWithoutPref);
                  setPrefix(phoneWithPref);
                  setPhone(phoneWithoutPref);
                } catch (error) {
                  setError({
                    isActive: true,
                    msg: error?.message,
                  });
                }
                setLanId(res.user.lan_id);
                setCountryId(res.user.country_id);
                setAvatarUrl(res.user.photo_url);
              } else {
                console.log("apparent error - res=", res);
              }
            })
            .catch((_err) => { });
        }
      })
      .catch((_err) => { });
  };

  // const saveSetting = (s, n, v, so) => {
  //   DefaultPreference.setMultiple({
  //     sms: s,
  //     notification: n,
  //     vibration: v,
  //     sound: so,
  //   });
  // };


  useEffect(() => {
    if (vaccinelink?.trim().length) {
      if (vaccinelink.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)) {
        setInvalidUrl({ isActive: false, msg: "" });
      } else {
        setInvalidUrl({ isActive: true, msg: "Invalid" });
      }
    }
  }, [vaccinelink])

  const callUpdateProfile = async () => {
    // console.log('updatecall');
    await DefaultPreference.getMultiple(["cprofile_id"]);
    if (!checkValidation() || !checkVerificationCode()) {
      return;
    }
    DefaultPreference.getMultiple(["cprofile_id"])
      .then(function (values) {
        setIndicator({ isActive: true, msg: "Updating profile..." });
        if (values[0] != null) {
          console.log('values-->', values)
          // TOD: PREFIX does not have value
          var params = {
            lan_id: lanId,
            phone: prefix + " " + phone,
            email: email,
            vaccinelink,
            country_id: countryId,
            cprofile_id: values[0],
            cca2: cca2,
          };
          if (_data != null) {
            _data.fileName = _data.uri.substring(_data.uri.lastIndexOf("/"));
            updateProfile(params, _data)
              .then((res) => {
                setIndicator({ isActive: false, msg: "" });
                if (res.status === 200) {
                  Toast.show(" Profile saved successfully 1", Toast.SHORT, [
                    "UIAlertController",
                  ]);
                  if (isChanged) {
                    props.logout();
                  }
                }
              })
              .catch((_err) => {
                setIndicator({ isActive: false, msg: "" });
                setError({ isActive: true, msg: "Failed to update profile" });
              });
          } else {
            updateProfile2(params)
              .then((res) => {
                setIndicator({ isActive: false, msg: "" });
                if (res.status === 200) {
                  Toast.show("Profile saved successfully ", Toast.SHORT, [
                    "UIAlertController",
                  ]);
                  if (isChanged) {
                    props.logout();
                  }
                } else if (res.status === 300) {
                  if (res.msg === "Phone number already in use") {
                    setInvalidPhone({ isActive: true, msg: "Invalid" });
                  }
                  if (res.msg === "Email already in use") {
                    setInvalidEmail({ isActive: true, msg: "Invalid" });
                  }
                  if (res.msg === "Account already exists") {
                    setInvalidEmail({ isActive: true, msg: "Invalid" });
                  }
                  setError({ isActive: true, msg: res.msg });
                } else {
                  Toast.show("Fail to update profile", Toast.SHORT, [
                    "UIAlertController",
                  ]);
                  setError({
                    isActive: true,
                    msg: "Failed to update profile2",
                  });
                }
              })
              .catch((err) => {
                setIndicator({ isActive: false, msg: "" });
                setError({ isActive: true, msg: "Failed to update profile3" });
              });
          }
        }
      })
      .catch((_err) => {
        setError({ isActive: true, msg: "Failed to update profile4" });
      });
  };

  const checkValidation = () => {
    var value = true;

    if (email === "" || !validateEmail(email)) {
      //setError({isActive:true,msg:"Please fill email"});
      setInvalidEmail({ isActive: true, msg: "Invalid" });
      value = false;
    } else {
      setInvalidEmail({ isActive: false, msg: "" });
    }

    if (!validatePhone(phone)) {
      //setError({isActive:true,msg:"Please fill phone"});
      setInvalidPhone({ isActive: true, msg: "Invalid" });
      value = false;
    } else {
      setInvalidPhone({ isActive: false, msg: "" });
    }
    return value;
  };

  const checkVerificationCode = () => {
    var value = true;
    if (isPhoneChanged) {
      if (!validateCode(verificationCode, code)) {
        setInvalidCode({ isActive: true, msg: "Invalid" });
        value = false;
        return;
      } else {
        setInvalidCode({ isActive: false, msg: "" });
      }
    } else {
      setInvalidPhone({ isActive: false, msg: "" });
    }
    return value;
  };

  const sendOtp = () => {
    setisChanged(true);
    let params = {
      phone: prefix + phone,
    };

    if (checkValidation()) {
      otp(params)
        .then((res) => {
          if (res.status === 200) {
            setSent(true);
            setCode(res.code.toString());
            // Set verification code was for testing purposes
            setVerification(res.code.toString());
            Toast.show("Code sent successfully", Toast.SHORT, [
              "UIAlertController",
            ]);
          } else {
            setError({ isActive: true, msg: res.msg });
          }
        })
        .catch(() => { });
    }
  };

  const onChangeLanguageVal = (value) => {
    setLanId(value);
    setisChanged(true);
  };

  async function removeprofileHandler() {
    DefaultPreference.getMultiple(["cprofile_id"])
      .then(function (values) {
        let params = {
          cprofile_id: values[0]
        }
        removeProfile(params)
          .then(res => {
            if (res.success == true) {
              console.log('here410')
              props.logout();
            }
          }).catch(e => {
            Alert.alert('something went wrong');
          })
      })
      .catch(err => {
        Alert.alert('something went wrong');
      })
  }

  return (
    <View style={Styles.mainContainer}>
      <Topbar {...this} />
      <ScrollView
        keyboardShouldPersistTaps="always"
        style={styles.primaryFullBG}
      >
        <KeyboardAvoidingView
          style={[styles.primaryFullBG, Styles.keyBordStyle]}
        >
          <View style={Styles.SettingTextContainer}>
            <Text style={[styles.itemTitle, styles.title]}>Settings</Text>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => {
                showImagePicker();
              }}
            >
              <View style={Styles.imageContainer}>
                {avatarSource === null &&
                  (avatarUrl === null || avatarUrl === "") && (
                    <Image
                      style={[
                        Styles.imageSize,
                        // eslint-disable-next-line react-native/no-inline-styles
                        {
                          opacity: stateEnable.profileEnable ? 1 : opacity,
                        },
                      ]}
                      source={require("../../assets/2c2q-new-logo.png")}
                    />
                  )}
                {avatarSource != null && (
                  <Image f20 style={Styles.imageSize} source={avatarSource} />
                )}
                {avatarUrl != null && avatarUrl !== "" && avatarSource == null && (
                  <Image
                    style={Styles.imageSize}
                    source={{
                      uri:
                        Constants.Backend_Server_Address +
                        "/images/" +
                        avatarUrl,
                    }}
                  />
                )}
                <Image style={Styles.editIcon} source={EDITICON} />
              </View>
            </TouchableOpacity>
          </View>
          <Text style={[styles.primaryText, Styles.userNamePosition]}>
            {userInfo.username}
          </Text>
          <View style={{ ...styles.vwInputContainer, }}>
            <View style={{ ...Styles.emailContainer }}>
              <Text style={styles.primaryText}>Email Address</Text>
              <View style={{
                ...Styles.updateButonContainer,
                margin: height * 0.03, marginRight: 0
              }}>
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    bottom: -height * 0.02,
                  }}
                  onPress={() => {
                    setenabled(!enabled)
                  }}>
                  <Image
                    style={{
                      ...styles.circle_button,

                    }}
                    source={EDITICON}
                    resizeMode="stretch"
                  />
                </TouchableOpacity>
              </View>
              {isInvalidEmail.isActive && (
                <Text style={[styles.primaryText, Styles.validationError]}>
                  - {isInvalidEmail.msg}
                </Text>
              )}
            </View>
            <TextInput
              style={[
                enabled && styles.primaryInput,
                {
                  borderColor: isInvalidEmail.isActive
                    ? BaseColor.redColor
                    : BaseColor.borderColor,
                  marginTop: 10,
                  width: width * 0.89,
                  height: 40,
                  opacity: enabled ? 1 : 0.5
                },
              ]}
              value={email}
              editable={enabled}
              onChangeText={(text) => {
                setisChanged(true);
                setEmail(text);
              }}
              placeholder={"Email Address"}
            />
            <View>
              <PhoneTextInput
                pickerProps={{
                  pickerRef: pickerRef,
                  value: prefix,
                  title: "Select country code",
                  items: prefixList,
                }}
                isEnable={true}
                enabled={enabled}
                isInvalidPhone={isInvalidPhone}
                onCodeChanged={(value) => {
                  setPrefix(`+${value.callingCode[0]}`);
                  setCca2(value.cca2);
                }}
                callingCode={prefix}
                cca2={cca2}
                onPickerOpen={() => pickerRef.current?.show()}
                textInputProps={{
                  placeholder: "Phone",
                  value: phone,
                  onChangeText: (text) => {
                    setPhone(text);
                    setCode("");
                    setVerification("");
                    if (oldPhone !== prefix + text) {
                      setPhoneChanged(true);
                    } else {
                      setPhoneChanged(false);
                    }
                  },
                }}
              />
            </View>
            {isPhoneChanged && (
              <View>
                <View style={Styles.verificationContainer}>
                  <Text style={styles.primaryText}>Verification Code</Text>
                  {isInvalidCode.isActive && (
                    <Text style={[styles.primaryText, Styles.validationError]}>
                      {" "}
                      - {isInvalidCode.msg}
                    </Text>
                  )}
                </View>
                <View style={{ ...Styles.VerificationErrorContainer }}>
                  {isSent === false && (
                    <TextButtonFilledColor
                      onPress={() => sendOtp()}
                      style={Styles.sendOtpBtn}
                      text="Send Code"
                    />
                  )}
                  {isSent === true && (
                    <TextButtonFilledColor
                      onPress={() => sendOtp()}
                      style={Styles.sendOtpBtn}
                      text="Resend Code"
                    />
                  )}
                  <View style={Styles.verfyContainer}>
                    <TextInput
                      style={[
                        enabled && styles.primaryInput,
                        // eslint-disable-next-line react-native/no-inline-styles
                        {
                          borderColor: isInvalidCode.isActive
                            ? BaseColor.redColor
                            : BaseColor.borderColor,
                          marginTop: 0,
                          width: 160,
                          height: 40,
                          marginLeft: 14,
                        },
                      ]}
                      placeholder="Verification Code"
                      keyboardType="number-pad"
                      value={verificationCode}
                      maxLength={6}
                      editable={enabled}
                      onChangeText={(text) => setVerification(text)}
                      returnKeyType="done"
                    />
                  </View>
                </View>
              </View>
            )}
            <View>
              <Text style={{
                ...styles.primaryText, marginTop: height * 0.019,
                marginBottom: 5
              }}>
                Language
              </Text>
            </View>
            <View style={[
              Styles.languageContainer,
              styles.width,
              enabled ? styles.primaryInput : null,
            ]}>
              <Picker
                enabled={enabled}
                selectedValue={lanId}
                placeholderIconColor='red'
                placeholderStyle={{ borderWidth: 2, width: width }}
                style={{
                  ...styles.primaryInput,
                  ...Styles.pickerSelection, width: width * 0.85,
                  marginTop: -height * 0.01
                }}
                textStyle={BaseColor.whiteColor}
                onValueChange={(itemValue, itemIndex) => onChangeLanguageVal(itemValue)}>
                {language.map((object, i) => {
                  return (
                    <Picker.Item
                      label={object.LANG_name}
                      key={i}
                      value={object.LANG_ID}
                    />
                  );
                })}
              </Picker>
            </View>
            <Text style={{ ...styles.primaryText, marginTop: 4 }}>
              Country
            </Text>
            <View style={[Styles.countrySelection, enabled ? styles.primaryInput : null,
            styles.margin]}>
              <Picker
                enabled={enabled}
                selectedValue={countryId}
                style={{
                  ...styles.primaryInput, ...Styles.pickerSelection,
                  width: width * 0.85,
                  marginTop: -height * 0.01
                }}
                textStyle={BaseColor.whiteColor}
                onValueChange={(itemValue, itemIndex) => setCountryId(itemValue)}
              >
                {prefixList.map((object, i) => {
                  return (
                    <Picker.Item
                      label={object.name}
                      key={i}
                      value={object.value}
                    />
                  );
                })}
              </Picker>
            </View>
            <View >
              <Text style={{ ...styles.primaryText, marginTop: enabled ? height * 0.02 : height * 0.01 }}>
                Vaccine passport link
              </Text>
              {!isInvalidUrl.isActive && (
                <Text style={[styles.primaryText, Styles.validationError,
                styles.marginpadding]}>
                  {isInvalidUrl.msg}
                </Text>)}
            </View>
            <View style={{ ...Styles.updateButonContainer, marginTop: height * 0.045 }}>
              <TextInput
                style={[
                  enabled && styles.primaryInput,
                  Styles.vaccineinpmargin,
                  {
                    borderColor: isInvalidUrl.isActive
                      ? BaseColor.redColor
                      : BaseColor.borderColor,
                    width: width * 0.89,
                    height: 40,
                    opacity: enabled ? 1 : 0.5
                  },
                ]}
                onBlur={() => !vaccinelink?.trim().length && setInvalidUrl({ isActive: false, msg: '' })}
                value={vaccinelink}
                editable={enabled}
                onChangeText={(text) => {
                  setisChanged(true);
                  setVaccinelink(text);
                }}
                placeholder={"https://www.google.com.pk"}
              />
            </View>
            <View style={Styles.updateButonContainer}>
              <TouchableOpacity
                onPress={() => {
                  setenabled(!enabled)
                  callUpdateProfile();
                }}
              >
                <Image
                  style={styles.circle_button}
                  source={BUTTONDONE}
                  resizeMode="stretch"
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => setremoveprofile({
              open: true,
              msg: 'We are sorry to see you leave. You can always welcome back'
            })}>
              <Text style={{ color: 'red' }}>Remove profile</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
      <Modal
        style={Styles.modalMainContainer}
        onBackdropPress={() => setremoveprofile({ open: false, msg: '' })}
        onBackButtonPress={() => setremoveprofile({ open: false, msg: '' })}
        backdropColor={BaseColor.whiteColor}
        isVisible={errInfo.isActive || removeprofile.open}
      >
        <View style={Styles.modalContainer}>
          <View style={Styles.modalVertical}>
            <Text style={Styles.modalError}>{errInfo.msg || removeprofile.msg}</Text>
            <TouchableOpacity
              style={Styles.setError}
              onPress={() => setError({ isActive: false, msg: "" })}
            >
              {removeprofile.open ? <View style={{ flexDirection: 'row', }}>
                <TouchableOpacity style={{ marginRight: width * 0.1 }}
                  onPress={() => setremoveprofile({ open: false, msg: '' })}>
                  <Text>No</Text></TouchableOpacity>
                <TouchableOpacity onPress={removeprofileHandler}>
                  <Text>Yes</Text></TouchableOpacity></View> : <Image
                style={Styles.closeIcon}
                source={CloseIcon}
                resizeMode="contain"
              />}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {
        iInfo.isActive === true && (
          <View style={styles.loading}>
            <View style={styles.loaderView}>
              <ActivityIndicator
                color={BaseColor.whiteColor}
                style={styles.activityIndicator}
              />
              <Text style={styles.loadingText}>{iInfo.msg}</Text>
            </View>
          </View>
        )
      }
    </View >
  );
}
