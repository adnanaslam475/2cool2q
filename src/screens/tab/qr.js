import React, { useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Linking } from "react-native";
import styles from "../../common/style";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { BaseColor } from "../../common/color";
import QRCodeScanner from "react-native-qrcode-scanner";
import { RNCamera } from "react-native-camera";
import Topbar from "../../component/topbar";
import { Constants } from "../../config/constants";
import { Globals } from "../../config/globals";
import queryString from "query-string";
import Styles from "../../styles/pages/qr";

function QrcodeScreen(props) {
  const onSuccess = (e) => {
    const parametes = props.route.params;
    if (e.data.toLowerCase().includes("2cool2q")) {
      const parsed = queryString.parseUrl(e.data.toLowerCase());
      const parameters = parsed.query;
      const cprofileId = parameters.cprofileid;
      const DepartId = parameters.deptid;
      Globals.scanQrDepartmentId = DepartId;
      if (!cprofileId) {
        alert("Business not existing");
        return false;
      }
      if (!DepartId) {
        alert("Department not existing");
        return false;
      }

      const businessGlobal = Globals.allBusinessList;
      // console.log("Parameters", businessGlobal);
      if (businessGlobal) {
        var businessSelectedRecord = businessGlobal.filter(function (
          bussinesRecord
        ) {
          return bussinesRecord.business.id === cprofileId;
        });
        // console.log("Record", businessSelectedRecord);
        if (businessSelectedRecord.length) {
          const business = businessSelectedRecord[0];
          parametes.changeContentPage(Constants.AVAILABILITY);
          Globals.selectedBusiness = business;
          parametes.changeBusiness(business);
        } else {
          alert("Department not existing.");
          return false;
        }
      } else {
        alert("Department not existing");
        return false;
      }
    } else {
      alert("No 2cool2q");
      Linking.openURL(e.data)
        .then((e) => console.log(e.data))
        .catch((err) => console.error("An error occured linking qr url ", err));
    }
  };

  return (
    <View style={Styles.mainContainer}>
      <View style={Styles.qrView}>
        <Text style={Styles.alignContentCenter}>
          Place QR code inside the frame to scan. 
          Please, avoid shaking to get quicker results.
        </Text>
      </View>
      <View style={Styles.onSuccessView}>
        {
          <QRCodeScanner
            onRead={onSuccess.bind(this)}
            flashMode={RNCamera.Constants.FlashMode.torch}
            topContent={<Text style={{}}></Text>}
            bottomContent={<TouchableOpacity></TouchableOpacity>}
          />
        }
      </View>
    </View>
  );
}

const Tab = createMaterialTopTabNavigator();
export default function QrView(props) {
  useEffect(() => {});

  goBack = () => {
    Globals.isBackClicked = true;
    props.changeContentPage(Constants.TAB_SEARCH_PAGE);
  };

  return (
    <NavigationContainer>
      <Topbar {...this} />
      <Tab.Navigator
        initialRouteName="Feed"
        tabBarOptions={{
          activeTintColor: BaseColor.grayColor,
          labelStyle: { fontSize: 12 },
          style: { backgroundColor: BaseColor.whiteColor },
        }}
      >
        <Tab.Screen
          name="QR Scan"
          component={QrcodeScreen}
          initialParams={props}
          options={{
            // eslint-disable-next-line react/display-name
            tabBarLabel: () => {
              return <Text style={Styles.scanText}>Scan</Text>;
            },
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
