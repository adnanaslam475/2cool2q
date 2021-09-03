import React, { useState, useEffect, useRef, useContext } from "react";
import {
  ScrollView,
  KeyboardAvoidingView,
  View,
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "react-native";
import styles from "../../common/style";
import { serviceRegister, otp } from "../../service/user";
import { getCountry } from "../../service/country";
import Modal from "react-native-modal";
import {
  Globals,
  validateUserName,
  validateEmail,
  validatePassword,
  validateCode,
  validatePhone,
} from "../../config/globals";
import DefaultPreference from "react-native-default-preference";
import Switch from "react-native-switch-pro";
import Toast from "react-native-simple-toast";
import { BaseColor } from "../../common/color";
import { SocketDataContext } from "providers/socket-data";
import PhoneTextInput from "component/PhoneTextInput";
import { Constants } from "config/constants";
import Styles from "../../styles/pages/register";
import { LogoImage, BUTTONINFO, CloseIcon } from "../../assets/index";
import { TextButtonFilledColor } from "component/textButton";
import { TextButtonOutline } from "component/textButton";
var dataset = [];
export default function RegisterScreen(props) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { reconnectSocket } = useContext(SocketDataContext);
  const [email, setEmail] = useState("");
  const [isUserNameInfo, setUserNameInfo] = useState(false);															
  const [isPasswordInfo, setPasswordInfo] = useState(false);
  const [prefix, setPrefix] = useState("+44");
  const [phone, setPhone] = useState("");
  const [isSent, setSent] = useState(false);
  const [isTerm, setTerm] = useState(false);
  const [isForgotPass, setForgotPass] = useState(false);
  const [isClickedTerm, setClickedTerm] = useState(false);
  const [iInfo, setIndicator] = useState({
    isActive: false,
    msg: " Signing User... ",
  });
  const [errInfo, setError] = useState({ isActive: false, msg: "" });
  const [info, setInfo] = useState({ isActive: false, msg: "" });
  const [verificationCode, setVerification] = useState("");
  const [code, setCode] = useState("");
  const [prefixList, setPrefixList] = useState([]);

  const [isInvalidName, setInvalidName] = useState({
    isActive: false,
    msg: "",
  });
  const [isInvalidPassword, setInvalidPassword] = useState({
    isActive: false,
    msg: "",
  });
  const [isInvalidEmail, setInvalidEmail] = useState({
    isActive: false,
    msg: "",
  });
  const [isInvalidPhone, setInvalidPhone] = useState({
    isActive: false,
    msg: "",
  });
  const [isInvalidCode, setInvalidCode] = useState({
    isActive: false,
    msg: "",
  });
  const [isClickCreate, setClickCreate] = useState(false);
  const usernameBox = useRef();
  const emailBox = useRef();
  const passwordBox = useRef();
  const phoneNumberBox = useRef();
  const codeBox = useRef();
  const pickerRef = useRef();
  const [cca2, setCca2] = useState("GB");

  useEffect(() => {
    // loadCountry();
  }, []);

  const openForgotPassword = () => {
    props.navigation.navigate("ForgotPassword");
  };

  const loadCountry = () => {
    let params = {
      name: "",
    };

    getCountry(params)
      .then((res) => {
        // console.log(res);
        if (res.status === 200) {
          dataset = [];
          for (var i = 0; i < res.country.length; i++) {
            if (i === 0) {
              setPrefix(res.country[i].COUNTRY_code);
            }
            var tmp = {
              label: res.country[i].COUNTRY_code,
              value: res.country[i].COUNTRY_ID,
              flag: res.country[i].COUNTRY_flag_uri,
            };
            dataset.push(tmp);
          }
          setPrefixList(dataset);
        } else {
          console.log(res);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const checkValidation = () => {
    var value = true;

    if (userName === "") {
      // setError({isActive:true,msg:"Please fill username"});
      setInvalidName({ isActive: true, msg: "Required" });
      // console.log(isInvalidName);
      value = false;
    } else {
      if (!validateUserName(userName)) {
        //setError({isActive:true,msg:"User name should be short than 30 length and does not include digital."});
        setInvalidName({ isActive: true, msg: "Invalid. Press 'i' for info" });
        value = false;
      } else {
        setInvalidName({ isActive: false, msg: "" });
      }
    }

    if (email === "") {
      //setError({isActive:true,msg:"Please fill email"});
      setInvalidEmail({ isActive: true, msg: "Invalid" });
      value = false;
    } else {
      setInvalidEmail({ isActive: false, msg: "" });
    }
    if (!validateEmail(email)) {
      //setError({isActive:true,msg:"Invalid email formarts . please check again."});
      setInvalidEmail({ isActive: true, msg: "Invalid" });
      value = false;
    } else {
      setInvalidEmail({ isActive: false, msg: "" });
    }

    if (password === "") {
      //setError({isActive:true,msg:"Please fill password"});
      setInvalidPassword({ isActive: true, msg: "Too Short" });
      value = false;
    } else {
      setInvalidPassword({ isActive: false, msg: "" });
    }
    if (!validatePassword(password)) {
      //setError({isActive:true,msg:"Invalid password formats. Min 6 length."});
      setInvalidPassword({
        isActive: true,
        msg: "Invalid. Press 'i' for info ",
      });
      value = false;
    } else {
      setInvalidPassword({ isActive: false, msg: "" });
    }

    if (!validatePhone(phone)) {
      console.log("======== validating phone");											   
      //setError({isActive:true,msg:"Please fill phone"});
      setInvalidPhone({ isActive: true, msg: "Invalid. Only numbers allowed" });
      value = false;
    } else {
      setInvalidPhone({ isActive: false, msg: "" });
    }
    return value;
  };
  const actionCreate = () => {
    setClickCreate(true);

    if (!isSent) {
      return;
    }

    if (!checkValidation()) {
      return;
    }
    if (!validateCode(verificationCode, code)) {
      setInvalidCode({ isActive: true, msg: "Invalid" });
      return;
    } else {
      setInvalidCode({ isActive: false, msg: "" });
    }
    if (isTerm === false) {
      setError({ isActive: true, msg: "Please, check terms and conditions" });
      setInvalidPhone({ isActive: true, msg: "Invalid" });
      return;
    }

    let params = {
      name: userName,
      email: email,
      password: password,
      phone: prefix + " " + phone,
      fcmKey: Globals?.fcmKey,
      cca2: cca2,
    };
    // console.log("params on register = ", params);
    setIndicator({ isActive: true, msg: " Creating Account " });
    serviceRegister(params)
      .then((res) => {
        setIndicator({ isActive: false, msg: "" });
        if (res.status === 200) {
          console.log(res);
          DefaultPreference.setMultiple({
            userNo: res.user_id.toString(),
            userEmail: res.email.toString(),
          })
            .then(function () {
              Globals.userNo = res.user_id.toString();
              Globals.userEmail = res.email;
              reconnectSocket && reconnectSocket();
              Toast.show("Registration Successful", Toast.SHORT, [
                "UIAlertController",
              ]);
              successRegister();
            })
            .catch(() => {});
        } else {
          setError({ isActive: true, msg: res.msg });

          // console.log(res);
          if (res.msg === "Email already in use") {
            setInvalidEmail({ isActive: true, msg: "Invalid" });
          }
          if (res.msg === "Phone number already in use") {
            setInvalidPhone({ isActive: true, msg: "Invalid" });
          }
          if (res.msg === "Account already exists") {
            setForgotPass(true);
          }
        }
      })
      .catch(() => {
        setIndicator({ isActive: false, msg: "Something went wrong" });
      });
  };

  const sendOtp = () => {
    if (!checkValidation()) {
      return;
    } else {
      let params = {
        phone: prefix + phone,
      };

       console.log(prefix + phone);

      otp(params)
        .then((res) => {
          // console.log(res);
          if (res.status === 200) {
            setIndicator({ isActive: false, msg: "" });
            setSent(true);
            setCode(res.code.toString());
            // Set verification was for test purposes
			      setVerification(res.code.toString());
            Toast.show("BETA VERSION SENT CODE DIRECTLY, NO SMS", Toast.SHORT, [
              "UIAlertController",
            ]);
          } else {
            setError({ isActive: true, msg: res.msg });
          }
        })
        .catch(() => {
          setIndicator({ isActive: false, msg: "" });
        });
    }
  };

  const successRegister = () => {
    props.navigation.navigate("Login", { email: email });
  };

  const termStyle = () => {
    if (isTerm) {
      return { flexDirection: "row", flex: 1, padding: 5 };
    } else {
      if (isClickCreate) {
        return {
          flexDirection: "row",
          flex: 1,
          borderColor: "red",
          borderWidth: 1,
          padding: 5,
        };
      } else {
        return { flexDirection: "row", flex: 1, padding: 5 };
      }
    }
  };

  return (
    <ScrollView
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="always"
      style={styles.primaryFullBG}
    >
      <KeyboardAvoidingView style={[styles.primaryFullBG, Styles.keyBordView]}>
        <StatusBar hidden={true} />
        {iInfo.isActive === true && (
          <View style={styles.loading}>
            <View style={styles.loaderView}>
              <ActivityIndicator
                color="#d84c41"
                style={styles.activityIndicator}
              />
              <Text style={styles.loadingText}>{iInfo.msg}</Text>
            </View>
          </View>
        )}

        <View style={styles.vwTopLogo}>
          <Image
            style={styles.imgTopLogo}
            source={LogoImage}
            resizeMode="contain"
          />
        </View>

        {/* userID */}					  
        <View style={styles.vwInputContainer}>
          <View style={Styles.nameField}>
            <Text style={styles.primaryText}>User Id</Text>
            {/* Info icon for user ID */}
            <TouchableOpacity
              style={styles.infoIcon}
              onPress={() => setUserNameInfo(true)}
            >
              <Image style={Styles.buttonInforImage} source={BUTTONINFO} />
            </TouchableOpacity>
            {isInvalidName.isActive && (
              <Text style={[styles.primaryText, Styles.errorText]}>
                - {isInvalidName.msg}
              </Text>
            )}
          </View>

          <TextInput
            style={[
              styles.primaryInput,
              {
                borderColor: isInvalidName.isActive
                  ? BaseColor.redColor
                  : BaseColor.borderColor,
              },
            ]}
            placeholder="User Id"
            value={userName}
            ref={usernameBox}
            blurOnSubmit={false}
            returnKeyType="next"
            onSubmitEditing={() => emailBox.current.focus()}
            onChangeText={(text) => setUserName(text)}
          />

        {/* Email */}
          <View style={Styles.fieldPosition}>
            <Text style={styles.primaryText}>Email</Text>
            {isInvalidEmail.isActive && (
              <Text style={[styles.primaryText, Styles.errorText]}>
                - {isInvalidEmail.msg}
              </Text>
            )}
          </View>

          <TextInput
            style={[
              styles.primaryInput,
              {
                borderColor: isInvalidEmail.isActive
                  ? BaseColor.redColor
                  : BaseColor.borderColor,
              },
            ]}
            placeholder="Email"
            value={email}
            autoCapitalize={"none"}
            keyboardType={"email-address"}
            ref={emailBox}
            blurOnSubmit={false}
            returnKeyType="next"
            onSubmitEditing={() => passwordBox.current.focus()}
            onChangeText={(text) => setEmail(text)}
          />

          {/* Password */}
          <View style={Styles.fieldPosition}>
            <Text style={styles.primaryText}>Password</Text>
            {/* Info icon for password */}
            <TouchableOpacity
              style={styles.infoIcon}
              onPress={() => setPasswordInfo(true)}
            >
              <Image style={Styles.buttonInforImage} source={BUTTONINFO} />
            </TouchableOpacity>
            <Text style={[styles.primaryText, Styles.errorText]}>
              {isInvalidPassword.isActive ? `- ${isInvalidPassword.msg}` : ""}
            </Text>
          </View>

          <TextInput
            style={[
              styles.primaryInput,
              {
                borderColor: isInvalidPassword.isActive
                  ? BaseColor.redColor
                  : BaseColor.borderColor,
              },
            ]}
            placeholder="Password"
            value={password}
            secureTextEntry={true}
            ref={passwordBox}
            blurOnSubmit={false}
            returnKeyType="next"
            onSubmitEditing={() => phoneNumberBox.current.focus()}
            onChangeText={(text) => setPassword(text)}
          />

          {/* Phone code and Phone number */}
          <PhoneTextInput
            pickerProps={{
              pickerRef: pickerRef,
              value: prefix,
              title: "Please, select country code",
              items: prefixList,
            }}
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
              ref: phoneNumberBox,
              keyboardType: "numeric",
              onSubmitEditing: () => codeBox.current.focus(),
              onChangeText: (text) => {
                setPhone(text);
                setCode("");
                setVerification("");
              },
            }}
          />

          {/* Verification Code */}
          <View>
            <View style={Styles.fieldPosition}>
              <Text style={styles.primaryText}>Verification Code</Text>
              {isInvalidCode.isActive && (
                <Text style={[Styles.errorText]}>
                  {" "}
                  - {isInvalidCode.msg}
                </Text>
              )}
            </View>
            <View style={Styles.phoneContainer}>
              {isSent === false && (
                <TextButtonFilledColor
                  onPress={() => sendOtp()}
                  style={[, Styles.buttonContainer, Styles.sendOtpButton]}
                  text="Send Code"
                />
              )}
              {isSent === true && (
                <TextButtonFilledColor
                  onPress={() => sendOtp()}
                  style={[Styles.buttonContainer, Styles.sendOtpButton]}
                  text="Resend Code"
                />
              )}
              <View style={Styles.phoneView}>
                <TextInput
                  style={[
                    styles.primaryInput,
                    // eslint-disable-next-line react-native/no-inline-styles
                    {
                      marginTop: 0,
                      borderColor: isInvalidCode.isActive
                        ? BaseColor.redColor
                        : BaseColor.borderColor,
                    },
                  ]}
                  placeholder="Verification Code"
                  keyboardType="number-pad"
                  value={verificationCode}
                  maxLength={6}
                  ref={codeBox}
                  onChangeText={(text) => setVerification(text)}
                  returnKeyType="done"
                  onSubmitEditing={() => {}}
                />
              </View>
            </View>
          </View>

          {/* Ts&Cs */}
          <View style={Styles.fieldPosition}>
            <View style={termStyle()}>
              <Switch
                circleColorActive={"#FFFFFF"}
                circleColorInactive={"#FFFFFF"}
                backgroundActive={"#0D97DF"}
                backgroundInactive={"#7E7E7E"}
                onSyncPress={(value) => setTerm(value)}
              />
              <TouchableOpacity
                onPress={() => {
                  setClickedTerm(true);
                }}
              >
                <Text style={[styles.primaryLightText, Styles.errorTextBlack]}>
                  Terms & Conditions
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {isForgotPass ? (
            <TouchableOpacity
              onPress={() => openForgotPassword()}
              style={Styles.forgetPasswordPosition}
            >
              <Text style={Styles.forgetPasswordError}>Fotgot Password ?</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            style={Styles.forgetpasswordAction}
            onPress={() => actionCreate()}
          >
            <View
              style={[
                styles.primaryBtn,
                {
                  backgroundColor:
                    isSent && isTerm
                      ? BaseColor.primaryBlueColor
                      : BaseColor.grayColor,
                },
              ]}
            >
              <Text style={styles.btnText}>Create Account</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.separator} />
          <TextButtonOutline
            onPress={() => props.navigation.navigate("Login")}
            style={Styles.marginTop20}
            text="Log in"
          />
        </View>

        {/* Validation */}
        <Modal
          style={Styles.margin5}
          backdropColor="#000"
          isVisible={errInfo.isActive}
        >
          <View style={Styles.errorWithBorder}>
            <View style={Styles.mainVertical}>
              <Text style={Styles.errorWithBorderText}>{errInfo.msg}</Text>
              <TouchableOpacity
                style={Styles.modalContainer}
                onPress={() => setError({ isActive: false, msg: "111" })}
              >
                <Image
                  style={Styles.closeIconSize}
                  source={CloseIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Validation  of unnexpected */}
        <Modal style={Styles.margin5} isVisible={info.isActive}>
          <View style={Styles.errorWithBorder}>
            <View style={Styles.mainVertical}>
              <Text style={Styles.errorWithBorderTextWhite}>
                {" Something went wrong" + info.msg}
              </Text>
              <TouchableOpacity
                style={Styles.modalContainer}
                onPress={() => setInfo({ isActive: false, msg: "222" })}
              >
                <Image
                  style={Styles.closeIconSize}
                  source={CloseIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Password modal info */}
        <Modal style={Styles.margin5} isVisible={isPasswordInfo}>
          <View style={styles.modalContainer}>
            <View>
              <Text style={styles.modalHeader}>{"Password must"}</Text>
              {Constants.PASSWORD_VALIDATION.map((term, index) => {
                return (
                  <View key={index} style={styles.itemPasswordTerm}>
                    <View style={styles.passwordTermDot} />
                    <Text style={styles.passwordTerm}>{term}</Text>
                  </View>
                );
              })}
              <TouchableOpacity
                style={Styles.setPasswordInfo}
                onPress={() => setPasswordInfo(false)}
              >
                <Image
                  style={Styles.closeIconSize}
                  source={CloseIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* User Id modal info */}
        <Modal style={Styles.margin5} isVisible={isUserNameInfo}>
          <View style={styles.modalContainer}>
            <View>
              <Text style={styles.modalHeader}>{" User Id must: "}</Text>
              {Constants.USERID_VALIDATION.map((term, index) => {
                return (
                  <View key={index} style={styles.itemPasswordTerm}>
                    <View style={styles.passwordTermDot} />
                    <Text style={styles.passwordTerm}>{term}</Text>
                  </View>
                );
              })}
              <TouchableOpacity
                style={Styles.setPasswordInfo}
                onPress={() => setUserNameInfo(false)}
              >
                <Image
                  style={Styles.closeIconSize}
                  source={CloseIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* */}
        <Modal style={Styles.mainModalContainer} isVisible={isClickedTerm}>
          <View style={Styles.mainModelContaint}>
            <Text style={Styles.errorWithBorderTextWhite} />
            <TouchableOpacity
              style={Styles.modalContainer}
              onPress={() => {
                setClickedTerm(false);
              }}
            >
              <Image
                style={Styles.termsIcon}
                source={CloseIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
