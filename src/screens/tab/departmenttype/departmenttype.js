import React, { useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import comon_style from "../../../common/style";
import { BoxShadow } from "react-native-shadow";
import styles from "./style";
import { BaseColor } from "../../../common/color";
import { Globals } from "../../../config/globals";
import { Constants } from "../../../config/constants";
import Styles from "../../../styles/pages/departmentType";

export default function DepartmentTypeView(props) {
  useEffect(() => {}, []);

  goToAvailabilityView = (type, item) => {
    Globals.selectedDepartment = item;
    props.openDepartmentDetails(type);
  };

  goToTheRightView = (item) => {
    Globals.selectedDepartment = item;

    if (item.type_id === Constants.DEPARTMENT_TYPE.CHECK_IN) {
      // Check in = 1
      if (item.checkin_slot_id != null) {
        Globals.selectedSlotId = item.checkin_slot_id;
        props.openDepartmentDetails(Constants.CHECK_IN_TICKET);
      } else {
        goToAvailabilityView(Constants.CHECKIN_ME, item);
      }
    } else if (item.type_id === Constants.DEPARTMENT_TYPE.MENU_ONLY) {
      // Menu only = 2
      props.openMenuPage(Constants.MENU_ONLY);  
    } else if (item.type_id === Constants.DEPARTMENT_TYPE.VIRTUAL_QUEUE) {
      // Queue = 3 
      if (item.checkin_slot_id != null) {
        Globals.selectedSlotId = item.checkin_slot_id;
        props.openDepartmentDetails(Constants.QUEUE_TICKET);
      } else {
        goToAvailabilityView(Constants.QUEUE_ME, item);
      }
    } else if (item.type_id === Constants.DEPARTMENT_TYPE.BOOKING) {
      // Booking = 4 
      Globals.selectedSlotId = -1;
      goToAvailabilityView(Constants.BOOK_ME, item);
    } else if (item.type_id === Constants.DEPARTMENT_TYPE.GROUPS) {
      // Groups = 5
      Globals.selectedSlotId = -1;
      goToAvailabilityView(Constants.BOOK_ME, item);
    }
  }

  renderItem = (item) => {
    if (item.department_id === Globals.scanQrDepartmentId) {
      props.setQueueBack(0);
      goToTheRightView(item);
    }

    if (item.active == true) {
      return (
        <View style={{ paddingLeft: 3 }}>
          <TouchableOpacity
            onPress={() => {
              props.setQueueBack(0);
              goToTheRightView(item);
            }}
          >
            <BoxShadow
              setting={{
                width: Dimensions.get("window").width - 38,
                height: 45,
                color: "#000",
                border: 4,
                radius: 3,
                opacity: 0.2,
                x: 1,
                y: 3,
                style: { marginVertical: 5 },
              }}
            >
              <View style={[comon_style.card_type_bg, { marginTop: 2 }]}>
                <View
                  style={([styles.bannerTitleContainerLeft], { padding: 12 })}
                >
                  {/* {color:item.queue_is_closed == false && item.type_id == 3?BaseColor.grayColor:BaseColor.primaryBlueColor}  */}
                  <Text style={styles.typeTitle}>{item.name}</Text>
                </View>

                <View
                  style={{ flex: 1, alignItems: "flex-end", marginRight: 10 }}
                >
                  {/* (Globals.selectedDepartment.isIn != 1 || Globals.isClosed != 0) */}
                  {(item.isIn != 1 ||
                    item.queue_is_closed == true ||
                    item.queue_is_closed == null) &&
                    item.type_id == 3 && (
                      <View>
                        <Text
                          style={[
                            styles.typeTitleDes,
                            { color: "red", alignSelf: "flex-end" },
                          ]}
                        >
                          Closed
                        </Text>
                        <Text
                          style={[
                            styles.typeTitleDes,
                            { color: BaseColor.grayColor },
                          ]}
                        >
                          Queue opens {item.open_time}
                        </Text>
                      </View>
                    )}

                  {((item.isIn == 1 && item.queue_is_closed == false) ||
                    item.type_id == 1 ||
                    item.type_id == 2 ||
                    item.type_id == 4 ||
                    item.type_id == 5) && (
                    <Text style={styles.typeTitleDes}>{item.type_name}</Text>
                  )}
                </View>
              </View>
            </BoxShadow>
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ margin: 15 }}>
        {props.getDprt() != null && props.getDprt().length > 0 && (
          <FlatList
            showsVerticalScrollIndicator={false}
            style={{ marginTop: 0, marginBottom: 0 }}
            keyExtractor={(item, index) => index.toString()}
            data={props.getDprt()}
            renderItem={({ item }) => renderItem(item)}
            // refreshing={this.state.refreshing}
            // onRefresh={this.handleRefresh}
          />
        )}

        {props.getDprt() != null && props.getDprt().length == 0 && (
          <View style={{ alignItems: "center" }}>
            <Text style={[comon_style.primaryText, Styles.listText]}>
              Business No Active
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
