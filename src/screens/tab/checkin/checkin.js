import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../checkin/style";
import common_styles from "../../../common/style";
import { Constants } from "../../../config/constants";
import { CallApi } from "../../../service/business";
import { Globals } from "../../../config/globals";
import DefaultPreference from "react-native-default-preference";
import Toast from "react-native-simple-toast";
import { BaseColor } from "../../../common/color";
import QuantityCounter from "../../../component/QuantityCounter";
//import Styles from "../../../styles/pages/checkIn";

export default function CheckInView(props) {
  const MIN_NUMBER_OF_PEOPLE =
    Globals.isClosed ||
    Globals.selectedDepartment.type_id === Constants.DEPARTMENT_TYPE.MENU_ONLY
      ? 0
      : Constants.MIN_NUMBER_OF_PEOPLE;
  const MAX_NUMBER_OF_PEOPLE =
    Globals.isClosed ||
    Globals.selectedDepartment.type_id === Constants.DEPARTMENT_TYPE.MENU_ONLY
      ? 0
      : Globals.selectedDepartment.max_peep;
  const [peopleCount, setPeopleCount] = useState(MIN_NUMBER_OF_PEOPLE);
  const [info, setInfo] = useState({});

  useEffect(() => {
    callQueueInfo();
  }, []);

  const openCheckIn = () => {
    DefaultPreference.getMultiple(["cprofile_id"])
      .then(function (values) {
        if (values[0] != null) {
          let par = {
            queue_id: info.queue_id,
            cprofile_id: values[0],
            peep: peopleCount,
            department_id: Globals.selectedDepartment.department_id,
          };
          
          // console.log(par);
          CallApi(par, "addcheckin")
            .then((res) => {
              // console.log(res);
              if (res.status == 200) {
                Globals.selectedSlotId = res.slot_id;
                props.openDepartmentDetails(Constants.CHECK_IN_TICKET);
              } else {
                Toast.show(res.msg, Toast.SHORT, ["UIAlertController"]);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("error");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const callQueueInfo = () => {
    let par = {
      department_id: Globals.selectedDepartment.department_id,
      different: Globals.differentTime,
    };
    // console.log(par);
    CallApi(par, "getCheckin")
      .then((res) => {
        // console.log(res);
        if (res.status == 200) {
          setInfo(res.info);
        } else {
          console.warn(res);
        }
      })
      .catch((err) => {
        console.warn(err);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainView}>
        <Text style={styles.description}>
          Due to government regulations, contact details has to be left at the
          door of this pemise to be contacted in case of outbreak. This will not
          be necessary since you are already registered to 2Cool2Q. To preserve
          your privacy, the business will not hold your details. In case of need
          to be contacted it will be throuhg a notification in your app.
          Checking-in you agree to receive this information.
        </Text>

        <View style={styles.checkInContainer}>
          <QuantityCounter
            count={peopleCount}
            min={MIN_NUMBER_OF_PEOPLE}
            max={MAX_NUMBER_OF_PEOPLE}
            onCountChange={setPeopleCount}
          />

          <View style={styles.openCheckIn}>
            <TouchableOpacity
              onPress={() => {
                if (
                  Globals.selectedDepartment.isIn == 1 &&
                  Globals.isClosed == 0 &&
                  peopleCount > 0 &&
                  info.queue_id != null
                ) {
                  openCheckIn();
                } else {
                }
              }}
            >
              <View
                style={[
                  common_styles.secondaryBtn,
                  {
                    backgroundColor:
                      Globals.selectedDepartment.isIn == 1 &&
                      Globals.isClosed == 0 &&
                      peopleCount > 0
                        ? BaseColor.primaryBlueColor
                        : BaseColor.grayColor,
                  },
                ]}
              >
                <Text style={common_styles.btnText}> Check me in</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
