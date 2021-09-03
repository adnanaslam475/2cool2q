import React, { useState, useEffect, useRef } from "react";
import {
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import styles from "../checkin/style";
import common_styles from "../../../common/style";
import { Constants } from "../../../config/constants";
import CheckBox from "react-native-checkbox";
import { BaseColor } from "../../../common/color";
import { Calendar } from "react-native-calendars";
import Modal from "react-native-modal";
import {
  availableSlots,
  availableDates,
  CallApi,
} from "../../../service/business";
import Toast from "react-native-simple-toast";
import { Globals } from "../../../config/globals";
import DefaultPreference from "react-native-default-preference";
import moment from "moment";
import QuantityCounter from "../../../component/QuantityCounter";
import {
  ICON_LEFT_ARROW_GRAY,
  ICON_LEFT_ARROW,
  ICON_RIGHT_ARROW_GRAY,
  ICON_RIGHT_ARROW,
  ICON_AFTERNOON,
  ICON_NIGHT,
  ICON_CALENDER,
  CloseIcon,
} from "../../../assets/index";
import Styles from "../../../styles/pages/bookview";

var _slotId = 0;
var scroll_max = 0;
var content_width = 0;
var current_date = "";
var _min_date = "";
var _max_date = "";
var _page_min = 1;
var _page_max = 1;
var _total_page = 0;
var _isCalendarCall = 0;
var _step = (Dimensions.get("window").width - 110) / 3 - 10 - 5;
var _limit = 270;

export default function BookView(props) {
  const [isSecond, setSecond] = useState(false);
  const [isThird, setThird] = useState(false);
  const [isCalendar, setCalendar] = useState(false);
  const scroll = useRef();
  const [slots, setSlots] = useState([]);
  const [currentSlots, setCurrentSlots] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [slotId, setSlotId] = useState(0);
  const [peep, setPeep] = useState(1);
  const [isNoSlot, setIsNoSlot] = useState(false);
  const [isCallEnd, setCallEnd] = useState(true);
  const [scrollable, setScrollable] = useState(true);
  const [oldSlotId, setOldSlotId] = useState(true);
  const [scrollWidth, setScrollWidth] = useState(0);
  useEffect(() => {
    scroll_max = 0;
    if (Globals.isBookChange) {
      _slotId = Globals.selectedSlotId;
      setOldSlotId(Globals.selectedSlotId);
    } else {
      _slotId = 0;
    }
    // console.log("step width " + _step);
    content_width = 0;
    setPeep(1);
    callAvailableDates();
  }, []);

  const callSlotsByDate = (type) => {
    var current = new Date(current_date);
    if (type == "prev") {
      current_date = moment(current).add(-1, "day").format("YYYY-MM-DD");
    } else if (type == "next") {
      current_date = moment(current).add(1, "day").format("YYYY-MM-DD");
    }
    if (markedDates[current_date]) {
      setCallEnd(false);
      callAvailableSlots(current_date, type);
    } else {
      if (type == "prev") {
        current_date = moment(current).add(1, "day").format("YYYY-MM-DD");
      } else if (type == "next") {
        current_date = moment(current).add(-1, "day").format("YYYY-MM-DD");
      }
    }
  };

  const callSlotsByPage = (type) => {
    setCallEnd(false);
    callAvailableSlots("", type);
  };

  const setDayNightSlot = (total_slots, isSecond, isThird) => {
    var current = total_slots.filter((item) => {
      var flag = false;
      if (
        (isSecond == false && isThird == false) ||
        (isSecond == true && isThird == true)
      ) {
        flag = true;
      }

      if (isSecond == true && isThird == false) {
        if (item.isIn == "day") {
          flag = true;
        }
      }

      if (isSecond == false && isThird == true) {
        if (item.isIn == "night") {
          flag = true;
        }
      }

      if (isSecond == true && isThird == true) {
        if (item.isIn == "day" || item.isIn == "night") {
          flag = true;
        }
      }
      return flag;
    });
    // console.log("current slots ===== ", current);
    setCurrentSlots(current);
  };

  const getLengthOfSlots = (total_slots, isSecond, isThird) => {
    var current = total_slots.filter((item) => {
      var flag = false;
      if (
        (isSecond == false && isThird == false) ||
        (isSecond == true && isThird == true)
      ) {
        flag = true;
      }
      if (isSecond == true && isThird == false) {
        if (item.isIn == "day") {
          flag = true;
        }
      }
      if (isSecond == false && isThird == true) {
        if (item.isIn == "night") {
          flag = true;
        }
      }
      if (isSecond == true && isThird == true) {
        if (item.isIn == "day" || item.isIn == "night") {
          flag = true;
        }
      }
      return flag;
    });
    return current.length;
  };

  const callAvailableDates = (date) => {
    let par = {
      slot_id: Globals.selectedSlotId,
      department_id: Globals.selectedDepartment.department_id,
    };
    availableDates(par)
      .then((res) => {
        if (res.status == 200) {
          //_slots = res.slots;
          _total_page = res.totalPageNumber;
          _page_max = parseInt(res.current_page, 10);
          _page_min = parseInt(res.current_page, 10);
          setSlots(res.slots);
          setDayNightSlot(res.slots, isSecond, isThird);
          if (Globals.selectedSlotId != -1 && Globals.isBookChange) {
            setPeep(res.peep);
            let offset = 0;
            for (let i = 0; i < res.slots.length; i++) {
              if (res.slots[i].slot_id == Globals.selectedSlotId) {
                break;
              }
              offset = offset + 1;
            }
            setSlotId(_slotId);
            setTimeout(function () {
              scroll.current.scrollTo({ x: _step * (offset - 1) });
              _isCalendarCall = 1;
              setTimeout(function () {
                _isCalendarCall = 0;
              }, 1000);
            }, 300);
          }

          if (res.dates.length > 0) {
            let md = {};
            for (let i = 0; i < res.dates.length; i++) {
              if (i == 0) {
                _min_date = res.dates[i].dt;
              }
              if (i == res.dates.length - 1) {
                _max_date = res.dates[i].dt;
              }
              var dt = res.dates[i].dt;
              md[dt] = {
                selected: true,
                selectedColor: BaseColor.primaryBlueColor,
              };
            }
            setMarkedDates(md);
          } else {
            setIsNoSlot(true);
          }
        } else if (res.status === 300 || res.status === 400) {
          Toast.show(res.msg, Toast.SHORT, ["UIAlertController"]);
        } else {
          Toast.show(res.msg, Toast.SHORT, ["UIAlertController"]);
        }
        //
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const callAvailableSlots = (date, prev_next) => {
    DefaultPreference.getMultiple(["cprofile_id"])
      .then(function (values) {
        if (values[0] != null) {
          var p = _page_min;
          if (prev_next == "next") {
            p = _page_max;
          }
          let par = {
            dt: date,
            slot_id: Globals.selectedSlotId,
            department_id: Globals.selectedDepartment.department_id,
            cprofile_id: values[0],
            page: p,
          };
          // console.log(" book get available slots ");
          // console.log(par);
          availableSlots(par)
            .then((res) => {
              if (res.status == 200) {
                if (res.slots.length > 0) {
                  //_slots = res.slots;
                  if (prev_next == "next") {
                    setSlots([...slots, ...res.slots]);
                    setDayNightSlot(
                      [...slots, ...res.slots],
                      isSecond,
                      isThird
                    );
                  } else if (prev_next == "prev") {
                    setSlots([...res.slots, ...slots]);
                    setDayNightSlot(
                      [...res.slots, ...slots],
                      isSecond,
                      isThird
                    );
                  }
                  if (date != "") {
                    setSlots(res.slots);
                    setDayNightSlot(res.slots, isSecond, isThird);
                    _page_max = parseInt(res.current_page);
                    _page_min = parseInt(res.current_page);
                  }
                  setTimeout(function () {
                    if (prev_next == "prev") {
                      scroll.current.scrollTo({
                        x:
                          (getLengthOfSlots(res.slots, isSecond, isThird) - 1) *
                          _step,
                      });
                      // console.log(content_width);
                    } else if (prev_next == "next") {
                      scroll.current.scrollTo({ x: scroll_max + _step });
                      // console.log("called next");
                    } else {
                      for (var i = 0; i < res.slots.length; i++) {
                        if (res.slots[i].defaultSlotDate == current_date) {
                          scroll.current.scrollTo({ x: i * _step });
                          _isCalendarCall = 1;
                          // console.log("called calendar " + i);
                          setScrollWidth(i * _step);
                          setTimeout(function () {
                            _isCalendarCall = 0;
                          }, 1000);
                          break;
                        }
                      }
                    }
                  }, 500);
                } else {
                  setScrollWidth(scroll_max);
                  setCallEnd(true);
                }
              } else if (res.status === 300 || res.status === 400) {
                Toast.show(res.msg, Toast.SHORT, ["UIAlertController"]);
              } else {
                Toast.show(res.msg, Toast.SHORT, ["UIAlertController"]);
              }
              setCallEnd(true);
            })
            .catch((err) => {
              console.log(err);
              setCallEnd(true);
            });
        }
      })
      .catch((_err) => {
        setCallEnd(true);
      });
  };

  const openBook = (url, type) => {
    DefaultPreference.getMultiple(["cprofile_id"])
      .then(function (values) {
        if (values[0] != null) {
          if ((_slotId != 0) & (peep != 0)) {
            let par = {
              cprofile_id: values[0],
              slot_id: _slotId,
              peep: peep,
              type: "new",
            };
            if (type == "cancel") {
              par = {
                cprofile_id: values[0],
                slot_id: _slotId,
                peep: peep,
                type: "cancel",
                old_slot_id: oldSlotId,
              };
            }
            CallApi(par, url)
              .then((res) => {
                // console.log(res);
                if (res.status == 200) {
                  Globals.isBookChange = false;
                  Globals.selectedSlotId = _slotId;
                  props.openDepartmentDetails(Constants.BOOK_TICKET);
                } else if (res.status === 300 || res.status === 400) {
                  Toast.show(res.msg, Toast.SHORT, ["UIAlertController"]);
                } else {
                  Toast.show(res.msg, Toast.SHORT, ["UIAlertController"]);
                }
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            Toast.show("Please, select slot", Toast.SHORT, [
              "UIAlertController",
            ]);
          }
        }
      })
      .catch((_err) => {});
  };

  return (
    <View style={Styles.mainView}>
      <ScrollView>
        <View style={Styles.mainContaine}>
          {
            <Text style={(styles.title, Styles.textCenter)}>
              Next Available Slots
            </Text>
          }
          <View style={Styles.bookSlote}>
            {!isNoSlot && (
              <TouchableOpacity
                onPress={() => {
                  if (slotId == 0 && isCallEnd) {
                    scroll.current.scrollTo({ x: scroll_max - _step });
                    if (
                      scroll_max == 0 &&
                      _page_min > 1 &&
                      _page_min <= _page_max
                    ) {
                      if (isCallEnd) {
                        _page_min = _page_min - 1;
                        callSlotsByPage("prev");
                      }
                    }
                  }
                }}
              >
                {/** Arrows to navigate circles **/}
                <View style={Styles.leftArrowView}>
                  {_page_min == 1 && scrollWidth < 70 && (
                    <Image
                      style={Styles.iconSize}
                      source={ICON_LEFT_ARROW_GRAY}
                      resizeMode="stretch"
                    />
                  )}
                  {(_page_min != 1 || scrollWidth >= 70) && (
                    <Image
                      style={Styles.iconSize}
                      source={ICON_LEFT_ARROW}
                      resizeMode="stretch"
                    />
                  )}
                </View>
              </TouchableOpacity>
            )}

            <ScrollView
              bounces={scrollable}
              scrollEnabled={scrollable}
              onContentSizeChange={(width, height) => {
                content_width = width;
              }}
              onScroll={(event) => {
                scroll_max = parseInt(event.nativeEvent.contentOffset.x);
                if (_isCalendarCall == 0) {
                  if (content_width - scroll_max < _limit) {
                    if (isCallEnd) {
                      //callSlotsByDate("next");
                      if (_page_max < _total_page) {
                        _page_max = _page_max + 1;
                        callSlotsByPage("next");
                      } else {
                        setScrollWidth(content_width - 260);
                      }
                    }
                  } else {
                    if (scroll_max == 0) {
                      if (isCallEnd) {
                        //callSlotsByDate("prev");
                        if (_page_min > 1) {
                          _page_min = _page_min - 1;
                          callSlotsByPage("prev");
                        } else {
                          setScrollWidth(0);
                        }
                      }
                    }
                  }
                }
                setScrollWidth(scroll_max);
              }}
              ref={scroll}
              style={Styles.scrollHeight}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              {
                /* Clickable Circles */
                currentSlots.map((item, i) => {
                  if (_slotId != item.slot_id) {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          Globals.selectedSlot = item;
                          setSlotId(item.slot_id);
                          _slotId = item.slot_id;
                          setScrollable(false);
                          scroll.current.scrollTo({ x: (i - 1) * _step + 10 });
                        }}
                        key={i}
                      >
                        <View
                          style={[
                            styles.time_circle,
                            { marginRight: slots.length > 1 ? -15 : 0 },
                          ]}
                        >
                          <Text style={styles.time_circle_title}>
                            {item.slotDate.substring(0, 3)}
                          </Text>
                          <Text style={styles.time_circle_title}>
                            {item.slotDate.substring(
                              item.slotDate.indexOf(" ") + 1
                            )}
                          </Text>
                          <Text style={styles.time_circle_title}>
                            {item.start_time}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  } else {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          if (_slotId == 0) {
                            _slotId = item.slot_id;
                            setSlotId(item.slot_id);
                            setScrollable(false);
                          } else {
                            _slotId = 0;
                            setSlotId(0);
                            setScrollable(true);
                          }
                        }}
                        key={i}
                      >
                        <View
                          style={[
                            styles.time_circle_clicked,
                            { marginRight: slots.length > 1 ? -10 : 0 },
                          ]}
                        >
                          <Text style={styles.time_circle_title_clicked}>
                            {item.slotDate.substring(0, 3)}
                          </Text>
                          <Text style={styles.time_circle_title_clicked}>
                            {item.slotDate.substring(
                              item.slotDate.indexOf(" ") + 1
                            )}
                          </Text>
                          <Text style={styles.time_circle_title_clicked}>
                            {item.start_time}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  }
                })
              }
            </ScrollView>
            {
              /* Arrows to paginate the available slots bubbles */
              !isNoSlot && (
                <TouchableOpacity
                  onPress={() => {
                    if (slotId == 0 && isCallEnd) {
                      scroll.current.scrollTo({ x: scroll_max + _step });
                      if (
                        content_width - scroll_max < _limit &&
                        _page_max < _total_page &&
                        _page_max >= _page_min
                      ) {
                        if (isCallEnd) {
                          _page_max = _page_max + 1;
                          callSlotsByPage("next");
                        }
                      }
                    }
                  }}
                >
                  <View style={Styles.leftArrowView}>
                    {_page_max == _total_page &&
                      content_width - scrollWidth < _limit && (
                        <Image
                          style={Styles.iconSize}
                          source={ICON_RIGHT_ARROW_GRAY}
                          resizeMode="stretch"
                        />
                      )}
                    {(_page_max != _total_page ||
                      content_width - scrollWidth > _limit) && (
                      <Image
                        style={Styles.iconSize}
                        source={ICON_RIGHT_ARROW}
                        resizeMode="stretch"
                      />
                    )}
                  </View>
                </TouchableOpacity>
              )
            }
            {isNoSlot && (
              <View style={Styles.noSloteAvailableView}>
                <Text style={Styles.fontSize18fontSize18}>
                  No slots available
                </Text>
              </View>
            )}
            {!isCallEnd && (
              <View style={Styles.bookisCallEndView}>
                <View style={Styles.bookisCalledContaine} />
                <View style={Styles.booisCalled}>
                  <ActivityIndicator
                    size="small"
                    color={BaseColor.whiteColor}
                  />
                </View>
              </View>
            )}
          </View>
          {
            /* Filter Day and Night */
            !isNoSlot && (
              <View style={Styles.noSloteMain}>
                <CheckBox
                  checkboxStyle={Styles.checkBoxStyle}
                  label=""
                  checked={isSecond}
                  onChange={(checked) => {
                    setSecond(!checked);
                    scroll.current.scrollTo({ x: 0 });
                    setDayNightSlot(slots, !checked, isThird);
                  }}
                />
                <Image
                  style={[styles.icon, Styles.afterNoonIcon]}
                  source={ICON_AFTERNOON}
                  resizeMode="stretch"
                />
                <CheckBox
                  checkboxStyle={Styles.checkBoxStyle}
                  label=""
                  checked={isThird}
                  onChange={(checked) => {
                    setThird(!checked);
                    scroll.current.scrollTo({ x: 0 });
                    setDayNightSlot(slots, isSecond, !checked);
                  }}
                />
                <Image
                  style={[styles.icon, Styles.nightIcon]}
                  source={ICON_NIGHT}
                  resizeMode="stretch"
                />
                <View style={Styles.calendarView}>
                  <TouchableOpacity onPress={() => setCalendar(true)}>
                    <Image
                      style={(styles.icon, Styles.calenderIcon)}
                      source={ICON_CALENDER}
                      resizeMode="stretch"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )
          }

          {
            /* Quantity counter - Increment decrement the number of people  */
            !isNoSlot && (
              <View style={Styles.quantityView}>
                <QuantityCounter
                  count={peep}
                  min={Constants.MIN_NUMBER_OF_PEOPLE}
                  max={Globals.selectedDepartment.max_peep}
                  onCountChange={(newCount) => {
                    setPeep(newCount);
                  }}
                />
                <View style={Styles.bookMeButton}>
                  <TouchableOpacity
                    /* Button book me */
                    onPress={() => {
                      if (_slotId != 0 && peep != 0) {
                        if (Globals.isBookChange) {
                          if (oldSlotId != 0) {
                            openBook("book", "cancel");
                          }
                        } else {
                          openBook("book", "");
                        }
                        console.log("book old slot id = ", oldSlotId);
                      }
                    }}
                  >
                    <View
                      style={[
                        common_styles.secondaryBtn,
                        {
                          backgroundColor:
                            _slotId != 0 && peep != 0
                              ? BaseColor.primaryBlueColor
                              : BaseColor.grayColor,
                        },
                      ]}
                    >
                      <Text style={common_styles.btnText}>
                        {Globals.isBookChange ? "Change Booking " : "Book me "}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )
          }
          {/* calendar modal */}
          <Modal
            style={Styles.mainCalenderModal}
            backdropColor={BaseColor.blackColor}
            isVisible={isCalendar}
          >
            <View style={Styles.calendarViewContaint}>
              <View style={Styles.calenderModalWidth}>
                <Calendar
                  style={Styles.calender}
                  // Specify theme properties to override specific styles for calendar parts. Default = {}
                  theme={{
                    arrowColor: BaseColor.primaryBlueColor,
                    "stylesheet.calendar.header": {
                      week: Styles.calenderWeak,
                    },
                  }}
                  onDayPress={(day) => {
                    var date2 = new Date();
                    var sel = new Date(day.dateString);
                    current_date = day.dateString;
                    if (markedDates[current_date] && isCallEnd) {
                      setCalendar(false);
                      setCallEnd(false);
                      callAvailableSlots(day.dateString, "");
                    } else {
                      console.log("marked dates - out");
                    }
                  }}
                  markedDates={markedDates}
                />
                <TouchableOpacity
                  style={Styles.setCalender}
                  onPress={() => {
                    setCalendar(false);
                  }}
                >
                  <Image
                    style={Styles.closeIcon}
                    source={CloseIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          {/* TODO When Client is on Booking Ticket and clicks on "change booking", he land on change booking page.
              The problem here is that the Client is stuck on this page. If he wants to cancel the action of changing the booking he can't.
              Therefore, from Change booking page, by clicking on the "back" button, Client should be redirected back to the booking ticket page.
          */}
        </View>
      </ScrollView>
    </View>
  );
}
