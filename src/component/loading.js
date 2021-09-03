import { BaseColor } from "common/color";
import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { View, Text, ActivityIndicator } from "react-native";

import styles from "../common/style";

export const LoadingView = forwardRef((props, ref) => {
  const [iInfo, setIndicator] = useState({
    isActive: false,
    msg: "Signing User...",
  });
  useEffect(() => {}, []);

  useImperativeHandle(ref, () => ({
    open: (iInfo) => {
      setIndicator(iInfo);
    },
    showAlert() {
      alert("Child Function Called");
    },
  }));

  return (
    <View>
      {iInfo.isActive == true && (
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
    </View>
  );
});
