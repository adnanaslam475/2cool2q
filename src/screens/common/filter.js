import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import RBSheet from "react-native-raw-bottom-sheet";
import { BaseColor } from "../../common/color";
import styles from "../../common/style";
import { getCategory } from "../../service/category";
import style from "../../common/style";
import Slider from "@react-native-community/slider";
import Styles from "../../styles/commonScreens/filter";
import {
  ICON_LOGO,
  ICON_BUBBLE,
  BUTTONDONE,
  ICON_CLOSE,
} from "../../assets/index";

var isLoad = false;
var _categoryLists = [];

export const FilterView = forwardRef(function FilterViewInner(props, ref) {
  const [isSelectedOne, setSelectionOne] = useState(true);
  const [isSelectedTwo, setSelectionTwo] = useState(false);
  const [isSelectedThree, setSelectionThree] = useState(false);
  const [isSelectedFour, setSelectionFour] = useState(false);
  const [isSelectedFive, setSelectionFive] = useState(false);
  const [isTouched, setTouched] = useState(false);
  const [categoryId, setCategoryId] = useState(-1);
  const [distance, setDistance] = useState(10);
  const [categoryLists, setCategory] = useState([]);
  const refRBSheet = useRef();

  useEffect(() => {
    if (!isLoad) {
      // console.log("load category");
      loadCategory();
      isLoad = true;
    }
    if (_categoryLists.length > 0) {
      setCategory(_categoryLists);
    }
  }, []);

  const loadCategory = () => {
    let params = {
      name: "",
    };

    getCategory(params)
      .then((res) => {
        if (res.status == 200) {
          _categoryLists = res.categories;
          setCategory(res.categories);
        } else {
          console.log("category not status 200 = ", res);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useImperativeHandle(ref, () => ({
    open: () => {
      refRBSheet.current.open();
    },
    showAlert() {
      alert("Child Function Called");
    },
  }));

  const filter = () => {
    let params = {
      active: 1,
      favourite: isSelectedTwo ? 1 : -1,
      take_away: isSelectedThree ? 1 : -1,
      pick_up: isSelectedFour ? 1 : -1,
      delivery: isSelectedFive ? 1 : -1,
      category_id: categoryId,
      distance: distance,
    };
    props.props.setFilterParams(params);
    props.props.filterBusiness(params, "search");
    //parentRef.current.focusHandler(params);
  };

  const getW = () => {
    var val =
      parseInt(distance) != 0
        ? (Dimensions.get("window").width * 0.8 * parseInt(distance)) / 20
        : 0;
    val =
      parseInt(distance) == 20
        ? (Dimensions.get("window").width * 0.8 * 19) / 20
        : val;
    if (isNaN(val)) {
      return { value: 0, show: !isTouched };
    } else {
      return { value: parseInt(val), show: !isTouched };
    }
  };

  return (
    <View>
      <RBSheet
        ref={refRBSheet}
        height={Dimensions.get("window").height - 130}
        openDuration={50}
        customStyles={{
          container: {
            padding: 20,
            alignItems: "flex-start",
          },
        }}
      >
        <ScrollView showsHorizontalScrollIndicator={false}>
          <View style={Styles.container}>
            <Text
              style={[
                styles.primaryText,
                { color: BaseColor.primaryBlueColor },
              ]}
            >
              Filters
            </Text>

            <View style={Styles.filterView}>
              <TouchableOpacity
                style={Styles.selectFilter}
                onPress={() => {
                  setSelectionOne(!isSelectedOne);
                }}
              >
                <View
                  style={[
                    !isSelectedOne
                      ? styles.categoryText
                      : styles.categoryTextSelected,
                    Styles.selectFilter,
                  ]}
                >
                  <Image
                    style={Styles.iconLogo}
                    source={ICON_LOGO}
                    resizeMode="stretch"
                  />
                  <Text> Only </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setSelectionTwo(!isSelectedTwo);
                }}
              >
                <Text
                  style={
                    !isSelectedTwo
                      ? styles.categoryText
                      : styles.categoryTextSelected
                  }
                >
                  {" "}
                  Favourites{" "}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setSelectionThree(!isSelectedThree);
                }}
              >
                <Text
                  style={
                    !isSelectedThree
                      ? styles.categoryText
                      : styles.categoryTextSelected
                  }
                >
                  {" "}
                  Take away{" "}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setSelectionFour(!isSelectedFour);
                }}
              >
                <Text
                  style={
                    !isSelectedFour
                      ? styles.categoryText
                      : styles.categoryTextSelected
                  }
                >
                  {" "}
                  Pick up{" "}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setSelectionFive(!isSelectedFive);
                }}
              >
                <Text
                  style={
                    !isSelectedFive
                      ? styles.categoryText
                      : styles.categoryTextSelected
                  }
                >
                  {" "}
                  Delivery{" "}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.primaryText, Styles.caltegoriesText]}>
              Categories
            </Text>

            <View style={Styles.categoriesContainer}>
              {categoryLists.map((object, i) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      if (categoryId == object.CATG_ID) {
                        setCategoryId(-1);
                      } else {
                        setCategoryId(object.CATG_ID);
                      }
                    }}
                    key={i}
                  >
                    <Text
                      style={
                        object.CATG_ID != categoryId
                          ? styles.categoryText
                          : styles.categoryTextSelected
                      }
                      key={i}
                    >
                      {" "}
                      {object.CATG_Name}{" "}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={Styles.distanceContainer}>
              <Text
                style={[
                  styles.primaryText,
                  { color: BaseColor.primaryBlueColor },
                ]}
              >
                Distance
              </Text>
            </View>

            {!getW().show && (
              <View style={{ marginLeft: getW().value + 10, height: 25 }}>
                <Image
                  style={Styles.iconBubble}
                  source={ICON_BUBBLE}
                  resizeMode="stretch"
                />
                <Text style={[style.primaryText, Styles.kmText]}>
                  {distance}
                  {<Text>km</Text>}
                </Text>
              </View>
            )}

            <View style={{ marginTop: !getW().show ? -5 : 20 }}>
              <Slider
                style={Styles.slider}
                value={distance}
                minimumValue={0}
                maximumValue={20}
                thumbTintColor={BaseColor.primaryBlueColor}
                minimumTrackTintColor={BaseColor.primaryBlueColor}
                maximumTrackTintColor={BaseColor.grayColor}
                onValueChange={(distance) => {
                  setDistance(parseInt(distance));
                }}
                onSlidingStart={() => {
                  setTouched(true);
                }}
                onSlidingComplete={() => {
                  setTouched(false);
                }}
              />
            </View>

            <Text
              style={[
                style.primaryText,
                // eslint-disable-next-line react-native/no-inline-styles
                { marginTop: -5, marginLeft: getW().value, fontWeight: "500" },
              ]}
            >
              {getW().show && distance}
              {getW().show && <Text>km</Text>}
            </Text>
            <View style={Styles.dimention}>
              <TouchableOpacity
                onPress={() => {
                  filter();
                  refRBSheet.current.close();
                }}
              >
                <Image
                  style={styles.circle_button}
                  source={BUTTONDONE}
                  resizeMode="stretch"
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setCategoryId(-1);
                  setDistance(10);
                  setSelectionTwo(false);
                  setSelectionThree(false);
                  setSelectionFour(false);
                  setSelectionFive(false);
                  refRBSheet.current.close();

                  let params = {
                    active: -1,
                    favourite: -1,
                    take_away: -1,
                    pick_up: -1,
                    delivery: -1,
                    category_id: -1,
                    distance: 5000,
                  };
                  props.props.setFilterParams(params);
                  props.props.filterBusiness(params, "search");
                }}
              >
                <Image
                  style={styles.circle_button}
                  source={ICON_CLOSE}
                  resizeMode="stretch"
                />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </RBSheet>
    </View>
  );
});
