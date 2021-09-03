import React, { useContext, useEffect } from "react";
import AppNavigator from "./src/navigator/navigator";
import {
  configureFonts,
  DefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import {
  SocketAction,
  SocketDataContext,
  SocketDataProvider,
} from "./src/providers/socket-data";
import messaging from "@react-native-firebase/messaging";
import { Globals } from "config/constants";
import Toast from "react-native-simple-toast";

const fontConfig = {
  default: {
    regular: {
      //fontFamily: 'sans-serif',
      fontWeight: "normal",
    },
    medium: {
      //fontFamily: 'sans-serif-medium',
      fontWeight: "normal",
    },
    light: {
      //fontFamily: 'sans-serif-light',
      fontWeight: "normal",
    },
    thin: {
      //fontFamily: 'sans-serif-thin',
      fontWeight: "normal",
    },
  },
};

const theme = {
  ...DefaultTheme,
  fonts: configureFonts(fontConfig),
};

async function requestUserPermission() {
  try {
    await messaging().registerDeviceForRemoteMessages();
  } catch {}
  let authStatus;
  try {
    authStatus = await messaging().requestPermission();
  } catch {}
 
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  if (enabled) {
    // I hate that I've done this but here we are.
    const FCMKey = await messaging().getToken();
        (Globals || {}).fcmKey = FCMKey;
  }
}

export default function App() {
  const { socket: possibleSocket } = useContext(SocketDataContext);

  useEffect(() => {
    requestUserPermission();
    (async () => {
      try {
        const FCMKey = await messaging().getToken();
        possibleSocket.emit(
          "ClientMessage",
          JSON.stringify({
            action: SocketAction.NEW_FCM_KEY,
            fcmKey: FCMKey,
            userId: Globals.userNo,
          })
        );
      } catch {}
    })();
    messaging().onMessage(async (remoteMessage) => {
      Toast.show(
        remoteMessage.notification.title +
          " >> " +
          remoteMessage.notification.body,
        Toast.SHORT,
        ["UIAlertController"]
      );
    });
  }, [possibleSocket]);

  return (
    <PaperProvider theme={theme}>
      <SocketDataProvider>
        <AppNavigator />
      </SocketDataProvider>
    </PaperProvider>
  );
}
