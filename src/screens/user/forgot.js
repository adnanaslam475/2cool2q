import React, { useState, useRef } from "react";
import {
  View,
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "react-native";
import styles from "../../common/style";
import { forgotPassword, updatePassword } from "../../service/user";
import Modal from "react-native-modal";
import { ScrollView } from "react-native-gesture-handler";
import { BaseColor } from "common/color";
import { validateEmail, validatePassword } from "config/globals";
import Toast from "react-native-simple-toast";
import { LogoImage } from "../../assets/index";
import Styles from "../../styles/pages/forgot";
import { TextButtonFilledColor, TextButtonOutline } from "component/textButton";

export default function ForgotScreen(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [iInfo, setIndicator] = useState({
    isActive: false,
    msg: "Signing User...",
  });
  const [errInfo, setError] = useState({ isActive: false, msg: "" });
  const [isEmailSent, setEmailSent] = useState(false);
  const confirmBox = useRef();

  const callForgot = () => {
    if (email == "") {
      setError({ isActive: true, msg: "Email required" });
      return;
    }
    if (!validateEmail(email)) {
      setError({ isActive: true, 
        msg: "Invalid Email" });
      return;
    }
    let params = {
      email: email,
    };
    setIndicator({ isActive: true, msg: "Loading..." });
    forgotPassword(params)
      .then((res) => {
        console.log(" ====== Forgot password res = ", res);
        if (res.status == 200) {
          setEmailSent(true);
          setIndicator({ isActive: false, msg: "" });
          Toast.show("Email sent, please check your inbox", Toast.SHORT, [
            "UIAlertController",
          ]);
          props.navigation.navigate("Login", { email: email });
        } else {
          setIndicator({ isActive: false, msg: "" });
          setError({ isActive: true, msg: res.msg });
          return;
        }
      })
      .catch((err) => {
        setIndicator({ isActive: false, msg: "" });
      });
  };

  const openUpdatePassword = () => {
    if (password != confirmPassword) {
      setError({ isActive: true, msg: "Password different." });
      return;
    }
    if (password == "") {
      setError({ isActive: true, msg: "Please fill password" });
      return;
    }
    if (!validatePassword(password)) {
      setError({
        isActive: true,
        msg: "Invalid Password formats .min 6 length",
      });
      return;
    }
    let params = {
      email: email,
      password: password,
    };
    setIndicator({ isActive: true, msg: "Loading.." });
    updatePassword(params)
      .then((res) => {
        // console.log(res);
        if (res.status == 200) {
          Toast.show("Password updated successfully.", Toast.SHORT, [
            "UIAlertController",
          ]);
          props.navigation.navigate("Login", { email: email });
        } else {
          setIndicator({ isActive: false, msg: "" });
          setError({ isActive: true, msg: res.msg });
          return;
        }
      })
      .catch((err) => {
        setIndicator({ isActive: false, msg: "" });
      });
  };

  return (
    <ScrollView
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="always"
      style={styles.primaryFullBG}
    >
      <StatusBar hidden={true} />
      {iInfo.isActive && (
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
      <View style={styles.vwTopLogo}>
        <Image
          style={styles.imgTopLogo}
          source={LogoImage}
          resizeMode="contain"
        />
      </View>
      <View style={styles.vwInputContainer}>
        <Text style={styles.title}>Forgot Password</Text>
        {!isEmailSent && (
          <View>
            <Text style={[styles.secondaryText, Styles.marginTop20]}>
              Please, insert your email address
            </Text>
            <TextInput
              style={styles.primaryInput}
              placeholder="Email"
              value={email}
              onSubmitEditing={() => callForgot()}
              onChangeText={(text) => setEmail(String(text).toLowerCase())}
            />
            <TextButtonFilledColor
              onPress={() => callForgot()}
              style={Styles.marginTop20}
              text="Send Email"
            />
            <TextButtonOutline
              onPress={() => props.navigation.navigate("Login")}
              style={Styles.marginTop20}
              text="Log in"
            />
          </View>
        )}
        {isEmailSent && (
          <View>
            <Text style={[styles.secondaryText, Styles.marginTop20]}>
              Password
            </Text>
            <TextInput
              style={styles.primaryInput}
              placeholder="Password"
              value={password}
              secureTextEntry={true}
              blurOnSubmit={false}
              returnKeyType="next"
              onSubmitEditing={() => confirmBox.current.focus()}
              onChangeText={(text) => setPassword(text)}
            />
            <Text style={[styles.secondaryText, Styles.marginTop20]}>
              Confirm Password
            </Text>
            <TextInput
              style={styles.primaryInput}
              placeholder="Confirm Password"
              value={confirmPassword}
              secureTextEntry={true}
              ref={confirmBox}
              returnKeyType="done"
              onSubmitEditing={() => openUpdatePassword()}
              onChangeText={(text) => setConfirmPassword(text)}
            />
            <TouchableOpacity
              style={Styles.marginTop20}
              onPress={() => openUpdatePassword()}
            >
              <View style={styles.primaryBtn}>
                <Text style={styles.btnText}>Send</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity
          style={Styles.marginTop20}
          onPress={() => {
            props.navigation.navigate("Login");
          }}
        ></TouchableOpacity>
      </View>
      <Modal backdropColor={BaseColor.blackColor} isVisible={errInfo.isActive}>
        <View style={Styles.modelMainView}>
          <View style={Styles.modelView}>
            <Text style={Styles.modelText}>{errInfo.msg}</Text>
            <TouchableOpacity
              style={Styles.dismissButtonView}
              onPress={() => setError({ isActive: false, msg: "" })}
            >
              <Text style={Styles.dismissText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
