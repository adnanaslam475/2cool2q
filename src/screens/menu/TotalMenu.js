import React, { useState, useEffect, useRef } from "react";
import {
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import styles from "../../common/style";
import { BaseColor } from "../../common/color";
import { BoxShadow } from "react-native-shadow";
import SearchBar from "../../component/SearchBar";
import { Constants } from "../../config/constants";
import QuantityCounter from "../../component/QuantityCounter";

var _current_index = 0;
export default function TotalMenu(props) {
  const [key, setKey] = useState("");
  const [imgWidth, setImageWidth] = useState(140);
  const [mymenu, setMymenu] = useState([]);
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const animatedOpacity2 = useRef(new Animated.Value(0)).current;
  const countPeepRef = useRef();

  useEffect(() => {
    if (_current_index != 0) {
      updateLayout(_current_index);
    }

    Animated.timing(animatedOpacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSearchTextChange = (text) => {
    setKey(text);
    const isLengthValidForSearch = text.length === 0 || text.length >= 3;
    if (isLengthValidForSearch) {
      searchByName(text);
    }
  };

  const searchByName = () => {
    props.searchItem(key);
  };

  const clickedMinus = () => {};
  const clickedPlus = () => {};

  const updateLayout = (index) => {
    _current_index = index;
    if (props != null && props != undefined) {
      let newArr = [...props.getItems()];
      if (
        newArr != null &&
        newArr != undefined &&
        newArr[index] != null &&
        newArr[index] != undefined
      ) {
        let tmp = !newArr[index].isShown;
        for (var i = 0; i < newArr.length; i++) {
          if (newArr[i].category != null) {
            newArr[i].isShown = false;
          }
        }

        newArr[index].isShown = tmp;
        let expanded = newArr[index].isShown;
        props.setItemsVal(newArr);
        setMymenu(newArr);
        // console.log(expanded);
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
      }
    }
  };

  const updateLayoutSub = (index1, index2) => {
    let newArr = [...props.getItems()];
    let tmp = !newArr[index1].items[index2].isShown;
    for (var i = 0; i < newArr.length; i++) {
      if (newArr[i].category != null) {
        newArr[i].isShown = false;
      }
      for (var j = 0; j < newArr[i].items.length; j++) {
        if (newArr[i].items[j].subcategory != null) {
          newArr[i].items[j].isShown = false;
        }
      }
    }

    newArr[index1].isShown = true;
    newArr[index1].items[index2].isShown = tmp; //!newArr[index1]['items'][index2]['isShown'];
    props.setItemsVal(newArr);
    setMymenu(newArr);
  };

  const showExpand = (item_type, level) => {
    if (level == 1) {
      if (item_type.len == 0) {
        return (
          <View style={{ marginRight: 20 }}>
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
            <View style={{ marginRight: 20 }}>
              <Image
                style={{ width: 25, height: 25 }}
                source={require("../../assets/ic_white_blue_arrow_up.png")}
                resizeMode="stretch"
              />
            </View>
          );
        } else {
          return (
            <View style={{ marginRight: 20 }}>
              <Image
                style={{ width: 25, height: 25 }}
                source={require("../../assets/ic_white_blue_arrow_down.png")}
                resizeMode="stretch"
              />
            </View>
          );
        }
      }
    } else if (level == 2) {
      if (item_type.len == 0) {
        return (
          <View style={{ marginRight: 20 }}>
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
            <View style={{ marginRight: 20 }}>
              <Image
                style={{ width: 25, height: 25 }}
                source={require("../../assets/ic_blue_white_arrow_up.png")}
                resizeMode="stretch"
              />
            </View>
          );
        } else {
          return (
            <View style={{ marginRight: 20 }}>
              <Image
                style={{ width: 25, height: 25 }}
                source={require("../../assets/ic_blue_white_arrow_down.png")}
                resizeMode="stretch"
              />
            </View>
          );
        }
      }
    }
  };

  function onError(error) {
    setImageWidth(0);
  }

  const rednerItemDetail = (item, index1, index2) => {
    return (
      <View>
        <BoxShadow
          setting={{
            width: Dimensions.get("window").width - 30,
            height: item.item_link != null && item.item_link.includes("http")
            ? 130 
            : 90,
            color: "#000",
            border: 5,
            radius: 3,
            opacity: 0.1,
            x: 0,
            y: 3,
            style: { marginVertical: 5 },
          }}
        >

          {/* Whole Card */}
          <View style={[styles.card_bg, { 
            height: item.item_link != null && item.item_link.includes("http")
            ? 130 
            : 90}
            ]}>

            <Image
              style={[
                styles.itemImg,
                { 
                  height: 130,
                  width:
                    item.item_link != null && item.item_link.includes("http")
                      ? 120
                      : 0,
                },
              ]}
              source={{ uri: item.item_link }}
              resizeMode="stretch"
              onError={onError.bind(this)}
            />

            <View
              style={{
                flex: 1,
                marginLeft: 5,
                paddingTop: 0,
                paddingBottom: 10,
              }}
            >
              {/* Menu item name */}
              <View style={{ marginRight: 10 }}>
                {/* Name, allergies, price */}
                <View style={
                  { flexDirection: "row", 
                    marginTop: 3,
                    width:
                          (item.item_link != null)
                            ? '100%'
                            : '100%',
                  }}>

                  {/* Name */}
                  <Text
                    style={[
                      styles.itemTitle,
                      {fontSize: 14,
                      fontWeight: "500", flex:2, flexDirection: "row",},                  
                      {/*width:
                          item.allergies != true &&
                          item.glutten_free != true &&
                          item.vegan != true &&
                          item.vegetarian != true
                          ? '80%'
                          : '50%',*/
                      },
                    ]}
                    numberOfLines={2}
                  >
						 
                    {item.name}
                  </Text>

                  {/* Allergies tags */}
                  <View
                    style= {{ 
                      flex: 1,
                      flexDirection: "row",
                      flexWrap: "wrap",
                      /*width: 
                        item.item_link != null
                          ? '20%'
                          : '30%',*/
                  }}>

                    {/* Nut allergies icon */}
                    {item.allergies == true && (
                      <Image
                        style={[styles.menuImageIcon, { marginLeft: 5, marginBottom : 5 }]}
                        source={require("../../assets/menu_icons/suitable_contain_nuts.png")}
                        resizeMode="stretch"
												  
                      />
                    )}

                    {/* Gluten free icon */}
                    {item.glutten_free == true && (
                      <Image
                        style={[styles.menuImageIcon, { marginLeft: 5, marginBottom : 5 }]}
                        source={require("../../assets/menu_icons/suitable_gluten_free.png")}
                        resizeMode="stretch"
                        onError={onError.bind(this)}
                      />
                    )}

                    {/* Vegan icon */}
                    {item.vegan == true && (
                      <Image
                        style={[styles.menuImageIcon, { marginLeft: 5, marginBottom : 5 }]}
                        source={require("../../assets/menu_icons/suitable_vegan.png")}
                        resizeMode="stretch"
                        onError={onError.bind(this)}
                      />
                    )}

                    {/* Vegetarian icon */}
                    {item.vegetarian == true && (
                      <Image
                        style={[styles.menuImageIcon, { marginLeft: 5, marginBottom : 5 }]}
                        source={require("../../assets/menu_icons/suitable_vegetarian.png")}
                        resizeMode="stretch"
                        onError={onError.bind(this)}
                      />
                    )}
                  </View>

                  {/* Price  20% */}
                  {item.unit_price != null && (
                    <Text
                      style={
                        (styles.itemTitle,
                        {
                          marginTop: 0,
                          flex: 1,
                          fontSize: 14,
                          //marginLeft: 10,
                          fontWeight: "400",
                          textAlign: "right",
                          //width: '30%',
                        })
                      }
                    >
                      £ {item.unit_price.toFixed(2)}
                    </Text>
                  )}
                </View>

                <Text
                  style={
                    (styles.itemDescription,
                    { marginTop: 0, color: BaseColor.grayColor })
                  }
                  numberOfLines={2}
                >
					   
                  {item.des}{" "}
                </Text>

                <View style={{ flexDirection: "row", marginTop: 10 }}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  />
                  <QuantityCounter
                    count={item.count}
                    max={Constants.MAX_NUMBER_ITEMS_TO_ORDER}
                    onCountChange={(newCount) => {
                      item.count = newCount;
                      props.getFilteredItems(key.length);
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        </BoxShadow>
      </View>
    );
  };

  const renderSubCategory = (item_type, index1, index2) => {
    return (
      <View>
        <View>
          {item_type.subcategory != null && (
            <View
              style={{
                marginLeft: 0,
                marginRight: 0,
                flexDirection: "row",
                alignItems: "center",
                borderColor: BaseColor.primaryBlueColor,
                borderWidth: 1,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  updateLayoutSub(index1, index2);
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
                        fontWeight: "700",
                        color:
                          item_type.status == true
                            ? BaseColor.blackColor
                            : BaseColor.primaryBlueColor,
                      },
                    ]}
                  >
                    {item_type.subcategory}
                  </Text>
                  <View style={{}} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  updateLayoutSub(index1, index2);
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  {showExpand(item_type, 2)}
                </View>
              </TouchableOpacity>
            </View>
          )}

          {item_type.isShown && (
            <FlatList
              showsVerticalScrollIndicator={false}
              style={{ marginTop: 5, marginBottom: 0 }}
              keyExtractor={(item, index) => index.toString()}
              data={item_type.items}
              renderItem={({ item }) => rednerItemDetail(item, index1, index2)}
            />
          )}

          <View style={{ marginTop: 5, marginBottom: 5 }} />
        </View>
      </View>
    );
  };

  const renderItem = (item_type, i) => {
    return (
      <View style={{}}>
        <View>
          {item_type.category != null && (
            <View
              style={{
                marginLeft: 15,
                marginRight: 15,
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: BaseColor.primaryBlueColor,
              }}
            >
              <TouchableOpacity
                onPress={() => updateLayout(i)}
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
                        fontWeight: "700",
                        color:
                          item_type.status == true
                            ? BaseColor.blackColor
                            : BaseColor.whiteColor,
                      },
                    ]}
                  >
                    {item_type.category}
                  </Text>
                  <View style={{}} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => updateLayout(i)}>
                <View style={{ flexDirection: "row" }}>
                  {showExpand(item_type, 1)}
                </View>
              </TouchableOpacity>
            </View>
          )}

          {item_type.isShown && (
            <FlatList
              showsVerticalScrollIndicator={false}
              style={{
                marginTop: 10,
                marginBottom: 0,
                marginLeft: 15,
                marginRight: 15,
              }}
              keyExtractor={(item, index) => index.toString()}
              data={item_type.items}
              renderItem={({ item, index }) =>
                renderSubCategory(item, i, index)
              }
            />
          )}

          <View style={{ marginTop: 5, marginBottom: 5 }} />
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        syle={{
          backgroundColor: BaseColor.mainBackground,
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignContent: "center",
            marginLeft: 20,
            marginRight: 20,
            marginTop: 5,
            marginBottom: 0,
            paddingLeft: 0,
            paddingRight: 10,
            alignItems: "center",
          }}
        >
          <SearchBar
            value={key}
            onChange={handleSearchTextChange}
            onSubmit={searchByName}
          />
        </View>
      </View>

      <View style={{ flex: 1 }}>
        {key.length == 0 && (
          <FlatList
            showsVerticalScrollIndicator={false}
            style={{
              marginTop: 10,
              marginBottom: 10,
              marginLeft: 0,
              marginRight: 0,
            }}
            keyExtractor={(item, index) => index.toString()}
            data={props.getItems()}
            renderItem={({ item, index }) => renderItem(item, index)}
          />
        )}

        {key.length != 0 && (
          <FlatList
            showsVerticalScrollIndicator={false}
            style={{
              marginTop: 10,
              marginBottom: 10,
              marginLeft: 15,
              marginRight: 0,
            }}
            keyExtractor={(item, index) => index.toString()}
            data={props.getSearchLists()}
            renderItem={({ item }) => rednerItemDetail(item, 0, 0)}
          />
        )}
      </View>
    </View>
  );
}
