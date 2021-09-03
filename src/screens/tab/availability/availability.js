import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Linking,
} from "react-native";
import { AppRegistry, StatusBar } from "react-native";
import common_styles from "../../../common/style";
import styles from "./style";
import DepartmentTypeView from "../departmenttype/departmenttype";
import CheckInView from "../checkin/checkin";											 
import QueueView from "../queue/queue";
import BookView from "../book/book";
import Topbar from "../../../component/topbar";
import { Constants } from "../../../config/constants";
import { BaseColor } from "../../../common/color";
import Modal from "react-native-modal";
import { setFavourite } from "../../../service/favourite";
import { CallApi, openTime } from "../../../service/business";
import Toast from "react-native-simple-toast";
import DefaultPreference from "react-native-default-preference";
import { Globals } from "../../../config/globals";
import { WeekofdayView } from "../../common/weekofday";
import { getDepartments } from "../../../service/departments";
import { ImageSlider } from "../../common/ImageSlider";
import { color } from "react-native-reanimated";												
import MenuScreen from "screens/menu/menu";
import Styles from "../../../styles/pages/availability";
import {
  STAR1,
  STAR2,
  STAR3,
  STAR4,
  STAR5,
  LOCATION,
  ICON_TOP_ARROW,
  ICON_DOWN_ARROW,
  ICON_PHONE,
  ICON_DIRECTION,
  ICON_FAVORITE_FILL,
  ICON_FAVORITE,
  ICON_WEBSITE,
  ICON_OPEN_TIME,
  ICON_DIALOG_CLOSE,
} from "../../../assets/index";

var _isLoad = false;
var _shifts = [];
var _weekofday = "";
//export default function AvailabilityView(props) 												   
export const AvailabilityView = forwardRef((props, ref) => {
  // type = 1 : check in , type = 2  queue , type =3 book
  const [type, setType] = useState(Constants.DEPARTMENT);
  const [isExpand, setExpand] = useState(true);
  const [isOpeningTime, setOpeningTime] = useState(false);
  const [shifts, setShifts] = useState([]);
  const [weekofday, setWeekOfDay] = useState("");
  const [weeks, setWeeks] = useState([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ]);
  const [shift, setShift] = useState("");
  const [business, setBusiness] = useState(null);							 
  const [departments, setDepartments] = useState({});
  const [isFavourite, setIsFavourite] = useState(2);
  const [photos, setPhotos] = useState([]);
  const [isQueueBack, setIsQueueBack] = useState(0);
  const quickTiketRef = useRef();
  const imageSliderRef = useRef();

  useEffect(() => {
     // console.log(" >> >> >> Globals = ", Globals);
     // console.log(" >>->>->> Globals.selectedDepartment = ", Globals.selectedDepartment);
    var index = Globals.previousPageStack.length;
    _shifts = [];
    if (Globals.previousPageStack[index - 1] == Constants.TAB_ACTIVITY_PAGE) {
      setExpand(false);
      //
      callOpenTime();
      callDepartments();
      callPhotos();
    } else {
      callDepartments();
      callOpenTime();
      callPhotos();
      _isLoad = true;
      if (Globals.isBookChange) {
        // show book page
        setType(Constants.BOOK_ME);
      }
    }
    setIsFavourite(Globals.selectedBusiness.business.isFavorite === 1 ? 1 : 2);
    // console.log("load business", Globals.selectedBusiness.business.photo);
  }, []);
  useImperativeHandle(ref, () => ({
    open: () => {},
    killIntervals() {
      killInterval();
    },
    changeAvailabilityPage(type) {
      openDepartmentDetails(type);
    },
  }));

  killInterval = () => {
    if (quickTiketRef !== undefined && quickTiketRef.current != null) {
      quickTiketRef.current.clearIntervals();
    }
  };

  setQueueBack = (val) => {
    setIsQueueBack(val);
  };
  getQueueBack = () => {
    return isQueueBack;
  };

  goBack = () => {
    var index = Globals.previousPageStack.length;
    if (type === Constants.QUEUE_TICKET) {
      // clear interval functions in queue ticke page.
      if (quickTiketRef !== undefined && quickTiketRef.current != null) {
        quickTiketRef.current.clearIntervals();
      }
    }

    if (Globals.previousPageStack[index - 1] === Constants.TAB_ACTIVITY_PAGE) {
      // from activity page.
      if (Globals.isBookChange) {
        Globals.isBookChange = false;
        setType(Constants.BOOK_TICKET);
      } else {
        Globals.isBackClicked = true;
        props.changeContentPage(Constants.TAB_ACTIVITY_PAGE);
      }
    } else {
      if (
        Globals.selectedBusiness.business.department_count === 1 ||
        Globals.selectedBusiness.business.department_count == null
      ) {
        Globals.isBackClicked = true;
        props.changeContentPage(Constants.TAB_SEARCH_PAGE);
      } else {
        if (type === Constants.DEPARTMENT) {
          Globals.isBackClicked = true;
          Globals.selectedDepartment = {};
          props.changeContentPage(Constants.TAB_SEARCH_PAGE);
        } else if (
          type === Constants.CHECKIN_ME ||
          type === Constants.BOOK_ME ||
          type === Constants.QUEUE_ME
        ) {
          if (Globals.isBookChange) {
            // if opened from ticket , go ticket page again.
            Globals.isBookChange = false;
            setType(Constants.BOOK_TICKET);
          } else {
            // if opened from book me, open department list page.
            Globals.selectedDepartment = {};
            setType(Constants.DEPARTMENT);
          }
        } else if (type === Constants.CHECK_IN_TICKET) {
          setType(Constants.CHECKIN_ME);
        } else if (type === Constants.QUEUE_TICKET) {
          setIsQueueBack(1);
          if (Globals.selectedDepartment.checkin_slot_id != null) {
            setType(Constants.DEPARTMENT);
          } else {
            setType(Constants.QUEUE_ME);
          }
        } else if (type === Constants.BOOK_TICKET) {
          setType(Constants.BOOK_ME);
        }
      }
    }
  };

  openDepartmentDetails = (type) => {
    if (
      type === Constants.BOOK_TICKET ||
      type === Constants.QUEUE_TICKET ||
      type === Constants.CHECK_IN_TICKET
    ) {
      setExpand(false);
    } else {
      setExpand(true);
    }
    setType(type);
  };

  changePageContent = (type) => {
    quickTiketRef.current.clearIntervals();
    props.changeContentPage(type);
  };

  getResource = () => {
    var bus = Globals.selectedBusiness;
    return Globals.selectedBusiness;
  };

  getDprt = () => {
    return departments;
  };
  getPhotos = () => {
    return photos;
  };

  getShiftInfo = () => {
    return shift;
  };

  async function callPhotos() {
    let par = {
      bprofile_id: Globals.selectedBusiness.business.bprofile_id,
    };
    // console.log("=== par (3) = ", par);
    CallApi(par, "getphotos")
      .then((res) => {
        // console.log("=== res = ", res);
        if (res.status === 200) {
          setPhotos(res.photos);
        } 
        /*
        else if (res.status === 300 || res.status === 400) {
        } else {
        }
        */
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const callFavourite = () => {
    DefaultPreference.getMultiple(["cprofile_id"])
      .then(function (values) {
        if (values[0] != null) {
          let par = {
            cprofile_id: values[0],
            bprofile_id: Globals.selectedBusiness.business.bprofile_id,
          };
          // console.log("=== par (1) =", par);
          setFavourite(par)
            .then((res) => {
              // console.log(res);
              Toast.show("Success", Toast.SHORT, ["UIAlertController"]);
              if (res.status === 200) {
                setIsFavourite(1);
              } else if (res.status === 300 || res.status === 400) {
                setIsFavourite(2);
              } 
              /*else {
              }
              */
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((_err) => {});
  };

  async function callOpenTime() {
    let par = {
      bprofile_id: Globals.selectedBusiness.business.bprofile_id,
      device_date_time: new Date(),
    };
    //console.log("====== > ====== callOpentime Globals = ", Globals);
    //console.log("====== > ====== callOpentime Par = ", par);
    openTime(par)
      .then((res) => {
        //console.log(" ======== > > > > Res = ", res);
        if (res.status == 200) {
          _shifts = res.shift;
          _weekofday = res.weekofday;
          setShifts(res.shift);
          if (res.shift.length > 0) {
            setShift(res.shift[0]);
            var tmp = 0;
            Globals.isClosed = 1;
            for (var i = 0; i < res.shift.length; i++) {
              if (res.shift[0].isClosed === 0) {
                Globals.isClosed = 0;
              }
            }
            Globals.differentTime = 0;
            if (res.shift[0].different > 0) {
              Globals.differentTime = res.shift[0].different;
            }
          } else if (res.shift.length === 0) {
            Globals.isClosed = 1;
          }
          setWeekOfDay(res.weekofday);
        } 
        /*
        else if (res.status === 300 || res.status === 400) {
        } else {
        }
        */
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function callDepartments() {
    DefaultPreference.getMultiple(["cprofile_id"])
      .then(function (values) {
        if (values[0] != null) {
          let par = {
            cprofile_id: values[0],
            bprofile_id: Globals.selectedBusiness.business.bprofile_id,
          };
          getDepartments(par)
            .then((res) => {
              if (res.status == 200) {
                setDepartments(res.departments);
                if (res.departments.length > 0) {
                  var index = Globals.previousPageStack.length;
                  // Not coming from activity page.			                    
                  if (
                    Globals.previousPageStack[index - 1] !==
                    Constants.TAB_ACTIVITY_PAGE
                  ) {
                    // When only one Department								  
                    if (
                      Globals.selectedBusiness.business.department_count === 1
                    ) {
                      Globals.selectedDepartment = res.departments[0];
                      // console.log("======= Globals.selectedDepartment.type_id =", Globals.selectedDepartment.type_id);
                      // console.log("======= is Menu Only? = ", (Globals.selectedDepartment.type_id == Constants.DEPARTMENT_TYPE.MENU_ONLY));
                      // console.log("======= type? = ", typeof(Globals.selectedDepartment.type_id));
                      //console.log("======= Globals.selectedDepartment = ", Globals.selectedDepartment);
                      if (
                        Globals.selectedDepartment.type_id === Constants.DEPARTMENT_TYPE.CHECK_IN &&		  
                        Globals.selectedDepartment.checkin_slot_id != null
                      ) {
                        Globals.selectedSlotId =
                          Globals.selectedDepartment.checkin_slot_id;
                        openDepartmentDetails(Constants.CHECK_IN_TICKET);
                      } else if (Globals.selectedDepartment.type_id === Constants.DEPARTMENT_TYPE.MENU_ONLY) {	
                        openMenuPage(Constants.MENU_ONLY);
                      } 
                    }
                  }
                }
              } 
              /*
              else if (res.status === 300 || res.status === 400) {
              } else {
              }
              */
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((_err) => {});
  }

  renderDepartmentType = () => {
    if (type === Constants.DEPARTMENT) {
      return <DepartmentTypeView {...this} />;
    } else if (Globals.selectedDepartment.type_id === Constants.DEPARTMENT_TYPE.MENU_ONLY
      && type === Constants.CHECKIN_ME) {
      return <DepartmentTypeView {...this} />; 
    } else if (type === Constants.CHECKIN_ME) {
      return <CheckInView {...this} />;
    } else if (type === Constants.QUEUE_ME) {
      return <QueueView {...this} />;
    } else if (type === Constants.BOOK_ME) {
      return <BookView {...this} />;
    }
  };

  return (
    <View style={Styles.mainContainer}>
      <Topbar {...this} />
      <View style={Styles.imageSlider}>
        <TouchableOpacity
          onPress={() => {
            imageSliderRef.current.open();
          }}
        >
          <Image
            style={Styles.imageSlider}
            source={{ uri: Globals.selectedBusiness.business.photo }}
            resizeMode="stretch"
          />
        </TouchableOpacity>
        <View style={styles.bannerBottom} />
        <View style={styles.bannerBottomTitle}>
          <View style={styles.bannerTitleContainerLeft}>
            <Text numberOfLines={1} style={styles.bannerTitle}>
              {Globals.selectedBusiness.business.name}
              {Globals.selectedDepartment.name ? " | " : ""}
              {Globals.selectedDepartment.name}
            </Text>
            <Text style={styles.bannerDescription}>
              {Globals.selectedBusiness.business.address}
            </Text>
            <Text style={styles.bannerDescription}>
              {Globals.selectedBusiness.business.postcode}
            </Text>
          </View>
          <View style={styles.bannerTitleContainerRight}>
            <View style={Styles.bannerTitleView}>
              <Text style={[styles.bannerDescription, Styles.bannerTitleText]}>
                {Globals.selectedBusiness.business.star} {" "}
              </Text>
              <Image
                style={Styles.iconSize}
                source={
                  Globals.selectedBusiness.business.star >= 0 &&
                  Globals.selectedBusiness.business.star <= 1
                    ? STAR1
                    : Globals.selectedBusiness.business.star > 1 &&
                      Globals.selectedBusiness.business.star <= 2
                    ? STAR2
                    : Globals.selectedBusiness.business.star > 2 &&
                      Globals.selectedBusiness.business.star <= 3
                    ? STAR3
                    : Globals.selectedBusiness.business.star > 3 &&
                      Globals.selectedBusiness.business.star <= 4
                    ? STAR4
                    : Globals.selectedBusiness.business.star > 4 &&
                      Globals.selectedBusiness.business.star <= 5
                    ? STAR5
                    : STAR1
                }
                resizeMode="stretch"
              />
            </View>
            <View style={Styles.kmPosition}>
              <Text style={styles.bannerDescription}>
                {Globals.selectedBusiness.business.Distance.toFixed(2)}
                {" km "}
              </Text>
              <Image
                style={Styles.iconSize}
                source={LOCATION}
                resizeMode="stretch"
              />
            </View>
          </View>
        </View>
      </View>
      {
        /************* Arrow for details ****************/
        isExpand && (
          <View style={Styles.expandView}>
            <TouchableOpacity
              onPress={() => {
                setExpand(false);
                // console.log("collapse");
              }}
            >
              <Image
                style={Styles.arrowIcon}
                source={ICON_TOP_ARROW}
                resizeMode="stretch"
              />
            </TouchableOpacity>
          </View>
        )
      }
      {!isExpand && (
        <View style={Styles.expandView}>
          <TouchableOpacity
            onPress={() => {
              setExpand(true);
            }}
          >
            <Image
              style={Styles.arrowIcon}
              source={ICON_DOWN_ARROW}
              resizeMode="stretch"
            />
          </TouchableOpacity>
        </View>
      )}
      {
        /******************* Business info and contact details  ********************/
        isExpand && (
          <View>
            <View style={Styles.expandViewStart}>
              <View style={styles.itemContainer}>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      `tel:${Globals.selectedBusiness.business.phone}`
                    )
                  }
                >
                  <View style={styles.itemBox}>
                    <Image
                      style={styles.itemIcon}
                      source={ICON_PHONE}
                      resizeMode="stretch"
                    />
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.itemContainer}>
                <TouchableOpacity
                  onPress={() => {
                    var url =
                      "https://www.google.com/maps/search/?api=1&query=" +
                      Globals.selectedBusiness.business.lat +
                      "," +
                      Globals.selectedBusiness.business.lng;
                    Linking.canOpenURL(url).then((supported) => {
                      if (supported) {
                        Linking.openURL(url);
                      } else {
                        console.log("Don't know how to open URI: " + url);
                      }
                    });
                  }}
                >
                  <View style={styles.itemBox}>
                    <Image
                      style={styles.itemIcon}
                      source={ICON_DIRECTION}
                      resizeMode="stretch"
                    />
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.itemContainer}>
                <TouchableOpacity onPress={() => callFavourite()}>
                  <View style={styles.itemBox}>
                    {isFavourite === 1 && (
                      <Image
                        style={styles.itemIcon}
                        source={ICON_FAVORITE_FILL}
                        resizeMode="stretch"
                      />
                    )}
                    {isFavourite === 2 && (
                      <Image
                        style={styles.itemIcon}
                        source={ICON_FAVORITE}
                        resizeMode="stretch"
                      />
                    )}
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.itemContainer}>
                <TouchableOpacity
                  onPress={() => {
                    Linking.canOpenURL(
                      "http://" + Globals.selectedBusiness.business.website
                    ).then((supported) => {
                      if (supported) {
                        Linking.openURL(
                          "http://" + Globals.selectedBusiness.business.website
                        );
                      } else {
                        console.log(
                          "Don't know how to open URI: " +
                            Globals.selectedBusiness.business.website
                        );
                      }
                    });
                  }}
                >
                  <View style={styles.itemBox}>
                    <Image
                      style={styles.itemIcon}
                      source={ICON_WEBSITE}
                      resizeMode="stretch"
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={common_styles.divider} />
          </View>
        )
      }
      {/************ Header of Availability page ****************/}
      <View style={Styles.availibilityHeader}>
        {/****** Todays opening time *******/}
        <View style={Styles.openingTime}>
          <Image
            style={styles.itemIcon}
            source={ICON_OPEN_TIME}
            resizeMode="stretch"
          />
          {/*** todays opening time ***/}
          {_shifts.map((item, index) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setOpeningTime(true);
                }}
                key={index}
              >
                <Text style={[styles.primaryText, Styles.opanTimeText]}>
                  {index === 0 ? weekofday + " " : ""}
                  {item.from_time == null || item.to_time == null
                    ? index > 0
                      ? " Closed"
                      : ""
                    : item.from_time + "-" + item.to_time}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {
          /*********************  Menu button **********************/
          type !== Constants.DEPARTMENT && (
            <View style={Styles.departmwntListContainer}>
              <TouchableOpacity
                onPress={() => {
                  // console.log("Selected deprtament is(has) menu = ", Globals.selectedDepartment.isMenu);
                  if (Globals.selectedDepartment.isMenu !== 0) {
                    props.openMenuPage();
                  }
                }}
              >
                <View
                  style={[
                    common_styles.secondaryBtn,
                    {
                      backgroundColor:
                        Globals.selectedDepartment.isMenu === 0
                          ? BaseColor.grayColor
                          : BaseColor.primaryBlueColor,
                    },
                  ]}
                >
                  <Text style={common_styles.btnText}>Menu</Text>
                </View>
              </TouchableOpacity>
            </View>
          )
        }
      </View>

      {
        /************ Content of Availability Page **************/
        renderDepartmentType()
      }

      {/************ Weekly Opening Times modal ****************/}
      <Modal
        style={Styles.mainModal}
        backdropColor={BaseColor.whiteColor}
        isVisible={isOpeningTime}
      >
        <View style={Styles.modalViewConatiner}>
          <View style={Styles.modalView}>
            <Text style={[common_styles.dialog_title, Styles.modalDialogText]}>
              Opening Time
            </Text>
            {_shifts.map((item, index) => {
              var i = { from: item.monday_from, to: item.monday_to };
              return (
                <WeekofdayView
                  item={i}
                  weekofday={_weekofday}
                  type={"Monday"}
                  order={index}
                  key={index}
                />
              );
            })}
            {_shifts.map((item, index) => {
              var i = { from: item.tuesday_from, to: item.tuesday_to };
              return (
                <WeekofdayView
                  item={i}
                  weekofday={_weekofday}
                  type="Tuesday"
                  order={index}
                  key={index}
                />
              );
            })}
            {_shifts.map((item, index) => {
              var i = { from: item.wednesday_from, to: item.wednesday_to };
              return (
                <WeekofdayView
                  item={i}
                  weekofday={_weekofday}
                  type="Wednesday"
                  order={index}
                  key={index}
                />
              );
            })}
            {_shifts.map((item, index) => {
              var i = { from: item.thursday_from, to: item.thursday_to };
              return (
                <WeekofdayView
                  item={i}
                  weekofday={_weekofday}
                  type="Thursday"
                  order={index}
                  key={index}
                />
              );
            })}
            {_shifts.map((item, index) => {
              var i = { from: item.friday_from, to: item.friday_to };
              return (
                <WeekofdayView
                  item={i}
                  weekofday={_weekofday}
                  type="Friday"
                  order={index}
                  key={index}
                />
              );
            })}
            {_shifts.map((item, index) => {
              var i = { from: item.saturday_from, to: item.saturday_to };
              return (
                <WeekofdayView
                  item={i}
                  weekofday={_weekofday}
                  type="Saturday"
                  order={index}
                  key={index}
                />
              );
            })}
            {_shifts.map((item, index) => {
              var i = { from: item.sunday_from, to: item.sunday_to };
              return (
                <WeekofdayView
                  item={i}
                  weekofday={_weekofday}
                  type="Sunday"
                  order={index}
                  key={index}
                />
              );
            })}
            <TouchableOpacity
              style={Styles.setOpeningTime}
              onPress={() => {
                setOpeningTime(false);
              }}
            >
              <Image
                style={Styles.iconWidth}
                source={ICON_DIALOG_CLOSE}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <ImageSlider props={this} ref={imageSliderRef} />
    </View>
  );
});
