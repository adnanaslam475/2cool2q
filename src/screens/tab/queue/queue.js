import React, { useState, useEffect } from "react";
import { View, ScrollView, Text, TouchableOpacity } from "react-native";
import common_styles from "../../../common/style";
import { Constants } from "../../../config/constants";
import { CallApi } from "../../../service/business";
import { Globals } from "../../../config/globals";
import DefaultPreference from "react-native-default-preference";
import Toast from "react-native-simple-toast";
import { BaseColor } from "../../../common/color";
import MinsToHoursRangeConverter from "../../../component/ticket/MinsToHoursRangeConverter";
import QuantityCounter from "../../../component/QuantityCounter";
import Styles from "../../../styles/pages/queue";

export default function QueueView(props) {
  const [peep, setPeep] = useState(1);
  const [info, setInfo] = useState({});

  useEffect(() => {
    callQueueInfo();
  }, []);

  const openQueue = () => {
    DefaultPreference.getMultiple(["cprofile_id"])
      .then(function (values) {
        if (values[0] != null) {
          let par = {
            queue_id: info.queue_id,
            cprofile_id: values[0],
            peep: peep,
            department_id: Globals.selectedDepartment.department_id,
          };

          if (info.queue_id !== undefined && info.queue_id != null) {
            // console.log(par);
            CallApi(par, "addqueue")
              .then((res) => {
                // console.log(res);
                if (res.status === 200) {
                  Globals.selectedSlotId = res.slot_id;
                  props.openDepartmentDetails(Constants.QUEUE_TICKET);
                } else {
                  props.openDepartmentDetails(Constants.QUEUE_TICKET);
                  Toast.show(res.msg, Toast.SHORT, ["UIAlertController"]);
                }
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            Toast.show("Please wait a sec, Try now again.", Toast.SHORT, [
              "UIAlertController",
            ]);
          }
        }
      })
      .catch((_err) => {});
  };

  const callQueueInfo = () => {
    DefaultPreference.getMultiple(["cprofile_id"])
      .then(function (values) {
        // console.log("=============== Globals.differentTime =", Globals.differentTime);
        if (values[0] != null) {
          let par = {
            department_id: Globals.selectedDepartment.department_id,
            different: Globals.differentTime,
            cprofile_id: values[0],
            opentime: Globals.open_time,
          };
          CallApi(par, "getqueue")
            .then((res) => {
              console.log(res);
              if (res.status === 200) {
                setInfo(res.info);
              } else if (res.status === 300) {
                // already exist. // this will be called only when press back button on ticket page for new.
                Globals.selectedSlotId = res.queue_slot_id;
                if (
                  Globals.selectedSlotId !== null &&
                  Globals.selectedSlotId !== undefined
                ) {
                  if (props.getQueueBack() === 1) {
                    props.openDepartmentDetails(Constants.DEPARTMENT);
                  } else {
                    props.openDepartmentDetails(Constants.QUEUE_TICKET);
                  }
                }
              } else if (res.status === 300 || res.status === 400) {	
                Toast.show(res.msg, Toast.SHORT, ["UIAlertController"]);
              } else {
                Toast.show(res.msg, Toast.SHORT, ["UIAlertController"]);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((_err) => {});
  };

  const renderStatus = (isIn, isClosed) => {
    console.log("IS CLOSED VALUE ===", isClosed);
    if (isClosed === 1) {
      return (
        <View style={Styles.alignItemCenter}>
          <Text style={[common_styles.primaryText, Styles.queueText]}>
            The business is closed.
          </Text>
        </View>
      );
    } else {
      console.log("IS IN VALUE ===", isIn);
      if (isIn == 0) {
        return (
          <View style={Styles.alignItemCenter}>
            <Text style={[common_styles.primaryText, Styles.queueText]}>
              The Queue is closed.
            </Text>
            <Text style={[common_styles.primaryText, Styles.queueTextRed]}>
              Opens at {Globals.selectedDepartment.open_time}
            </Text>
          </View>
        );
      }
    }
  };

  return (
    <View style={Styles.mainContainer}>
      <ScrollView>
        <View style={Styles.alignItemCenter}>
          {Globals.selectedDepartment.isIn === 1 && Globals.isClosed === 0 && (
            <View style={Styles.selectDepartmentContainer}>
              <View style={Styles.selectDepartmentView}>
                {info.total_queue != null && (
                  <Text style={common_styles.title}>{info.total_queue}</Text>
                )}
                <Text
                  style={[
                    common_styles.secondaryText,
                    { color: BaseColor.grayColor },
                  ]}
                >
                  In the queue{" "}
                </Text>
              </View>

              {/* Waiting Time Range */}
              <View style={Styles.mainQueue}>
                {info.waiting_time != null && (
                  <Text style={[common_styles.title, Styles.queueMarginLeft]}>
                    <MinsToHoursRangeConverter 
                      minutesFrom = {info.waiting_time === 0
                        ? 0
                        : (
                        info.waiting_time -
                        info.avg_waiting_time * 0.5
									
						 

														
											 
													 
                      ).toFixed(0)} 
                      minutesTo = {(

						   
																				 
					   
							 
                        info.waiting_time + 
                        info.avg_waiting_time * 0.5
                        ).toFixed(0)} 
                      nFontColour= {BaseColor.blackColor} nFontSize={18} 
                      nFontWeight = {"600"}></MinsToHoursRangeConverter>
                  </Text>
                )}
                <Text
                  style={[
                    common_styles.secondaryText,
                    { color: BaseColor.grayColor },
                  ]}
                >
                  Waiting time
                </Text>
              </View>
              
              {/* Estimated Time */}
              <View style={Styles.estimateTime}>
                {info.expected_time != null && (
                  <Text style={[common_styles.title, Styles.queueMarginLeft]}>
                    {info.expected_time.trim()}
                  </Text>
                )}
                <Text
                  style={[
                    common_styles.secondaryText,
                    { color: BaseColor.grayColor },
                  ]}
                >
                  Estimated time{" "}
                </Text>
              </View>
            </View>
          )}
          {renderStatus(Globals.selectedDepartment.isIn, Globals.isClosed)}
          {
            <View style={Styles.mainOpenQueue}>
              <View style={Styles.openQueueContainer}>
                <QuantityCounter
                  onCountChange={setPeep}
                  count={peep}
                  min={Constants.MIN_NUMBER_OF_PEOPLE}
                  max={Globals.selectedDepartment.max_peep}
                />
                <View style={Styles.openQueueList}>
                  <TouchableOpacity
                    onPress={() => {
                      if (
                        Globals.selectedDepartment.isIn === 1 &&
                        Globals.isClosed === 0 &&
                        peep > 0
                      ) {
                        openQueue();
                      }
                    }}
                  >
                    <View
                      style={[
                        common_styles.secondaryBtn,
                        {
                          backgroundColor:
                            Globals.selectedDepartment.isIn === 1 &&
                            Globals.isClosed === 0 &&
                            peep > 0
                              ? BaseColor.primaryBlueColor
                              : BaseColor.grayColor,
                        },
                      ]}
                    >
                      <Text style={common_styles.btnText}> Queue me </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          }
        </View>
      </ScrollView>
    </View>
  );
}
