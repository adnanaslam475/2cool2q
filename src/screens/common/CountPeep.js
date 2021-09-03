import React, { useState, useImperativeHandle, forwardRef } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import styles from "../../common/style";
import Toast from "react-native-simple-toast";
import Styles from "../../styles/commonScreens/countpeep";
import { ICON_MINUS, ICON_PLUSE } from "../../assets/index";

// eslint-disable-next-line react/display-name
export const CountPeep = forwardRef((_props, ref) => {
  const [count, setCount] = useState(1);
  const [max_val, setMaxVal] = useState(-1);
  const [type, setType] = useState("");
  renderData = (data) => {
    // console.log("render data", data);
    setItem(data);
  };
  useImperativeHandle(ref, () => ({
    open: (max_val) => {
      setMaxVal(max_val);
    },
    showAlert() {
      alert("Child Function Called");
    },
    getValue() {
      return count;
    },
  }));

  return (
    <View style={Styles.container}>
      <TouchableOpacity
        onPress={() => {
          if (count > 0) {
            setCount(count - 1);
            if (type == "menu") {
              console.log("Type menu Data = ", data);
            }
          }
        }}
      >
        <Image style={styles.sign} source={ICON_MINUS} resizeMode="stretch" />
      </TouchableOpacity>

      <Text style={styles.counter}> {count} </Text>

      <TouchableOpacity
        onPress={() => {
          if (max_val == -1 || (count < max_val && max_val != -1)) {
            //Globals.selectedDepartment.max_peep
            setCount(count + 1);
            if (type == "menu") {
              console.log("type menu Data=", data);
            }
          } else {
            Toast.show("Max Peep", Toast.SHORT, ["UIAlertController"]);
          }
        }}
      >
        <Image
          style={[styles.sign, Styles.imagePosition]}
          source={ICON_PLUSE}
          resizeMode="stretch"
        />
      </TouchableOpacity>
    </View>
  );
});
