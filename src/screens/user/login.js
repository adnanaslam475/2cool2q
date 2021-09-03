import React, { useState, useEffect, useRef, useContext } from "react";
import {
  KeyboardAvoidingView,
  View,
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  AppState,
  Alert,
  Dimensions,
} from "react-native";
import { StatusBar } from "react-native";
import styles from "../../common/style";
import { serviceLogin, getGpsLocation } from "../../service/user";
import Modal from "react-native-modal";
import { Globals, validateEmail, MyLocation } from "../../config/globals";
import DefaultPreference from "react-native-default-preference";
import Icon from "react-native-vector-icons/FontAwesome";
import Switch from "react-native-switch-pro";
import { ScrollView } from "react-native-gesture-handler";
import { BaseColor } from "../../common/color";
import I18n from "react-native-i18n";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import Geolocation from "react-native-geolocation-service";
import messaging from "@react-native-firebase/messaging";
import { SocketDataContext, SocketAction } from "providers/socket-data";
import Styles from "../../styles/pages/login";
import { LogoImage, CloseIcon } from "../../assets/index";
import { TextButtonFilledColor, TextButtonOutline } from "component/textButton";
var _location = {};
var isLocationDetected = false;


export default function LoginScreen(props) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [iInfo, setIndicator] = useState({
    isActive: false,
    msg: "Signing User...",
  });
  const { reconnectSocket } = useContext(SocketDataContext);
  const [errInfo, setError] = useState({ isActive: false, msg: "" });
  const [isRemember, setRemember] = useState(false);
  const appState = useRef(AppState.currentState);

  const [isInvalidPassword, setInvalidPassword] = useState({
    isActive: false,
    msg: "",
  });
  const [isInvalidEmail, setInvalidEmail] = useState({
    isActive: false,
    msg: "",
  });
  const { socket } = useContext(SocketDataContext);

  const emailBox = useRef();
  const passwordBox = useRef();

  useEffect(() => {
    if (!isLocationDetected) {
      _location = MyLocation;
      callGpsLocation();
      isLocationDetected = true;
    }
    showPassword();
    AppState.addEventListener("change", _handleAppStateChange);
    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);

  const callGpsLocation = () => {
    let params = { name: "" };
    getGpsLocation(params)
      .then((res) => {
        if (res.location != null) {
          console.log("Gps location = ", res.location.lat, res.location.lng);
          MyLocation.lat = res.location.lat;
          MyLocation.lng = res.location.lng;
        }
        _location = MyLocation;
      })
      .catch(() => {
        setIndicator({ isActive: false, msg: "No GPS location" });
      });
  };

  const checkLocationPermission = () => {
    check(
      Platform.OS === "android"
        ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
    ).then((result) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          Alert.alert(
            "Error",
            "Unabled to use geolocation",
            [
              {
                text: "Yes",
                onPress: () => console.log("Yes Pressed"),
                style: "cancel",
              },
            ],
            { cancelable: false }
          );
          break;
        case RESULTS.DENIED:
          requestLocationPermission();
          break;
        case RESULTS.GRANTED:
          console.log("called 2");
          getCurrentLocation();
          break;
        case RESULTS.BLOCKED:
          Alert.alert(
            "Error",
            "Blocked to use geolocation",
            [
              {
                text: "Yes",
                onPress: () => console.log("Yes Pressed"),
                style: "cancel",
              },
            ],
            { cancelable: false }
          );
          break;
      }
      isLocationDetected = true;
    });
  };

  const requestLocationPermission = () => {
    request(
      Platform.OS === "android"
        ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
    ).then((result) => {
      if (result === RESULTS.GRANTED) {
        getCurrentLocation();
      }
    });
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        let location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        _location = location;
      },
      (error) => {
        Alert.alert(error.message);
      },
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 10000 }
    );
  };

  const openForgotPassword = () => {
    props.navigation.navigate("ForgotPassword");
  };

  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      // console.log("App has come to the foreground!");
      showPassword();
    }
    appState.current = nextAppState;
    setUserName(props.navigation.getParam("email", ""));
  };

  const showPassword = () => {
    DefaultPreference.getMultiple(["isRemember", "email", "password"])
      .then(function (values) {
        if (values[0] != null && values[1] != null && values[2] != null) {
          if (values[0] === "1") {
            Globals.userEmail = values[1];
            setUserName(values[1]);
            setPassword(values[2]);
            setRemember(true);
          }
        }
      })
      .catch(() => {});
  };

  const remember = (value) => {
    setRemember(value);
    if (value) {
      DefaultPreference.setMultiple({
        email: userName,
        password: password,
        isRemember: "1",
      });
    } else {
      DefaultPreference.setMultiple({
        email: "",
        password: "",
        isRemember: "0",
      });
    }
  };

  const goToCreate = () => {
    props.navigation.navigate("Register");
  };

  const successLogin = (res) => {
    if (res.user.CPROFILE_ID === null || res.user.CPROFILE_ID === "") {
      setError({
        isActive: true,
        msg: "Invalid CPROFILE_ID. Please contact the administrator.",
      });
    } else {
      DefaultPreference.setMultiple({
        userNo: res.user.CLOGIN_ID.toString(),
        userEmail: res.user.CLOGIN_email,
      })
        .then(function () {
          Globals.userNo = res.user.CLOGIN_ID.toString();
          reconnectSocket && reconnectSocket();
          Globals.userEmail = res.user.CLOGIN_email;
          DefaultPreference.setMultiple({
            user_id: Globals.userNo,
            cprofile_id: res.user.CPROFILE_ID.toString(),
          });
          if (isRemember) {
            DefaultPreference.setMultiple({
              email: userName,
              password: password,
              isRemember: "1",
            });
          }
          props.navigation.navigate("Main");
          setIndicator({ isActive: false, msg: "" });
        })
        .catch(() => {
          setError({ isActive: true, msg: "Error." });
        });
    }
  };

  const actionLogin = () => {
    var value = true;
    if (userName === "") {
      setInvalidEmail({ isActive: true, msg: "Invalid" });
      value = false;
    } else {
      if (!validateEmail(userName)) {
        setInvalidEmail({ isActive: true, msg: "Invalid" });
        value = false;
      } else {
        setInvalidEmail({ isActive: false, msg: "" });
      }
    }
    if (password === "") {
      setInvalidPassword({ isActive: true, msg: "Invalid" });
      value = false;
    } else {
      setInvalidPassword({ isActive: false, msg: "" });
    }
    if (value === false) {
      return;
    }
    var deviceLocale = I18n.currentLocale();

    let params = {
      email: userName,
      password: password,
      lang: deviceLocale,
      lat: _location.lat,
      lng: _location.lng,
    };
    setIndicator({ isActive: true, msg: " Signing User " });
    serviceLogin(params)
      .then(async (res) => {
        console.log("LOGIN RES email =", res.CLOGIN_email);
        if (res.status === 200) {
          try {
            const FCMKey = await messaging().getToken();
            if (socket) {
              socket.emit(
                "ClientMessage",
                JSON.stringify({
                  action: SocketAction.NEW_FCM_KEY,
                  fcmKey: FCMKey,
                })
              );
            } else console.warn("No socket available yet");
          } catch {
            console.log("No login response: ", params.email);
          }
          successLogin(res);
        } else if (res.status === 300 || res.status === 400) {
          setIndicator({ isActive: false, msg: "" });
          setError({ isActive: true, msg: res.msg });
          return;
        } else {
          setIndicator({ isActive: false, msg: "" });
          setError({ isActive: true, msg: res.code });
          return;
        }
      })
      .catch(() => {
        setIndicator({ isActive: false, msg: "" });
        setError({ isActive: true, msg: "Lost Connection" });
      });
  };

  return (
    <ScrollView
      style={Styles.mainView}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="always"
    >
      {iInfo.isActive === true && (
        <View style={styles.loading}>
          <View style={styles.loaderView}>
            <ActivityIndicator
              color={BaseColor.whiteColor}
              style={styles.activityIndicator}
            />
            <Text style={styles.loadingText}>{iInfo.msg}</Text>
          </View>
        </View>
      )}
      <KeyboardAvoidingView style={styles.primaryFullBG}>
        <StatusBar hidden={true} />
        <View style={{ minHeight: Dimensions.get("window").height }}>
          <View style={styles.vwTopLogo}>
            <Image
              style={styles.imgTopLogo}
              source={LogoImage}
              resizeMode="contain"
            />
          </View>
          <View style={[styles.vwInputContainer, Styles.inputeContaine]}>
            <View style={Styles.inputeContainerView}>
              <Text style={styles.primaryText}>Email</Text>
              {isInvalidEmail.isActive && (
                <Text style={[styles.primaryText, Styles.validationText]}>
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
              value={userName}
              returnKeyType="next"
              blurOnSubmit={false}
              ref={emailBox}
              onSubmitEditing={() => {
                passwordBox.current.focus();
              }}
              autoCapitalize={"none"}
              keyboardType={"email-address"}
              onChangeText={(text) => setUserName(text)}
            />
            <View style={Styles.passwordContainer}>
              <Text style={styles.primaryText}>Password</Text>
              {isInvalidPassword.isActive && (
                <Text style={[styles.primaryText, Styles.validationText]}>
                  - {isInvalidPassword.msg}
                </Text>
              )}
            </View>
            <TextInput
              style={styles.primaryInput}
              // eslint-disable-next-line react/jsx-no-duplicate-props
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
              returnKeyType="done"
              ref={passwordBox}
              onSubmitEditing={() => {
                actionLogin();
              }}
              onChangeText={(text) => setPassword(text)}
            />
            <View style={Styles.passwordContainer}>
              <View style={Styles.switchContainer}>
                <Switch
                  style={{}}
                  circleColorActive={"#FFFFFF"}
                  circleColorInactive={"#FFFFFF"}
                  backgroundActive={"#0D97DF"}
                  backgroundInactive={"#7E7E7E"}
                  onSyncPress={(value) => remember(value)}
                  value={isRemember}
                />
                <Text style={[styles.secondaryText, Styles.remembermePosition]}>
                  Remember me
                </Text>
              </View>
              <View
                style={[styles.vwRightAlign, Styles.forgotPasswordPosition]}
              >
                <TouchableOpacity onPress={() => openForgotPassword()}>
                  <Text style={styles.secondaryText}>Forgot password?</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View />
            <TextButtonFilledColor
              onPress={() => actionLogin()}
              style={[Styles.marginTop20, Styles.buttonContainer]}
              text="Log in"
            />
            <View style={styles.separator} />
            <TextButtonOutline
              onPress={() => goToCreate()}
              style={Styles.marginTop20}
              text="Create an account"
            />
            {false && (
              <View style={Styles.socialLoginContainer}>
                <TouchableOpacity style={Styles.flex1}>
                  <View
                    style={[styles.primaryEmptyBtn, styles.borderColorGray]}
                  >
                    <Icon name="facebook" size={16} color={"#0d97df"} />
                    <Text style={[styles.btnTextEmpty, styles.colorGray]}>
                      Facebook
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={Styles.googleLoginPosition}>
                  <View
                    style={[styles.primaryEmptyBtn, styles.borderColorGray]}
                  >
                    <Icon name="google" size={16} color={"#0d97df"} />
                    <Text style={[styles.btnTextEmpty, styles.colorGray]}>
                      Google
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/** App Version **/}
          <View>
            <Text style={styles.loadingText}>      Ver 1.6 (R)</Text>
          </View>

          <Modal
            style={Styles.modalContainer}
            backdropColor="#000"
            isVisible={errInfo.isActive}
          >
            <View style={Styles.modalView}>
              <View style={Styles.modalVerticalView}>
                <Text style={Styles.modalErrorText}>{errInfo.msg}</Text>
                <TouchableOpacity
                  style={Styles.setError}
                  onPress={() => setError({ isActive: false, msg: "" })}
                >
                  <Image
                    style={Styles.colseIcon}
                    source={CloseIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
