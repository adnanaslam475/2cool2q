import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Platform,
  Alert,
} from "react-native";

import styles from "../../common/style";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { Constants } from "../../config/constants";
import { BoxShadow } from "react-native-shadow";
import { BaseColor } from "../../common/color";
import { FilterView } from "./common/filter";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import Geolocation from "react-native-geolocation-service";
import { getBusinessListByFilter } from "../../service/business";
import ScrollBottomSheet from "react-native-scroll-bottom-sheet";
import Topbar from "../../component/topbar";
import { MyLocation, Globals } from "../../config/globals";
import DefaultPreference from "react-native-default-preference";
import Toast from "react-native-simple-toast";

var isLocationDetected = false;

var _business = [];
var _origin = [];

var _location = {};
var _page = 1;
var _isExpanded = true;
var _isCalling = false;

export default function SearchView(props) {
  const [height, setHeight] = useState(
    Math.round(Dimensions.get("window").height)
  );
  const [key, setKey] = useState("");
  const [onEndReachedCalled, setEndReachedCalled] = useState(false);
  const [isExpand, setExpand] = useState(false);
  const refRBSheet = useRef();
  const bottomSheetRef = useRef();
  const [business, setBusinesses] = useState([]);
  const [region, setRegion] = useState({
    latitude: MyLocation.lat,
    longitude: MyLocation.lng,
    latitudeDelta: 0.009,
    longitudeDelta: 0.004,
  });

  // filter parameters
  const [active, setActive] = useState(-1);
  const [favourite, setFavourite] = useState(-1);
  const [take_away, setTakeAway] = useState(-1);
  const [pick_up, setPickUp] = useState(-1);
  const [delivery, setDelivery] = useState(-1);
  const [category_id, setCategoryId] = useState(-1);
  const [distance, setDistance] = useState(5000);

  const parentRef = React.useRef({ focusHandler: (params) => filter(params) });

  const windowHeight = Dimensions.get("window").height;
  const snapPoints = [0, "100%", windowHeight - 300]; // top, center, bottom

  useEffect(() => {
    //if( !isLocationDetected ) {
    //checkLocationPermission();
    _location = MyLocation;
    _page = 1;
    retrieveMore();
    isLocationDetected = true;
    bottomSheetRef.current.snapTo(0);
    //}

    if (_isExpanded) {
      bottomSheetRef.current.snapTo(0);
    }

    Globals.selectedSlotId = -1;
  }, []);

  const goBack = () => {
    // slide last record from stack.
    Globals.isBackClicked = true;
    props.changeContentPage(Constants.TAB_SEARCH_PAGE);
  };

  const checkLocationPermission = () => {
    check(
      Platform.OS == "android"
        ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
    ).then((result) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          //this.AlertView.showAlert('negotive', Strings.txtAndroidLocationUnavailableTitle, Strings.txtAndroidLocationUnavailableDescription)
          Alert.alert(
            "Error",
            "Unabled to use geolocation",
            [
              {
                text: "Yes",
                onPress: () => console.log("Yes Pressed"),
                style: "cancel",
              },
            ],
            { cancelable: false }
          );

          break;
        case RESULTS.DENIED:
          requestLocationPermission();
          break;
        case RESULTS.GRANTED:
          getCurrentLocation();
          break;
        case RESULTS.BLOCKED:
          Alert.alert(
            "Error",
            "Blocked to use geolocation",
            [
              {
                text: "Yes",
                onPress: () => console.log("Yes Pressed"),
                style: "cancel",
              },
            ],
            { cancelable: false }
          );
          break;
      }
      isLocationDetected = true;
    });
  };

  const requestLocationPermission = () => {
    request(
      Platform.OS == "android"
        ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
    ).then((result) => {
      if (result == RESULTS.GRANTED) {
        getCurrentLocation();
      }
    });
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        let location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        _location = location;
        //retrieveMore();
      },
      (error) => {
        Alert.alert(error.message);
      },
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 10000 }
    );
  };

  const openList = (business) => {
    props.changeContentPage(Constants.AVAILABILITY);
    Globals.selectedBusiness = business;
    props.changeBusiness(business);
  };

  const retrieveMore = () => {
    filterBusiness(null, "");
  };

  const searchByName = (key) => {
    let params = {
      key: key,
    };
    filterBusiness(params, "search");
  };

  const setFilterParams = (params) => {
    setActive(params.active);
    setFavourite(params.favourite);
    setTakeAway(params.take_away);
    setPickUp(params.pick_up);
    setDelivery(params.delivery);
    setCategoryId(params.category_id);
    setDistance(params.distance);
    _page = 1;
  };

  const filterBusiness = (params, type) => {
    // if(_isCalling == true){
    //     if(_page != 1){
    //         _page = _page - 1;
    //     }
    //     return;
    // }

    _isCalling = true;
    if (type == "search") {
      _page = 1;
    }
    var searchKey = key;
    if (params != null && params.key != null) {
      searchKey = params.key;
    }

    setEndReachedCalled(true);

    DefaultPreference.getMultiple(["cprofile_id"])
      .then(function (values) {
        if (values[0] != null) {
          let par = {
            active: active,
            favourites: favourite,
            take_away: take_away,
            pick_up: pick_up,
            delivery: delivery,
            category_id: category_id,
            distance: distance,
            lat: _location.lat,
            lng: _location.lng,
            key: searchKey,
            page: _page,
            cprofile_id: values[0],
          };

          if (params != null) {
            _page = 1;
            if (params.active != null) {
              par = {
                active: params.active,
                favourites: params.favourite,
                take_away: params.take_away,
                pick_up: params.pick_up,
                delivery: params.delivery,
                category_id: params.category_id,
                distance: params.distance,
                lat: _location.lat,
                lng: _location.lng,
                key: searchKey,
                page: _page,
                cprofile_id: values[0],
              };
            }
          }

          // console.log(par);
          getBusinessListByFilter(par)
            .then((res) => {
              if (res.status == 200) {
                if (_page == 1) {
                  _business = res.businessList;
                } else {
                  _business = [..._business, ...res.businessList];
                }
                // console.log(_business.length);
                setBusinesses(_business);
                if (parseInt(res.notification) > 0) {
                  props.setNotificationVal(parseInt(res.notification));
                }
              } else if (res.status === 300 || res.status === 400) {
                Toast.show(res.msg, Toast.SHORT, ["UIAlertController"]);
              } else {
                Toast.show(res.msg, Toast.SHORT, ["UIAlertController"]);
              }
              //
              setEndReachedCalled(false);
              _isCalling = false;
            })
            .catch((err) => {
              console.log(err);
              _isCalling = false;
            });
        } else {
          console.log("calling is false");
          _isCalling = false;
        }
      })
      .catch((err) => {
        _isCalling = false;
      });
  };

  const onPressZoomIn = () => {
    let re = {
      latitude: region.latitude,
      longitude: region.longitude,
      latitudeDelta: region.latitudeDelta * 10,
      longitudeDelta: region.longitudeDelta * 10,
    };
    setRegion(re);
    //this.map.animateToRegion(region, 100);
  };

  const onPressZoomOut = () => {
    let re = {
      latitude: region.latitude,
      longitude: region.longitude,
      latitudeDelta: region.latitudeDelta / 10,
      longitudeDelta: region.longitudeDelta / 10,
    };
    setRegion(re);
  };

  const renderItem = (item, index) => {
    return (
      <TouchableOpacity onPress={() => openList(item)}>
        <View>
          <BoxShadow
            setting={{
              width: Dimensions.get("window").width - 22,
              height: 120,
              color: "#000",
              border: 3,
              radius: 3,
              opacity: 0.1,
              x: 0,
              y: 4,
              style: { marginVertical: 5 },
            }}
          >
            <View style={styles.card_bg}>
              {
                <Image
                  style={styles.itemImg}
                  source={{ uri: item.business.photo }}
                  resizeMode="stretch"
                />
              }
              <View
                style={{
                  flex: 1,
                  marginLeft: 10,
                  paddingTop: 10,
                  paddingBottom: 10,
                }}
              >
                <View>
                  <Text style={styles.itemTitle}> {item.business.name}</Text>
                  <Text style={[styles.itemDescription, { marginTop: 7 }]}>
                    {" "}
                    {item.business.address}
                  </Text>
                  <Text style={[styles.itemDescription, { marginTop: 0 }]}>
                    {" "}
                    {item.business.postcode}
                  </Text>
                  <View style={{ flexDirection: "row", marginTop: 10 }}>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text style={[styles.itemStarText, { marginRight: 2 }]}>
                        {" "}
                        {item.business.star}{" "}
                      </Text>
                      <Image
                        style={styles.itemIcon}
                        source={require("../../assets/star.png")}
                        resizeMode="stretch"
                      />
                    </View>

                    <Text
                      style={[
                        styles.itemTimeText,
                        { marginLeft: 30, marginRight: 15 },
                      ]}
                    >
                      {" "}
                      {item.business.Distance.toFixed(2)} km{" "}
                    </Text>

                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "flex-end",
                        justifyContent: "flex-end",
                      }}
                    >
                      {/* <Text style={[styles.itemTimeText,{marginRight:15}]}> {item.business.Distance.toFixed(2)} km </Text> */}
                    </View>
                  </View>
                </View>
              </View>

              <View style={{ marginRight: 10 }}>
                <Image
                  source={require("../../assets/icon_start.png")}
                  resizeMode="stretch"
                />
              </View>
            </View>
          </BoxShadow>

          {_business.length * 120 < Dimensions.get("window").height - 120 &&
            index == _business.length - 1 && (
              <View
                style={{
                  height:
                    Dimensions.get("window").height -
                    _business.length * 120 -
                    120,
                  backgroundColor: BaseColor.mainBackground,
                  alignItems: "center",
                }}
              />
            )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Topbar {...this} />

      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height - 83,
          }}
        >
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            region={region}
            onRegionChange={() => {}}
          >
            {_location != null && (
              <Marker
                coordinate={{
                  latitude: _location.lat,
                  longitude: _location.lng,
                }}
                pinColor={BaseColor.redColor}
              />
            )}

            {_business.map((item, index) => {
              return (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: item.business.lat,
                    longitude: item.business.lng,
                  }}
                  title={item.business.name}
                  description={item.business.address}
                  pinColor={BaseColor.primaryBlueColor}
                />
              );
            })}
          </MapView>

          <TouchableOpacity
            style={{
              position: "absolute",
              right: 0,
              marginTop: 50,
              marginRight: 15,
            }}
            onPress={() => {
              onPressZoomIn();
            }}
          >
            <BoxShadow
              setting={{
                width: 35,
                height: 35,
                color: "#000",
                border: 5,
                radius: 3,
                opacity: 0.1,
                x: 0,
                y: 4,
                style: { marginVertical: 5 },
              }}
            >
              <View style={styles.icon_box}>
                <Image
                  style={{ width: 20, height: 20 }}
                  source={require("../../assets/icon_minus.png")}
                  resizeMode="stretch"
                />
              </View>
            </BoxShadow>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              position: "absolute",
              right: 0,
              marginTop: 90,
              marginRight: 15,
            }}
            onPress={() => {
              onPressZoomOut();
            }}
          >
            <BoxShadow
              setting={{
                width: 35,
                height: 35,
                color: "#000",
                border: 5,
                radius: 3,
                opacity: 0.1,
                x: 0,
                y: 4,
                style: { marginVertical: 5 },
              }}
            >
              <View style={styles.icon_box}>
                <Image
                  style={{ width: 20, height: 20 }}
                  source={require("../../assets/icon_plus.png")}
                  resizeMode="stretch"
                />
              </View>
            </BoxShadow>
          </TouchableOpacity>
        </View>

        <ScrollBottomSheet // If you are using TS, that'll infer the renderItem `item` type
          style={{ marginBottom: 0 }}
          ref={bottomSheetRef}
          componentType="FlatList"
          snapPoints={snapPoints}
          initialSnapIndex={2}
          renderHandle={() => (
            <View
              style={{
                backgroundColor: BaseColor.mainBackground,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 10,
                  marginBottom: 5,
                  paddingLeft: 20,
                  paddingRight: 20,
                  alignItems: "center",
                }}
              >
                <BoxShadow
                  setting={{
                    width: Dimensions.get("window").width - 140,
                    height: 37,
                    color: "#000",
                    border: 4,
                    radius: 18,
                    opacity: 0.1,
                    x: 0,
                    y: 1,
                    style: { marginVertical: 5 },
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: BaseColor.whiteColor,
                      height: 37,
                      flexDirection: "row",
                      borderWidth: 1,
                      borderRadius: 20,
                      borderColor: BaseColor.primaryBlueColor,
                      alignItems: "center",
                    }}
                  >
                    <Image
                      style={{ width: 20, height: 20, marginLeft: 10 }}
                      source={require("../../assets/mag.png")}
                      resizeMode="stretch"
                    />

                    <TextInput
                      style={[
                        styles.primaryInput,
                        { marginTop: 0, flex: 1, borderWidth: 0 },
                      ]}
                      placeholder="Search"
                      returnKeyType="done"
                      onSubmitEditing={() => searchByName(key)}
                      value={key}
                      onChangeText={(text) => {
                        if (
                          (text.length >= 3 || text.length == 0) &&
                          !onEndReachedCalled
                        ) {
                          searchByName(text);
                        }
                        setKey(text);
                      }}
                    />

                    {key.length > 0 && (
                      <TouchableOpacity
                        onPress={() => {
                          var searchKey = key;
                          setKey("");
                          searchByName("");
                        }}
                      >
                        <Image
                          style={{ width: 20, height: 20, marginRight: 10 }}
                          source={require("../../assets/icon_cross.png")}
                          resizeMode="stretch"
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </BoxShadow>

                <TouchableOpacity
                  onPress={() => {
                    //setIsMap(true);
                    if (isExpand) {
                      bottomSheetRef.current.snapTo(1);
                      setExpand(false);
                      _isExpanded = false;
                    } else {
                      bottomSheetRef.current.snapTo(0);
                      setExpand(true);
                      _isExpanded = true;
                    }
                  }}
                  style={{ marginLeft: 15 }}
                >
                  <BoxShadow
                    setting={{
                      width: 35,
                      height: 35,
                      color: "#000",
                      border: 5,
                      radius: 3,
                      opacity: 0.1,
                      x: 0,
                      y: 4,
                      style: { marginVertical: 5 },
                    }}
                  >
                    <View
                      style={
                        !isExpand ? styles.icon_box_clicked : styles.icon_box
                      }
                    >
                      <Image
                        style={{ width: 20, height: 20 }}
                        source={require("../../assets/icon_map.png")}
                        resizeMode="stretch"
                      />
                    </View>
                  </BoxShadow>
                </TouchableOpacity>

                {/* refRBSheet.current.c() */}
                <TouchableOpacity
                  onPress={() => {
                    refRBSheet.current.open();
                  }}
                  style={{ marginLeft: 15 }}
                >
                  <BoxShadow
                    setting={{
                      width: 35,
                      height: 35,
                      color: "#000",
                      border: 5,
                      radius: 3,
                      opacity: 0.1,
                      x: 0,
                      y: 4,
                      style: { marginVertical: 5 },
                    }}
                  >
                    <View style={styles.icon_box}>
                      <Image
                        style={{ width: 20, height: 20 }}
                        source={require("../../assets/icon_filter.png")}
                        resizeMode="stretch"
                      />
                    </View>
                  </BoxShadow>
                </TouchableOpacity>
              </View>

              {_business.length == 0 && (
                <View
                  style={{
                    height: Dimensions.get("window").height - 100,
                    backgroundColor: BaseColor.mainBackground,
                    alignItems: "center",
                  }}
                >
                  <Text style={[styles.secondaryText, { marginTop: 30 }]}>
                    No results found
                  </Text>
                </View>
              )}
            </View>
          )}
          data={_business}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => renderItem(item, index)}
          contentContainerStyle={{
            padding: 10,
            backgroundColor: BaseColor.mainBackground,
          }}
          onEndReached={() => {
            if (!onEndReachedCalled) {
              _page = _page + 1;
              retrieveMore(); // LOAD MORE DATA
            }
          }}
          onSettle={(index) => {
            if (index == 0) {
              // expanded
              setExpand(true);
              _isExpanded = true;
            } else {
              setExpand(false);
              _isExpanded = false;
            }
          }}
          onEndReachedThreshold={0.5}
        />

        <FilterView
          props={{ setFilterParams, filterBusiness }}
          ref={refRBSheet}
        />
      </View>
    </>
  );
}
