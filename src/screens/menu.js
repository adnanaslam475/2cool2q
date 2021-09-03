import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  FlatList,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import common_styles from "../common/style";
import styles from "../screens/tab/availability/style";
import { BoxShadow } from "react-native-shadow";
import { BaseColor } from "../common/color";
import { getMenus } from "../service/business";
import Topbar2 from "../component/topbar2";
import { MyLocation, Globals } from "../config/globals";
import Styles from "../styles/pages/mainmenu";
import Toast from "react-native-simple-toast";

var isLocationDetected = false;
var _menus = [];
var _peep = 0;

export default function Menuscreen(props) {
  const [key, setKey] = useState("");
  const [peep, setPeep] = useState(0);
  const [price, setPrice] = useState(0);
  const [onEndReachedCalled, setEndReachedCalled] = useState(false);
  const [menus, setMenus] = useState([]);
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
    setPeep(0);
    setPrice(0);
    callMenus();
  }, []);

  goBack = () => {
    props.navigation.goBack();
  };

  retrieveMore = () => {
    callMenus();
  };

  callMenus = () => {
    let par = {
      department_id: Globals.selectedDepartment.department_id,
    };
    getMenus(par)
      .then((res) => {
        // console.log(res);
        if (res.status == 200) {
          if (res.menus.length > 0) {
            _menus = res.menus;
            var tmp = [];
            for (var i = 0; i < res.menus.length; i++) {
              tmp[i] = {
                count: 0,
                menu: res.menus[i],
              };
            }
            setMenus(tmp);
            setEndReachedCalled(false);
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
  };
  getPrice = () => {
    return price / 100;
  };

  // eslint-disable-next-line react/display-name
  renderItem = (item) => {
    return (
      <View>
        <BoxShadow
          setting={{
            width: Dimensions.get("window").width - 22,
            height: 120,
            color: "#000",
            border: 5,
            radius: 3,
            opacity: 0.1,
            x: 0,
            y: 3,
            style: Styles.mainMenuBlock,
          }}
        >
          <View style={common_styles.card_bg}>
            <Image
              style={common_styles.itemImg}
              source={{ uri: item.menu.item_link }}
              resizeMode="stretch"
            />
            <View style={Styles.mainMenuContainer}>
              <View style={Styles.menuName}>
                <Text style={common_styles.itemTitle} numberOfLines={1}>
                  {item.menu.name}
                </Text>
                <Text
                  style={
                    (common_styles.itemDescription,
                    { marginTop: 7, color: BaseColor.grayColor })
                  }
                  numberOfLines={2}
                >
                  {item.menu.des}
                </Text>
                <View style={Styles.menuTitleView}>
                  <View style={Styles.menuView}>
                    <Text style={(common_styles.itemTitle, Styles.menuText)}>
                      £ {item.menu.unit_price}
                    </Text>
                  </View>
                  <View style={Styles.menuList}>
                    <TouchableOpacity
                      onPress={() => {
                        if (item.count > 0) {
                          item.count--;
                          setPeep(peep - 1);
                          setPrice(price - item.menu.unit_price * 100);
                        }
                      }}
                    >
                      <Image
                        style={common_styles.sign}
                        source={require("../assets/icon_minus.png")}
                        resizeMode="stretch"
                      />
                    </TouchableOpacity>

                    <Text style={Styles.menuTitle}>{item.count}</Text>

                    <TouchableOpacity
                      onPress={() => {
                        item.count++;
                        setPeep(peep + 1);
                        setPrice(price + item.menu.unit_price * 100);
                      }}
                    >
                      <Image
                        style={common_styles.sign}
                        source={require("../assets/icon_plus.png")}
                        resizeMode="stretch"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </BoxShadow>
      </View>
    );
  };

  return (
    <>
      <Topbar2 {...this} />
      <View style={Styles.topBar2}>
        <View style={Styles.menuSize}>
          {menus.map((obj, index) => {
            if (index == 0) {
              // console.log(obj.menu.menu_link);
              return (
                <Image
                  key={index}
                  style={Styles.menuSize}
                  source={{ uri: obj.menu.menu_link }}
                  resizeMode="stretch"
                />
              );
            }
          })}
          <View style={styles.bannerBottom} />
          {menus.map((obj, index) => {
            if (index == 0) {
              return (
                <View style={styles.bannerBottomTitle} key={index}>
                  <View style={styles.bannerTitleContainerLeft}>
                    <Text
                      key={index}
                      numberOfLines={1}
                      style={styles.bannerTitle}
                    >
                      {obj.menu.menu_name}
                    </Text>
                  </View>
                </View>
              );
            }
          })}
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{ marginTop: 0, marginBottom: 0 }}
          keyExtractor={(item, index) => index.toString()}
          data={menus}
          renderItem={({ item, index }) => renderItem(item, index)}
          onEndReached={() => {}}
          // refreshing={this.state.refreshing}
          // onRefresh={this.handleRefresh}
        />
        <View style={Styles.items}>
          <View>
            <Text style={common_styles.itemTitle}>
              {peep} items | £ {getPrice().toFixed(2)}
            </Text>
            <Text style={common_styles.itemDescription}>
              Extra change may apply
            </Text>
          </View>
          <View style={{ marginLeft: 40 }}>
            <TouchableOpacity onPress={() => {}}>
              <View
                style={[
                  common_styles.secondaryBtn,
                  {
                    backgroundColor:
                      price == 0
                        ? BaseColor.grayColor
                        : BaseColor.primaryBlueColor,
                  },
                ]}
              >
                <Text style={common_styles.btnText}>Checkout</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}
