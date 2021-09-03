import React, { useState, useEffect, useRef } from "react";
import {
  KeyboardAvoidingView,
  View,
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  AppState,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { AppRegistry, StatusBar } from "react-native";
import common_styles from "../../common/style";
import styles from "../../screens/tab/availability/style";
import mystyle from "./style";
import { ScrollView } from "react-native-gesture-handler";
import { BaseColor } from "../../common/color";
import Toast from "react-native-simple-toast";
//import { Rating, AirbnbRating } from 'react-native-elements';
import AirbnbRating from "../../component/TapRating";
import Topbar2 from "../../component/topbar2";
import { CallApi } from "../../service/business";
import DefaultPreference from "react-native-default-preference";
import { Globals } from "../../config/globals";
import { BoxShadow } from "react-native-shadow";
import { setFavourite } from "../../service/favourite";
import { ImageSlider } from "../common/ImageSlider";

export default function FeedbackScreen(props) {
  const [isReviewTab, setReviewTab] = useState(true);
  const [rating, setRating] = useState(1);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [report, setReport] = useState("");
  const [report_title, setReportTitle] = useState("");
  const [iInfo, setIndicator] = useState({
    isActive: false,
    msg: "Signing User...",
  });
  const [errInfo, setError] = useState({ isActive: false, msg: "" });
  const [isFavourite, setIsFavourite] = useState(false);
  const reviewBox = useRef();
  const reportBox = useRef();
  const [brate_id, setBrateId] = useState("");
  const [brep_id, setBrepId] = useState("");
  const [isReview, setIsReview] = useState(false);
  const [isReport, setIsReport] = useState(false);
  const [reviewDT, setReviewDT] = useState("");
  const [reportDT, setReportDT] = useState("");
  const [photos, setPhotos] = useState([]);
  const imageSliderRef = useRef();

  useEffect(() => {
    setIsFavourite(
      Globals.selectedBusiness.business.isFavorite == 1 ? true : false
    );
    callGetFeedback();
    callPhotos();
  }, []);

  goBack = () => {
    props.navigation.goBack();
  };

  getPhotos = () => {
    return photos;
  };

  callGetFeedback = () => {
    DefaultPreference.getMultiple(["cprofile_id"])
      .then(function (values) {
        if (values[0] != null) {
          let abased_id = null;
          let qbased_id = null;
          if (
            Globals.selectedBusiness.business.QTYPE_ID != 4 &&
            Globals.selectedBusiness.business.QTYPE_ID != 5
          ) {
            qbased_id = Globals.selectedBusiness.business.slot_id;
          } else {
            abased_id = Globals.selectedBusiness.business.slot_id;
          }
          let params = {
            cprofile_id: values[0],
            bprofile_id: Globals.selectedBusiness.business.bprofile_id,
            abased_id: abased_id,
            qbased_id: qbased_id,
          };
          const body = JSON.stringify(params);
          // console.log(body);
          CallApi(params, "getfeedback")
            .then((res) => {
              // console.log(res);
              if (res.status == 200) {
                if (res.feedback.feedback != null) {
                  setTitle(res.feedback.title);
                  setContent(res.feedback.feedback);
                  setRating(res.feedback.star);
                  setBrateId(res.feedback.brate_id);
                  setIsReview(true);
                  setReviewDT(res.feedback);
                }
                if (res.report.report != null) {
                  setReportTitle(res.report.title);
                  setReport(res.report.report);
                  setBrepId(res.report.brep_id);
                  setIsReport(true);
                  setReportDT(res.report);
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
      .catch((err) => {});
  };

  async function callPhotos() {
    let par = {
      bprofile_id: Globals.selectedBusiness.business.bprofile_id,
    };
    // console.log(par);
    CallApi(par, "getphotos")
      .then((res) => {
        // console.log(res);
        if (res.status == 200) {
          setPhotos(res.photos);
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

  submitReview = () => {
    DefaultPreference.getMultiple(["cprofile_id"])
      .then(function (values) {
        if (values[0] != null) {
          var url = "feedback";
          var data = content;
          if (!isReviewTab) {
            url = "report";
            data = report;
          }
          if (url == "feedback" && brate_id != "") {
            url = "updatefeedback";
          }
          if (url == "report" && brep_id != "") {
            url = "updatereport";
          }
          let abased_id = null;
          let qbased_id = null;
          if (
            Globals.selectedBusiness.business.QTYPE_ID != 4 &&
            Globals.selectedBusiness.business.QTYPE_ID != 5
          ) {
            qbased_id = Globals.selectedBusiness.business.slot_id;
          } else {
            abased_id = Globals.selectedBusiness.business.slot_id;
          }
          let params = {
            cprofile_id: values[0],
            bprofile_id: Globals.selectedBusiness.business.bprofile_id,
            star: rating,
            abased_id: abased_id,
            qbased_id: qbased_id,
            title: title,
            content: data,
            brate_id: brate_id,
            brep_id: brep_id,
          };
          const body = JSON.stringify(params);
          // console.log(body);
          CallApi(params, url)
            .then((res) => {
              // console.log(res);
              if (res.status == 200) {
                if (url == "feedback") {
                  setIsReview(true);
                  setReviewDT(res.feedback);
                } else {
                  setIsReport(true);
                  setReportDT(res.report);
                }
                Toast.show("Success", Toast.SHORT, ["UIAlertController"]);
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
      .catch((err) => {});
  };

  favouriteDepartment = () => {
    DefaultPreference.getMultiple(["cprofile_id"])
      .then(function (values) {
        if (values[0] != null) {
          let par = {
            cprofile_id: values[0],
            bprofile_id: Globals.selectedBusiness.business.bprofile_id,
          };
          setFavourite(par)
            .then((res) => {
              // console.log(res);
              Toast.show("Success", Toast.SHORT, ["UIAlertController"]);
              if (res.status == 200) {
                setIsFavourite(true);
              } else if (res.status === 300 || res.status === 400) {
                setIsFavourite(false);
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
      .catch((err) => {});
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: BaseColor.mainBackground }}
    >
      {iInfo.isActive && (
        <View style={styles.loading}>
          <View style={styles.loaderView}>
            <ActivityIndicator color="#fff" style={styles.activityIndicator} />
            <Text style={styles.loadingText}>{iInfo.msg}</Text>
          </View>
        </View>
      )}
      <StatusBar hidden={true} />
      <Topbar2 {...this} />
      <View style={{ height: 168 }}>
        <TouchableOpacity
          onPress={() => {
            imageSliderRef.current.open();
          }}
        >
          {
            <Image
              style={{ height: 168 }}
              source={{ uri: Globals.selectedBusiness.business.photo }}
              resizeMode="stretch"
            />
          }
        </TouchableOpacity>
        <View style={styles.bannerBottom} />
        <View style={styles.bannerBottomTitle}>
          <View style={styles.bannerTitleContainerLeft}>
            <Text numberOfLines={1} style={styles.bannerTitle}>
              {Globals.selectedBusiness.business.name}{" "}
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
            <View style={{ flex: 1, flexDirection: "row" }}>
              <Image
                style={{ width: 17, height: 17 }}
                source={require("../../assets/star_white.png")}
                resizeMode="stretch"
              />
              <Text style={styles.bannerDescription}>
                {" "}
                {Globals.selectedBusiness.business.star}{" "}
              </Text>
            </View>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <Image
                style={{ width: 17, height: 17 }}
                source={require("../../assets/icon_2_e.png")}
                resizeMode="stretch"
              />
              <Text style={styles.bannerDescription}>
                {Globals.selectedBusiness.business.Distance.toFixed(2)} km
              </Text>
            </View>
          </View>
        </View>
      </View>
      <ImageSlider props={this} ref={imageSliderRef}>
      </ImageSlider>
      <ScrollView
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
      >
        <BoxShadow
          setting={{
            width: Dimensions.get("window").width / 2 + 20,
            height: 73,
            color: "#000",
            border: 5,
            radius: 30,
            opacity: 0.1,
            x: 0,
            y: 3,
            style: { marginVertical: 5, marginTop: 10 },
          }}
        >
          <View style={mystyle.card_title}>
            <Text multiline={1}>Last time you were here</Text>
            <Text style={{ color: BaseColor.grayColor }} multiline={1}>
              {Globals.selectedBusiness.business.weekofday.slice(0, 3)}{" "}
              {Globals.selectedBusiness.business.day}{" "}
              {Globals.selectedBusiness.business.month.slice(0, 3)} @
              {Globals.selectedBusiness.business.checkin_time == null
                ? Globals.selectedBusiness.business.start_time
                : Globals.selectedBusiness.business.checkin_time}
            </Text>
            <Text style={{ color: BaseColor.grayColor }} multiline={1}>
              Party of {Globals.selectedBusiness.business.peep}
            </Text>
          </View>
        </BoxShadow>

        <View style={{ flexDirection: "row", flex: 1 }}>
          <View style={{ flex: 3, alignItems: "flex-start", marginLeft: 28 }}>
            <Text
              style={[
                common_styles.itemTitle,
                {
                  color: BaseColor.primaryBlueColor,
                  marginTop: 20,
                  marginLeft: 2,
                },
              ]}
            >
              Rate Your experience{" "}
            </Text>
            <AirbnbRating
              count={5}
              defaultRating={rating}
              size={32}
              showRating={false}
              isDisabled={false}
              onFinishRating={(value) => {
                setRating(value);
              }}
            />
          </View>
          <View style={{ width: 100, alignItems: "center", marginRight: 15 }}>
            <Text
              style={[
                common_styles.itemTitle,
                { color: BaseColor.primaryBlueColor, marginTop: 20 },
              ]}
            >
              {" "}
              Favourite{" "}
            </Text>

            <TouchableOpacity
              onPress={() => {
                favouriteDepartment();
              }}
            >
              <View style={[styles.itemBox, { marginTop: 10 }]}>
                {isFavourite && (
                  <Image
                    style={styles.itemIcon}
                    source={require("../../assets/icon_favourite_fill.png")}
                    resizeMode="stretch"
                  />
                )}

                {!isFavourite && (
                  <Image
                    style={styles.itemIcon}
                    source={require("../../assets/icon_favorite.png")}
                    resizeMode="stretch"
                  />
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            marginLeft: 30,
            marginRight: 30,
            marginBottom: 30,
            marginTop: 10,
          }}
        >
          <View
            style={{
              justifyContent: "flex-start",
              flexDirection: "row",
              zIndex: 1,
            }}
          >
            <View style={{ flexDirection: "row", backgroundColor: "white" }}>
              <TouchableOpacity
                onPress={() => {
                  setReviewTab(true);
                }}
              >
                <Text
                  style={[
                    common_styles.primaryText,
                    {
                      color: BaseColor.primaryBlueColor,
                      padding: 5,
                      borderBottomWidth: isReviewTab ? -1 : 1,
                      borderBottomColor: isReviewTab
                        ? BaseColor.whiteColor
                        : BaseColor.primaryBlueColor,
                      borderLeftColor: isReviewTab
                        ? BaseColor.primaryBlueColor
                        : BaseColor.lightGrey,
                      borderTopColor: isReviewTab
                        ? BaseColor.primaryBlueColor
                        : BaseColor.lightGrey,
                      borderRightColor: isReviewTab
                        ? BaseColor.primaryBlueColor
                        : BaseColor.lightGrey,
                      borderLeftWidth: 1,
                      borderTopWidth: 1,
                      borderRightWidth: 1,
                    },
                  ]}
                >
                  Write a review
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setReviewTab(false);
                }}
              >
                <Text
                  style={[
                    common_styles.primaryText,
                    {
                      color: BaseColor.primaryBlueColor,
                      padding: 5,
                      borderBottomWidth: !isReviewTab ? 0 : 1,
                      borderBottomColor: !isReviewTab
                        ? BaseColor.whiteColor
                        : BaseColor.primaryBlueColor,
                      borderLeftColor: isReviewTab
                        ? BaseColor.primaryBlueColor
                        : BaseColor.primaryBlueColor,
                      borderTopColor: !isReviewTab
                        ? BaseColor.primaryBlueColor
                        : BaseColor.lightGrey,
                      borderRightColor: !isReviewTab
                        ? BaseColor.primaryBlueColor
                        : BaseColor.lightGrey,
                      borderLeftWidth: 1,
                      borderTopWidth: 1,
                      borderRightWidth: 1,
                      marginLeft: -2,
                    },
                  ]}
                >
                  Report
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {isReviewTab && (
            <View
              style={{
                borderColor: BaseColor.primaryBlueColor,
                borderWidth: 1,
                marginTop: -1,
              }}
            >
              <View
                style={{
                  borderWidth: 1,
                  borderColor: BaseColor.lightGrey,
                  marginTop: 7,
                  marginLeft: 7,
                  marginRight: 7,
                  marginBottom: 5,
                }}
              >
                <TextInput
                  placeholder="Title of your Review"
                  value={title}
                  numberOfLines={1}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => {
                    reviewBox.current.focus();
                  }}
                  onChangeText={(text) => setTitle(text)}
                />
              </View>

              <View
                style={{
                  borderWidth: 1,
                  borderColor: BaseColor.lightGrey,
                  marginTop: 5,
                  marginLeft: 7,
                  marginRight: 7,
                  marginBottom: 7,
                }}
              >
                <TextInput
                  placeholder="Your Review"
                  value={content}
                  ref={reviewBox}
                  multiline={true}
                  numberOfLines={6}
                  textAlignVertical={"top"}
                  onChangeText={(text) => setContent(text)}
                />
              </View>
            </View>
          )}

          {!isReviewTab && (
            <View
              style={{
                borderColor: BaseColor.primaryBlueColor,
                borderWidth: 1,
                marginTop: -1,
              }}
            >
              <View
                style={{
                  borderWidth: 1,
                  borderColor: BaseColor.lightGrey,
                  marginTop: 7,
                  marginLeft: 7,
                  marginRight: 7,
                  marginBottom: 5,
                }}
              >
                <TextInput
                  placeholder="Title of your Report"
                  value={report_title}
                  numberOfLines={1}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => {
                    reportBox.current.focus();
                  }}
                  onChangeText={(text) => setReportTitle(text)}
                />
              </View>

              <View
                style={{
                  borderWidth: 1,
                  borderColor: BaseColor.lightGrey,
                  marginTop: 5,
                  marginLeft: 7,
                  marginRight: 7,
                  marginBottom: 7,
                }}
              >
                <TextInput
                  placeholder="Your Report"
                  value={report}
                  ref={reportBox}
                  multiline={true}
                  textAlignVertical={"top"}
                  numberOfLines={6}
                  onChangeText={(text) => setReport(text)}
                />
              </View>
            </View>
          )}

          <View
            style={{
              flex: 1,
              marginRight: 30,
              marginTop: 20,
              marginBottom: 20,
              alignItems: "flex-end",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                if ((isReviewTab && !isReview) || (!isReviewTab && !isReport)) {
                  submitReview();
                }
              }}
            >
              {isReviewTab && (
                <View
                  style={[
                    common_styles.secondaryBtn,
                    {
                      backgroundColor: isReview
                        ? BaseColor.grayColor
                        : BaseColor.primaryBlueColor,
                    },
                  ]}
                >
                  <Text style={common_styles.btnText}>
                    {" "}
                    {isReview ? "Review Submitted" : "Submit Review"}{" "}
                  </Text>
                </View>
              )}

              {!isReviewTab && (
                <View
                  style={[
                    common_styles.secondaryBtn,
                    {
                      backgroundColor: isReport
                        ? BaseColor.grayColor
                        : BaseColor.primaryBlueColor,
                    },
                  ]}
                >
                  <Text style={common_styles.btnText}>
                    {" "}
                    {isReport ? "Report Submitted" : "Submit Report"}{" "}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {isReviewTab && isReviewTab && reviewDT.weekofday != null && (
            <View
              style={{
                flex: 1,
                marginRight: 30,
                marginTop: 10,
                marginBottom: 20,
                alignItems: "flex-end",
              }}
            >
              <Text style={common_styles.secondaryText}>
                Date: {reviewDT.weekofday.slice(0, 3)} {reviewDT.day}{" "}
                {reviewDT.month.slice(0, 3)} {reviewDT.time}{" "}
              </Text>
            </View>
          )}

          {!isReviewTab && isReport && reportDT.weekofday != null && (
            <View
              style={{
                flex: 1,
                marginRight: 30,
                marginTop: 10,
                marginBottom: 20,
                alignItems: "flex-end",
              }}
            >
              <Text style={common_styles.secondaryText}>
                Date: {reportDT.weekofday.slice(0, 3)} {reportDT.day}{" "}
                {reportDT.month.slice(0, 3)} {reportDT.time}{" "}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
