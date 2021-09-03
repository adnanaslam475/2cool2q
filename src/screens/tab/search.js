import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Image,
  FlatList,
  Text,
  TouchableOpacity,
  Dimensions,
  TouchableHighlight,
  ActivityIndicator,
} from "react-native";
import styles from "../../common/style";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { Constants } from "../../config/constants";
import { BoxShadow } from "react-native-shadow";
import { BaseColor } from "../../common/color";
import { FilterView } from "../common/filter";
import SearchBar from "../../component/SearchBar";
import { getBusinessListByFilter } from "../../service/business";
import Topbar from "../../component/topbar_search";
import { MyLocation, Globals } from "../../config/globals";
import DefaultPreference from "react-native-default-preference";
import ViewPager from "@react-native-community/viewpager";
import ShadowBox from "../../component/ShadowBox";
import Styles from "../../styles/pages/search";
import Modal from "react-native-modal";
import { CloseIcon } from "../../assets/index";
import { getGpsLocation } from "../../service/user";
// import { GetGpsLocation } from "../../screens/user/login";
import {
  STAR,
  DOUBLE_ARROW,
  ICON_MAP,
  ICON_BIZ_LIST,
  ICON_MINUS,
  ICON_PLUSE,
  FILTER_ICON,
  FILTER_ICON_WHITE,
} from "../../assets/index";
var isLocationDetected = false;
var _business = [];
var _location = {};
var _page = 1;
var _isCalling = false;
var _active = -1;
var _favourite = -1;
var _take_away = -1;
var _pick_up = -1;
var _delivery = -1;
var _category_id = -1;

export default function SearchView(props) {
  const [searchText, setSearchText] = useState("");
  const [height, setHeight] = useState(
    Math.round(Dimensions.get("window").height)
  );
  const [key, setKey] = useState("");
  const [onEndReachedCalled, setEndReachedCalled] = useState(false);
  const refRBSheet = useRef();
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
  const viewPager = useRef();
  const flatListRef = useRef();
  const [isBusinessArea, setBusinessArea] = useState(false);
  const [iInfo, setIndicator] = useState({
    isActive: false,
    msg: "Calculating location...",
  });

  useEffect(() => {
    _location = MyLocation;
    // TODO: This needs to be reviewed
    // We will calculate the location again when enter in the page 
    // GetGpsLocation.
    callGpsLocation();

    if (_business.length === 0) {
      _page = 1;
      retrieveMore();
    }
    isLocationDetected = true;
    Globals.selectedSlotId = -1;
    Globals.selectedDepartment = {};
  }, []);

  // TODO: Copied from Login.js, make it IMPORT
  const callGpsLocation = () => {
    let params = { name: "" };
    getGpsLocation(params)
      .then((res) => {
        if (res.location != null) {
          console.log("Gps search location = ", res.location.lat, res.location.lng);
          MyLocation.lat = res.location.lat;
          MyLocation.lng = res.location.lng;
        }
        _location = MyLocation;
      })
      .catch(() => {
        setIndicator({ isActive: false, msg: "No GPS location" });
      });
  };

  const handleSearchTextChange = (text) => {
    setKey(text);
    setSearchText(text);
    const isLengthValidForSearch = text.length === 0 || text.length >= 3;
    if (isLengthValidForSearch && !getEndReachCall()) {
      searchByName(text);
    }
  };

  goBack = () => {
    Globals.isBackClicked = true;
    props.changeContentPage(Constants.TAB_SEARCH_PAGE);
  };

  const openList = (business) => {
    Globals.scanQrDepartmentId = 0;
    props.changeContentPage(Constants.AVAILABILITY);
    Globals.selectedBusiness = business;
    props.changeBusiness(business);
  };

  const retrieveMore = () => {
    filterBusiness(null, "");
  };

  const getEndReachCall = () => {
    return onEndReachedCalled;
  };

  const searchByName = (key) => {
    setKey(key);
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

    _active = params.active;
    _favourite = params.favourite;
    _take_away = params.take_away;
    _pick_up = params.pick_up;
    _delivery = params.delivery;
    _category_id = params.category_id;
  };

  const filterBusiness = (params, type) => {
    setEndReachedCalled(true);
    // console.log("called filter business");
    _isCalling = true;
    if (type === "search") {
      _page = 1;
    }
    var searchKey = key;
    if (params != null && params.key != null) {
      searchKey = params.key;
    }
    
    DefaultPreference.getMultiple(["cprofile_id"])
      .then(function (values) {
        if (values[0] != null) {
          let par = {
            active: _active,
            favourites: _favourite,
            take_away: _take_away,
            pick_up: _pick_up,
            delivery: _delivery,
            category_id: _category_id,
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
          getBusinessListByFilter(par)
            .then((res) => {
              if (res.status === 200) {
                if (_page === 1) {
                  _business = res.businessList;
                } else {
                  _business = [..._business, ...res.businessList];
                }
                if (res.businessList === 0 && _page > 1) {
                  _page = _page - 1;
                  // console.log("- value called");
                }
                // console.log("Business list lenght = ",_business.length);
                setBusinesses(_business);
                if (_business.length === 0){
                  setBusinessArea(true); 
                } 
                Globals.allBusinessList = _business;
                if (parseInt(res.notification) > 0) {
                  props.setNotificationVal(parseInt(res.notification));
                }
              } 
              /*
              else if (res.status === 300 || res.status === 400) {
              } else {
              }
              */
              setEndReachedCalled(false);
              _isCalling = false;
            })
            .catch((_err) => {
              _isCalling = false;
              setEndReachedCalled(false);
            });
        } else {
          _isCalling = false;
          setEndReachedCalled(false);
        }
      })
      .catch((_err) => {
        _isCalling = false;
        setEndReachedCalled(false);
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
              width: Dimensions.get("window").width - 22, //- 22
              height: 120,
              color: "#000",
              border: 3,
              radius: 3,
              opacity: 0.1,
              x: 0,
              y: 4,
              style: Styles.boxShadow,
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
              <View style={Styles.boxContainer}>
                <View>
                  <Text style={styles.itemTitle}> {item.business.name}</Text>
                  {item.business._active === 0 && (
                    <Image style={styles.itemIcon} source={STAR} />
                  )}
                  <Text style={[styles.itemDescription, Styles.boxAddress]}>
                    {item.business.address}
                  </Text>
                  <Text style={[styles.itemDescription, Styles.boxPostCode]}>
                    {item.business.postcode}
                  </Text>
                  <View style={Styles.boxStar}>
                    <View style={Styles.boxKiloMeter}>
                      <Text style={[styles.itemStarText, Styles.boxStarMargin]}>
                        {item.business.star != null
                          ? item.business.star.toFixed(1)
                          : "0.0"}
                      </Text>
                      <Image
                        style={styles.itemIcon}
                        source={STAR}
                        resizeMode="stretch"
                      />
                    </View>

                    <Text style={[styles.itemTimeText, Styles.boxKM]}>
                      {" "}
                      {item.business.Distance != null
                        ? item.business.Distance.toFixed(2)
                        : "0.00"}{" "}
                      km{" "}
                    </Text>
                    <View style={Styles.boxEnd} />
                  </View>
                </View>
              </View>
            </View>
          </BoxShadow>
          {_business.length * 120 < Dimensions.get("window").height - 120 &&
            index === _business.length - 1 && (
              <View
                style={[
                  {
                    height:
                      Dimensions.get("window").height -
                      _business.length * 120 -
                      120,
                  },
                  Styles.bussnessHeight,
                ]}
              />
            )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={Styles.flex1}>
      <Topbar {...this} />
      <View style={Styles.flex1}>
        <ViewPager ref={viewPager} style={Styles.flex1} initialPage={1}>
          <View key="1">
            <View style={Styles.mapContainer}>
              <MapView
                style={[styles.map, Styles.mapView]}
                provider={PROVIDER_GOOGLE}
                region={region}
                onRegionChange={() => {}}
              >
                {_location != null && (
                  <Marker
                    coordinate={{
                      latitude: _location.lat != null ? _location.lat : 0,
                      longitude: _location.lng != null ? _location.lng : 0,
                    }}
                    pinColor={BaseColor.redColor}
                  />
                )}
                {_business.map((item, index) => {
                  return (
                    <Marker
                      key={index}
                      coordinate={{
                        latitude:
                          item.business.lat != null ? item.business.lat : 0,
                        longitude:
                          item.business.lng != null ? item.business.lng : 0,
                      }}
                      title={item.business.name}
                      description={item.business.address}
                      pinColor={BaseColor.primaryBlueColor}
                    >
                      <MapView.Callout
                        tooltip
                        onPress={() => {
                          viewPager.current &&
                            viewPager.current.setPageWithoutAnimation(1);
                          flatListRef.current.scrollToIndex({
                            animated: true,
                            index: index,
                          });
                        }}
                      >
                        <TouchableHighlight underlayColor="#dddddd">
                          <View style={Styles.mapPinBox}>
                            <Text style={styles.primaryText}>
                              {item.business.name}
                            </Text>
                            <Text style={Styles.businessAddress}>
                              {item.business.address}
                            </Text>
                          </View>
                        </TouchableHighlight>
                      </MapView.Callout>
                    </Marker>
                  );
                })}
              </MapView>
              <Image
                style={Styles.mapDoubleArrowSize}
                source={DOUBLE_ARROW}
                resizeMode="stretch"
              />
              <Image
                style={Styles.secondDoubleArrow}
                source={DOUBLE_ARROW}
                resizeMode="stretch"
              />
              <Image
                style={Styles.thirdDoubleArrow}
                source={DOUBLE_ARROW}
                resizeMode="stretch"
              />
              <TouchableOpacity
                style={Styles.withAnimation}
                onPress={() => {
                  viewPager.current &&
                    viewPager.current.setPageWithoutAnimation(1);
                }}
              >
                <BoxShadow
                  setting={{
                    width: 45,
                    height: 35,
                    color: "#000",
                    border: 5,
                    radius: 3,
                    opacity: 0.1,
                    x: 0,
                    y: 4,
                    style: Styles.boxShadow,
                  }}
                >
                  <View style={{
                        backgroundColor: BaseColor.whiteColor,
                        width: 45,
                        height: 55,
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 3, // TODO this margin shouldn't be here. Requires refactor in the whole app
                        borderRadius: 3
                  }}>
                    <Image
                      style={{
                        width: 40,
                        height: 40
                      }}
                      source={ICON_BIZ_LIST}
                      resizeMode="stretch"
                    />
                  </View>
                </BoxShadow>
              </TouchableOpacity>

              <TouchableOpacity
                style={Styles.zoomIcon}
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
                    style: Styles.boxShadow,
                  }}
                >
                  <View style={styles.icon_box}>
                    <Image
                      style={Styles.iconSize}
                      source={ICON_MINUS}
                      resizeMode="stretch"
                    />
                  </View>
                </BoxShadow>
              </TouchableOpacity>

              <TouchableOpacity
                style={Styles.zoomInIcon}
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
                    style: Styles.boxShadow,
                  }}
                >
                  <View style={styles.icon_box}>
                    <Image
                      style={Styles.plusIconWidth}
                      source={ICON_PLUSE}
                      resizeMode="stretch"
                    />
                  </View>
                </BoxShadow>
              </TouchableOpacity>
            </View>
          </View>
          <View key="2" style={Styles.searchBoxContainer}>
            <View style={Styles.searchBoxView}>
              <SearchBar
                value={searchText}
                onChange={handleSearchTextChange}
                onSubmit={searchByName}
              />

              {/* Map button */}
              <TouchableOpacity
                onPress={() => {
                  viewPager.current &&
                    viewPager.current.setPageWithoutAnimation(0);
                }}
                style={Styles.mapIcon}
              >
                <ShadowBox>
                  {/* { marginTop: 0 } overrides icon_box style. This should be refactored and icon_box shouldn't have a margin*/}
                  <View style={[styles.icon_box, Styles.searchShaddow]}>
                    <Image
                      style={Styles.plusIconWidth}
                      source={ICON_MAP}
                      resizeMode="stretch"
                    />
                  </View>
                </ShadowBox>
              </TouchableOpacity>
              {/* Filters button */}
              <TouchableOpacity
                onPress={() => {
                  refRBSheet.current.open();
                }}
                style={Styles.filterIconPosition}
              >
                <ShadowBox>
                  <View
                    style={[
                      _active !== -1 || _category_id !== -1 || _delivery !== -1
                        ? styles.icon_box_clicked
                        : styles.icon_box,
                      Styles.shadowBox,
                    ]}
                  >
                    <Image
                      style={Styles.plusIconWidth}
                      source={
                        _active !== -1 ||
                        _category_id !== -1 ||
                        _delivery !== -1
                          ? FILTER_ICON_WHITE
                          : FILTER_ICON
                      }
                      resizeMode="stretch"
                    />
                  </View>
                </ShadowBox>
              </TouchableOpacity>
            </View>
            {_business.length > 0 ? (
              <FlatList
                ref={flatListRef}
                showsVerticalScrollIndicator={false}
                style={Styles.flateListStyle}
                keyExtractor={(item, index) => index.toString()}
                data={_business}
                renderItem={({ item, index }) => renderItem(item, index)}
                onEndReachedThreshold={0.5}
                onEndReached={() => {
                  // console.log("end reached");
                  if (!_isCalling) {
                    // console.log("load more data", _page);
                    _page = _page + 1;
                    retrieveMore(); // LOAD MORE DATA
                  }
                }}
              />
            ) : (
              <View style={Styles.searchItem}>
                <Text style={[styles.secondaryText, Styles.loaderPosition]}>
                  <ActivityIndicator />
                </Text>
              </View>
            )}
          </View>
        </ViewPager>
        <FilterView
          props={{ setFilterParams, filterBusiness }}
          ref={refRBSheet}
        />
      </View>

      {/* TODO: No data modal info */}
        <Modal style={Styles.margin5} isVisible={isBusinessArea}>
          <View style={styles.modalContainer}>
            <View>
              <Text style={styles.modalHeader}>{" Sorry, no businesses in your area "}</Text>
              <Text style={styles.passwordTerm}>
                 No busineses registered in your area.{"\n"}
                 Try increasing the search distance to 20 km around in filters.{"\n"}
                 We are currently operating only in London but plans to expand worldwide. {"\n"}{"\n"}
                 You can recommend the app to your favourite or local businesses and benefit with our services and discounts. {"\n"}
                 Thanks!
              </Text>
              <TouchableOpacity
                style={Styles.setBusinessModalButton}
                onPress={() => setBusinessArea(false)}
              >
                <Image
                  style={Styles.closeIconSize}
                  source={CloseIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
    </View>
  );
}
