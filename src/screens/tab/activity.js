import React, { useState, useEffect, useRef } from "react";
import {
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import styles from "../../common/style";
import { BaseColor } from "../../common/color";
import { BoxShadow } from "react-native-shadow";
import Topbar from "../../component/topbar";
import { Constants } from "../../config/constants";
import { Globals, MyLocation } from "../../config/globals";
import { CallApi } from "../../service/business";
import DefaultPreference from "react-native-default-preference";
import Modal from "react-native-modal";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import Toast from "react-native-simple-toast";
import SearchBar from "../../component/SearchBar";
import QueuePositionOrdinal from "component/ticket/QueuePositionOrdinal";

var _date = "";
export default function ActivityView(props) {
  const [items, setItems] = useState([
    { title: "Check-ins", isShown: false, len: 0, itemDetails: [] },
    { title: "Queues", isShown: false, len: 0, itemDetails: [] },
    { title: "Bookings", isShown: false, len: 0, itemDetails: [] },
    { title: "Orders", isShown: false, len: 0, itemDetails: [] },
    { title: "Reminders", isShown: false, len: 0, itemDetails: [] },
  ]);

  const [isCalendar, setCalendar] = useState(false);
  const [showCalendar, setShowCalendar] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  const [onEndReachedCalled, setEndReachedCalled] = useState(false);
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const [notification, setNotification] = useState(0);

  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    callActivity("", _date);
  }, []);

  const handleSearchSubmit = () => {
    callActivity(searchText, _date);
  };

  const handleSearchTextChange = (text) => {
    setSearchText(text);
    const isLengthValidForSearch = text.length === 0 || text.length >= 3;
    if (isLengthValidForSearch && !onEndReachedCalled) {
      setEndReachedCalled(true);
      callActivity(text, _date);
    }
  };

  goBack = () => {
    Globals.isBackClicked = true;
    props.changeContentPage(Constants.TAB_SEARCH_PAGE);
  };

  const callActivity = (text, date) => {
    DefaultPreference.getMultiple(["cprofile_id"])
      .then(function (values) {
        if (values[0] != null) {
          let param = {
            cprofile_id: values[0],
            lat: MyLocation.lat,
            lng: MyLocation.lng,
            key: text,
            dt: date,
          };
          // console.log(param);
          CallApi(param, "activity")
            .then((res) => {
              setEndReachedCalled(false);
              // Active ticket counters
              // checkin ticket counter
              if (res.status == 200) {
                var isCheckin = false;
                var checkInCount = 0;
                for (var i = 0; i < res.checkin.length; i++) {
                  if (res.checkin[i].client_status == 1 || res.checkin[i].client_status == 2 || res.checkin[i].client_status == 3 || res.checkin[i].client_status == 4) {
                    isCheckin = true;
                    checkInCount = checkInCount + 1;
                  }
                }

              // queue ticket counter  
                var isQueue = false;
                var queueCount = 0;

                for (var i = 0; i < res.queue.length; i++) {
                  if (res.queue[i].client_status == 1 || res.queue[i].client_status == 2 || res.queue[i].client_status == 3 || res.queue[i].client_status == 4) {
                    isQueue = true;
                    queueCount = queueCount + 1;
                  }
                }
              // booking ticket counter
                var isBooking = false;
                var bookingCount = 0;

                for (var i = 0; i < res.booking.length; i++) {
                  if (res.booking[i].client_status == 1 || res.booking[i].client_status == 2 || res.booking[i].client_status == 3 || res.booking[i].client_status == 4) {
                    isBooking = true;
                    bookingCount = bookingCount + 1;
                  }
                }
              // order ticket counter
                var isOrder = false;
                var orderCount = 0;

                for (var i = 0; i < res.order.length; i++) {
                  if (res.order[i].order_status == 1 || res.order[i].order_status == 2 || res.order[i].order_status == 4 || res.order[i].order_status == 5 ) {
                    isOrder = true;
                    orderCount = orderCount + 1;
                  }
                }

                setNotification(
                  checkInCount + queueCount + bookingCount + orderCount
                );
                Globals.notification =
                  checkInCount + queueCount + bookingCount + orderCount;
                props.setNotificationVal(
                  checkInCount + queueCount + bookingCount + orderCount
                );

                // console.log("order --- data", res.order);
                let item = [
                  {
                    title: "Check-ins",
                    isShown: false,
                    len: checkInCount,
                    itemDetails: res.checkin,
                    status: isCheckin,
                  },
                  {
                    title: "Queues",
                    isShown: false,
                    len: queueCount,
                    itemDetails: res.queue,
                    status: isQueue,
                  },
                  {
                    title: "Bookings",
                    isShown: false,
                    len: bookingCount,
                    itemDetails: res.booking,
                    status: isBooking,
                  },
                  {
                    title: "Orders",
                    isShown: false,
                    len: orderCount,
                    itemDetails: res.order,
                    status: isOrder,
                  },
                  {
                    title: "Reminders",
                    isShown: false,
                    len: 0,
                    itemDetails: [],
                  },
                ];
                //_items = item;
                setItems(item);
              } else if (res.status === 300 || res.status === 400) {
                Toast.show(res.msg, Toast.SHORT, ["UIAlertController"]);
              } else {
                Toast.show(res.msg, Toast.SHORT, ["UIAlertController"]);
              }
            })
            .catch((err) => {
              setEndReachedCalled(false);
              console.log(err);
            });
        } else {
          setEndReachedCalled(false);
        }
      })
      .catch((err) => {});
  };

  const updateActivityLayout = (index) => {
    // console.log("clicked");
    let newArr = [...items];
    let tmp = !newArr[index].isShown;

    for (var i = 0; i < newArr.length; i++) {
      newArr[i].isShown = false;
    }
    newArr[index].isShown = tmp;
    let expanded = newArr[index].isShown;
    setItems(newArr);
    // console.log("newArr", newArr);
    if (expanded) {
      Animated.timing(animatedOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animatedOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  };

  const showDate = (item, title) => {
    // order ticket details
    if (title == "Orders") {
      if (item.weekofday != null) {
        return (
          <View>
            <Text
              style={[styles.itemDescription, { marginTop: 5 }]}
              numberOfLines={1}
            >
              {item.weekofday.slice(0, 3)} {item.day} {item.month.slice(0, 3)}
            </Text>
            <Text
              style={[styles.itemDescription, { marginTop: 0 }]}
              numberOfLines={1}
            >
              {item.start_time.trim()}
            </Text>
          </View>
        );
      }
    } else {
      // checkin ticket details
      if (item.QTYPE_ID == 1 || item.QTYPE_ID == 2) {
        return (
          <View>
            {item.weekofday != null && (
              <Text
                style={[styles.itemDescription, { marginTop: 5 }]}
                numberOfLines={1}
              >
                {item.weekofday.slice(0, 3)} {item.day} {item.month.slice(0, 3)}
              </Text>
            )}

            {item.checkin_time != null && (
              <Text
                style={[styles.itemDescription, { marginTop: 0 }]}
                numberOfLines={1}
              >
                {item.checkin_time.trim()}
              </Text>
            )}
          </View>
        );
      // inactive queue ticket details
      } else if (item.QTYPE_ID == 3) {
        if (item.client_status == 5 || item.client_status == 6) {
          return (
            <View>
              {item.weekofday != null && (
                <Text style={styles.itemDescription} numberOfLines={1}>
                  {item.weekofday.slice(0, 3)} {item.day}{" "}
                  {item.month.slice(0, 3)}
                </Text>
              )}

              {item.checkin_time != null && (
                <Text style={styles.itemDescription} numberOfLines={1}>
                  {item.checkin_time.trim()}
                </Text>
              )}
                <Text
                  style={[
                    styles.itemDescription,
                    { marginTop: 0, alignSelf: "flex-end" },
                  ]}
                  numberOfLines={1}
                >
                  {" "}
                </Text>
            </View>
          );
        // TODO: check what this part is for
        } else {
          return (
            <View>
              {item.weekofday != null && (
                <Text
                  style={[styles.itemDescription, { marginTop: 5 }]}
                  numberOfLines={1}
                >
                  {item.weekofday.slice(0, 3)} {item.day}{" "}
                  {item.month.slice(0, 3)}
                </Text>
              )}

              <View style={{ flexDirection: "row" }}>
                {item.checkin_time != null && (
                  <Text style={styles.itemDescription} numberOfLines={1}>
                    {item.checkin_time.trim()}
                  </Text>
                )}
                <Text
                  style={[
                    styles.itemDescription,
                    { marginTop: 0, alignSelf: "flex-end" },
                  ]}
                  numberOfLines={1}
                >
                  {" "}
                </Text>
              </View>
            </View>
          );
        }
        // booking/groups ticket details
      } else if (item.QTYPE_ID == 4 || item.QTYPE_ID == 5) {
        if (item.checked_out) {
          // inactivate

          return (
            <View>
              <Text
                style={[styles.itemDescription, { marginTop: 5 }]}
                numberOfLines={1}
              >
                {item.weekofday.slice(0, 3)} {item.day} {item.month.slice(0, 3)}
              </Text>
              <Text
                style={[styles.itemDescription, { marginTop: 0 }]}
                numberOfLines={1}
              >
                {item.start_time.trim()}
              </Text>
            </View>
          );
        } else {
          // activate
          return (
            <View>
              <Text
                style={[styles.itemDescription, { marginTop: 5 }]}
                numberOfLines={1}
              >
                {item.weekofday.slice(0, 3)} {item.day} {item.month.slice(0, 3)}
              </Text>
              <Text
                style={[styles.itemDescription, { marginTop: 0 }]}
                numberOfLines={1}
              >
                {item.start_time.trim()}
              </Text>
            </View>
          );
        }
      }
    }
  };

  const showExpand = (item_type) => {
    if (item_type.len == 0) {
      return (
        <View style={{ position: "absolute", right: 25, top: 0 }}>
          <Image
            style={{ width: 25, height: 25 }}
            source={require("../../assets/icon_collapse_expand.png")}
            resizeMode="stretch"
          />
        </View>
      );
    } else {
      if (item_type.isShown) {
        return (
          <View style={{ position: "absolute", right: 25, top: 0 }}>
            <Image
              style={{ width: 25, height: 25 }}
              source={require("../../assets/icon_blue_up.png")}
              resizeMode="stretch"
            />
          </View>
        );
      } else {
        return (
          <View style={{ position: "absolute", right: 25, top: 0 }}>
            <Image
              style={{ width: 25, height: 25 }}
              source={require("../../assets/icon_blue_down.png")}
              resizeMode="stretch"
            />
          </View>
        );
      }
    }
  };

  const rednerItemDetail = (item, title) => {
    return (
      <View
        style={{
          backgroundColor: "#fff",
          marginTop: 0,
          marginBottom: 5,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            Globals.selectedSlotId = item.slot_id;
            Globals.selectedDepartment = {
              name: item.dept_name,
              isMenu: 0,
              department_id: item.department_id,
              queue_is_closed: false,
              max_peep: item.max_peep,
            }; // for showing menu button..
            
            // console.log("department data", Globals.selectedDepartment);
            if (title == "Orders") {
              Globals.selectedBusiness = {
                business: item,
                photo: item.photo,
                type: "orders",
              };
              props.openMenuPage();
            } else {
              if (item.QTYPE_ID == 1 || item.QTYPE_ID == 2) {
                Globals.selectedBusiness = {
                  business: item,
                  photo: item.photo,
                  type: "checkin",
                };
                if (item.client_status == 5) {
                  props.openFeedback();
                } else {
                  props.changeContentPage(Constants.AVAILABILITY);
                }
              } else if (item.QTYPE_ID == 3) {
                Globals.selectedBusiness = {
                  business: item,
                  photo: item.photo,
                  type: "queue",
                };
                
                // console.log("selected business", Globals.selectedBusiness);
                if (item.client_status == 5) {
                  props.openFeedback();
                } else {
                  props.changeContentPage(Constants.AVAILABILITY);
                }
              } else if (item.QTYPE_ID == 4 || item.QTYPE_ID == 5) {
                Globals.selectedBusiness = {
                  business: item,
                  photo: item.photo,
                  type: "book",
                };

                if (item.client_status == 5) {
                  props.openFeedback();
                } else {
                  props.changeContentPage(Constants.AVAILABILITY);
                }
              }
            }
          }}
        >
          <BoxShadow
            setting={{
              width: Dimensions.get("window").width - 40,
              height: 105,
              color: "#000",
              border: 5,
              radius: 3,
              opacity: 0.1,
              x: 0,
              y: 3,
              style: { marginVertical: 5 },
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                backgroundColor: BaseColor.whiteColor,
                marginTop: 1,
                borderRadius: 3,
              }}
            >
              <Image
                style={styles.itemImgActivity}
                source={{ uri: item.photo }}
                resizeMode="cover"
              />

              <View
                style={{ flex: 1, marginLeft: 10, justifyContent: "center" }}
              >
                <Text style={styles.itemTitle} numberOfLines={1}>
                  {item.name}
                </Text>

                {showDate(item, title)}

                <View style={{ flexDirection: "row", marginTop: 10 }}>
                 {(item.client_status == 5 || item.client_status == 6 || (title == "Orders" && item.order_status == 6)) && ( // && item.QTYPE_ID != 4 && item.QTYPE_ID != 5
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={[
                            styles.itemStarText,
                            { color: BaseColor.grayColor, marginRight: 5 },
                          ]}
                        >
                          {item.star != null ? item.star.toFixed(1) : "0.0"}
                        </Text>
                        <Image
                          style={styles.itemIcon}
                          source={require("../../assets/star_grey.png")}
                          resizeMode="stretch"
                        />
                      </View>
                    )}

                  {(item.client_status == 1 || item.client_status == 2 || item.client_status == 3 || item.client_status == 4
                   || (title == "Orders" && item.order_status != 6)) && ( // || item.QTYPE_ID == 4 || item.QTYPE_ID == 5
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={[
                          styles.itemStarText,
                          { color: BaseColor.textColor, marginRight: 5 },
                        ]}
                      >
                        {item.star != null ? item.star.toFixed(1) : "0.0"}
                      </Text>
                      <Image
                        style={styles.itemIcon}
                        source={require("../../assets/star.png")}
                        resizeMode="stretch"
                      />
                    </View>
                  )}
                    <View
                      style={{
                        flex: 2,
                        flexDirection: "row",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Text
                        style={[styles.itemTimeText, { 
                          marginRight: 0,
                          color: (item.client_status == 5 || item.client_status == 6 || (title == "Orders" && item.order_status == 6))
                          ? BaseColor.grayColor
                          : BaseColor.textColor }]}
                        numberOfLines={1}
                      >
                        {" "}
                        {item.Distance.toFixed(2)} km{" "}
                      </Text>
                    </View>
                </View>
              </View>

              <View style={{ marginRight: 0, marginTop: 0, marginBottom: 0 }}>
                <View style={{ marginLeft: 0 }}>
                  {(item.client_status == 1 || item.client_status == 2 || item.client_status == 3 || item.client_status == 4 /*|| item.order_status != 6*/) && ( // || item.QTYPE_ID == 4 || item.QTYPE_ID == 5
                    <Image
                      style={{ width: 120, height: 105}}
                      source={require("../../assets/img_ticket_blue.jpg")}
                      resizeMode="stretch"
                    />
                  )}

                  {(item.client_status == 5 || item.client_status == 6 /*|| item.order_status == 6*/) && ( //&& item.QTYPE_ID != 4 && item.QTYPE_ID != 5
                    <Image
                      style={{ width: 120, height: 105 }}
                      source={require("../../assets/img_ticket_grey.jpg")}
                      resizeMode="stretch"
                    />
                  )}

                  {(title == "Orders" && item.price != null) && (
                    <>
                    <Image
                    style={{ width: 120, height: 105}}
                    source= {item.order_status == 6
                    ? require("../../assets/img_ticket_grey.jpg")
                    : require("../../assets/img_ticket_blue.jpg")}
                    resizeMode="stretch"
                    />
                    <View style={{
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          paddingRight: 0,
                          alignItems: "center",
                          justifyContent: "center",
                      }}>
                     <Text
                      style={{
                        fontSize: 17,
                        fontWeight: "700",
                        color: item.order_status == 6
                          ? BaseColor.grayColor
                          : BaseColor.textColor,
												 
                      }}
					 
						   
								
									   
											
												 
												 
												  
						  
                      >
                      £{item.price.toFixed(2)}
                      </Text>
                    </View>
                    </>
                  )}

                  {(item.QTYPE_ID == 4 || item.QTYPE_ID == 5) &&
                    title != "Orders" && (
                      <View
                        style={{
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          paddingRight: 0,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 17,
                            fontWeight: "700",
                            color: item.client_status == 5
                              ? BaseColor.grayColor
                              : BaseColor.textColor,
                          }}
                        >
                          #{item.ticket_number}
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "700",
                            color: item.client_status == 5
                              ? BaseColor.grayColor
                              : BaseColor.textColor,
                          }}
                        >
                          {item.day} {item.month.slice(0, 3)}
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "700",
                            color: item.client_status == 5
                             ? BaseColor.grayColor
                              : BaseColor.textColor,
                          }}
                        >
                          @{item.start_time}
                        </Text>
                      </View>
                    )}

                  {item.QTYPE_ID != 4 &&
                    item.QTYPE_ID != 5 &&
                    title != "Orders" && (
                      <View
                        style={{
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          paddingRight: 0,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: "700",
                            color: (item.client_status == 5 || item.client_status == 6)
                              ? BaseColor.grayColor
                              : BaseColor.textColor,
                          }}
                          >
                          #{item.ticket_number}
                        </Text>

                        {item.QTYPE_ID == 3 && (item.client_status == 1 || item.client_status == 2 || item.client_status == 4) && (
                          <View>
                            {/* Ticket position number ordinal */}
                            <QueuePositionOrdinal style={{padding: 0, margin: 0,}}
                              positionNo = {item.current_position} 
                              clientStatus = {item.client_status} 
                              nFontColour= {BaseColor.blackColor} 
                              nFontSize={16} 
                              nFontWeight = {"600"}>
                              </QueuePositionOrdinal>

                            <Text
                              style={{
                                alignItems: "center",
                                fontSize: 12,
                                fontWeight: "700",
													   
                                color: BaseColor.textColor,
														
                              }}
                            >
                              {item.current_position > 0 ? "in the queue" : "                        "}
                            </Text>
                          </View>
                        )}
                        {(item.QTYPE_ID == 3 && item.client_status == 6) && (
                          <View>
                            <Text
                              style={{
                                alignItems: "center",
                                fontSize: 16,
                                fontWeight: "700",
                                color: BaseColor.grayColor,
                              }}
                            >
                              No Show
                            </Text>
                          </View>
                        )}

                        {(item.QTYPE_ID == 3 && item.client_status == 5) && (
                          <View>
                            <Text
                              style={{
                                alignItems: "center",
                                fontSize: 14,
                                fontWeight: "700",
                                color: BaseColor.grayColor,
                              }}
                            >
                              Checked out
                            </Text>
                          </View>
                        )}

                        {(item.QTYPE_ID == 3 && item.client_status == 3) && (
                          <View>
                            <Text
                              style={{
                                alignItems: "center",
                                fontSize: 16,
                                fontWeight: "700",
                                color: BaseColor.textColor,
                              }}
                            >
                              Your turn!
                            </Text>
                          </View>
                        )}						  
                      </View>
                    )}
                </View>
              </View>
            </View>
          </BoxShadow>
        </TouchableOpacity>
      </View>
    );
  };

  const renderItem = (item_type, index) => {
    return (
      <View>
        <View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => {
                updateActivityLayout(index);
              }}
              style={{
                flex: 1,
                marginLeft: 20,
                paddingTop: 10,
                paddingBottom: 10,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={[
                    styles.itemTitle,
                    {
                      fontWeight: "600",
                      color:
                        item_type.status == true
                          ? BaseColor.blackColor
                          : BaseColor.grayColor,
                    },
                  ]}
                >
                  {item_type.title}
                </Text>

                <View style={{}} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                updateActivityLayout(index);
              }}
            >
              <View style={{ flexDirection: "row" }}>
                {showExpand(item_type)}


                {item_type.len > 0 && (   // Condition to enlapse the ones with content
                  <View
                    style={[
                      styles.sign,
                      {
                        marginRight: 60,
                        alignContent: "center",
                        borderWidth: 1,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.itemTitle,
                        {
                          color: BaseColor.primaryBlueColor,
                          //paddingTop: 2,
                          //paddingRight: 3,
                          textAlign: "center",
                        },
                      ]}
                    >
                      {" "}
                      {item_type.len}{" "}
                    </Text>
                  </View>
                 )
                }
                {  //nly shows rhe grey arrow
                item_type.len == 0 && (
                  <Text style={[styles.itemTitle, { marginRight: 60 }]}> </Text>
                ) }
              </View>
            </TouchableOpacity>
          </View>

          {item_type.isShown && (
            <Animated.View
              style={{
                marginLeft: 20,
                marginRight: 20,
                opacity: animatedOpacity,
              }}
            >
              <FlatList
                showsVerticalScrollIndicator={false}
                style={{ marginTop: 0, marginBottom: 0 }}
                keyExtractor={(item, index) => index.toString()}
                data={item_type.itemDetails}
                renderItem={({ item }) =>
                  rednerItemDetail(item, item_type.title)
                }
              />
            </Animated.View>
          )}

          <View style={styles.divider} />
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        backgroundColor: BaseColor.mainBackground,
      }}
    >
      <Topbar {...this} />

      <View
        style={{
          flexDirection: "row",
          height: 50,
          marginTop: 10,
          alignItems: "center",
          alignContent: "center",
          paddingVertical: 10,
          paddingHorizontal: 10,
          justifyContent: "space-between",
        }}
      >
        {/* Activity text with badge*/}
        <View
          style={{
            // flex: 1,
            flexDirection: "row",
            alignContent: "center",
            justifyContent: "center",
            marginHorizontal: 10
          }}
        >
          <View>
            <Text
              style={[
                styles.primaryText,
                { color: BaseColor.primaryBlueColor,
                marginTop: 5 },
              ]}
            >
              Activities
            </Text>
          </View>

          {notification > 0 && (
            <View
              style={[
                styles.sign,
                { alignContent: "center", marginLeft: 10, borderWidth: 1 },
              ]}
            >
              <Text
                style={[
                  styles.itemTitle,
                  {
                    color: BaseColor.primaryBlueColor,
                    //paddingTop: 1,
                    //paddingRight: 3,
                    textAlign: "center",
                  },
                ]}
              >

                {notification}
              </Text>
            </View>
          )}
        </View>

        <SearchBar
          value={searchText}
          onSubmit={handleSearchSubmit}
          onChange={handleSearchTextChange}
        />

        {/* Calendar button */}
        <View style={{ alignItems: "flex-end", marginHorizontal: 10 }}>
          {showCalendar && (
            <TouchableOpacity onPress={() => setCalendar(true)}>
              <Image
                style={{ width: 20, height: 20 }}
                source={require("../../assets/icon_calendar.png")}
                resizeMode="stretch"
              />
            </TouchableOpacity>
          )}

          {!showCalendar && (
            <TouchableOpacity
              onPress={() => {
                setShowCalendar(true);
                _date = "";
                callActivity(searchText, _date);
              }}
            >
              <View
                style={{
                  backgroundColor: BaseColor.primaryBlueColor,
                  padding: 5,
                  width: 40,
                  alignItems: "center",
                }}
              >
                <Text
                  style={[
                    styles.primaryText,
                    { color: BaseColor.whiteColor, fontSize: 14 },
                  ]}
                >
                  {selectedDay}
                </Text>
                <Text
                  style={[
                    styles.secondaryText,
                    {
                      color: BaseColor.whiteColor,
                      fontSize: 12,
                      marginTop: -3,
                    },
                  ]}
                >
                  {selectedMonth}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{ marginTop: 10, marginBottom: 30 }}
          keyExtractor={(item, index) => index.toString()}
          data={items}
          renderItem={({ item, index }) => renderItem(item, index)}
        />
      </View>

      <Modal
        style={{ margin: 30, borderRadius: 3 }}
        backdropColor="#000"
        isVisible={isCalendar}
      >
        <View
          style={{
            backgroundColor: BaseColor.whiteColor,
            padding: 10,
            borderRadius: 10,
          }}
        >
          <View style={{ marginVertical: 0, paddingBottom: 20, width: "100%" }}>
            <Calendar
              style={{
                marginTop: 20,
                height: 350,
              }}
              // Specify theme properties to override specific styles for calendar parts. Default = {}
              theme={{
                arrowColor: BaseColor.primaryBlueColor,
                "stylesheet.calendar.header": {
                  week: {
                    marginTop: 15,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  },
                },
              }}
              onDayPress={(day) => {
                // console.log("selected day", day);
                var date2 = new Date();
                var sel = new Date(day.dateString);

                //let now = new Date();
                var current_date = moment(sel).add(0, "day").format("DD MMM"); // format('MMM DD, YY');
                // console.log(current_date);

                callActivity(searchText, day.dateString);
                setCalendar(false);
                setSelectedDate(current_date);
                setSelectedDay(day.day);
                setSelectedMonth(moment(sel).add(0, "day").format("MMM"));

                setShowCalendar(false);
              }}
            />
            <TouchableOpacity
              style={{ position: "absolute", right: 0, top: 0, margin: 0 }}
              onPress={() => {
                setCalendar(false);
              }}
            >
              <Image
                style={{ width: 25, height: 25, marginBottom: 10 }}
                source={require("../../assets/icon_dialog_close.png")}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
