import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from "react-native";
import styles from "../../common/style";
import { BaseColor } from "../../common/color";
import { BoxShadow } from "react-native-shadow";
import { CallApi } from "../../service/business";
import DefaultPreference from "react-native-default-preference";
import { Globals } from "../../config/globals";
import QuantityCounter from "../../component/QuantityCounter";
import Quantity from "../../component/OrderItem/Quantity";
import { Constants } from "../../config/constants";
import Styles from "../../styles/components/selectedMenu";
import Toast from "react-native-simple-toast";

var _clicked = false;
export default function SelectedMenu(props) {
  const [items, setItems] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [name, setName] = useState("");
  const [unit, setUnit] = useState(0);
  const [saved, setSaved] = useState(false);
  const [info, setInfo] = useState({});
  const [isInvalidName, setInvalidName] = useState({
    isActive: false,
    msg: "",
  });
  const { service_charges, taxes, vat } = props.getTaxes();
  const price = props.getPrice();
  const totalPrice = props.getTotalPrice();
  useEffect(() => {
    if (
      Globals.selectedBusiness.type != null &&
      Globals.selectedBusiness.type == "orders"
    ) {
      callGetOrder();
      setSaved(true);
    }
  }, []);

  const callGetOrder = () => {
    let par = {
      order_id: Globals.selectedBusiness.business.order_id,
    };
    
    CallApi(par, "getorder")
      .then((res) => {
        // console.log(res);
        if (res.status == 200) {
          props.setFilteredItemsVal(res.order_items);
          setInfo(res.date);
          var price = 0;
          var count = 0;
          for (var i = 0; i < res.order_items.length; i++) {
            price = price + res.order_items[i].price;
            count = count + res.order_items[i].count;
          }
          props.setPriceVal(price * 100);
          props.setPeepVal(count);
        } else if (res.status === 300 || res.status === 400) {
          Toast.show(res.msg, Toast.SHORT, ["UIAlertController"]);
        } else {
          Toast.show(res.msg, Toast.SHORT, ["UIAlertController"]);
        }
        // v
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    if (!name || name === "") {
      setInvalidName({ isActive: true, msg: "Invalid" });
      return;
    } else {
      setInvalidName({ isActive: false, msg: "" });
    }
    return () => {};
  }, [name]);

  /********* Save order **********/
  const callOrder = () => {
    DefaultPreference.getMultiple(["cprofile_id"])
      .then(function (values) {
        if (values[0] != null) {
          var menuId = props.getFilteredItemsData()[0].menu_id;
          const params = {
            cprofile_id: values[0],
            menus: props.getFilteredItemsData(),
            menuId: menuId,
            totalPrice: price,
            taxes: taxes / 100,
            service_charges: service_charges / 100,
            vat: vat / 100,
            grand_total: totalPrice,
            client_name: name,
            table_number: unit,
          };
          // console.log(params);
          const body = JSON.stringify(params);
          // console.log(body);
          CallApi(params, "order")
            .then((res) => {
              // console.log(res);
              if (res.status === 200) {
                setSaved(true);
                props.setSavedVal(true);
                setInfo(res.info);
              } else if (res.status === 300 || res.status === 400) {
                Toast.show(res.msg, Toast.SHORT, ["UIAlertController"]);
              } else {
                Toast.show(res.msg, Toast.SHORT, ["UIAlertController"]);
              }
              _clicked = false;
            })
            .catch((err) => {
              console.log(err);
              _clicked = false;
            });
        }
      })
      .catch((_err) => {
        _clicked = false;
      });
  };

  const renderItem = (item_type, index) => {
    return (
      /* Item selected Card  */
      <View style={Styles.container, {marginLeft: 20}}>
        <BoxShadow
          setting={{
            width: Dimensions.get("window").width - 40,
            height: 45,
            color: "#000",
            border: saved ? 0 : 3,
            radius: 3,
            opacity: 0.1,
            x: saved ? 0 : 1,
            y: saved ? 1 : 3,
            style: { marginVertical: 5 },
          }}
        >
          <View>
            <View
              style={[
                {
                  backgroundColor:
                    item_type.selected == 0
                      ? BaseColor.whiteColor
                      : BaseColor.grayColor,
                },
                Styles.menuView,
              ]}
            >
              <TouchableOpacity
                style={Styles.selectMenu}
                onPress={() => {
                  if (!saved) {
                    if (item_type.selected == 0) {
                      item_type.selected = 1;
                    } else {
                      item_type.selected = 0;
                    }
                    setDiscount(item_type.count);
                    setUnit(item_type.unit_price);
                    props.getFilteredItems(-1);
                  }
                }}
              >
                <View>
                  <Text
                    style={
                      (styles.itemTitle,
                      {
                        marginLeft: 10,
                        fontWeight: "700",
                        color: BaseColor.blackColor,
                      })
                    }
                  >
                    {item_type.name}{" "}
                  </Text>
                </View>
              </TouchableOpacity>

              {saved ? (
                <Quantity item={item_type} />
              ) : (
                <QuantityCounter
                  count={item_type.count}
                  onCountChange={(newCount) => {
                    item_type.count = newCount;
                    props.getFilteredItems(-1);
                  }}
                  max={Constants.MAX_NUMBER_ITEMS_TO_ORDER}
                />
              )}

              {/* subtotal*/}
              <View style={Styles.subTotal}>
                <Text style={(styles.itemTitle, Styles.subTotalText)}>
                  £ {(item_type.unit_price * item_type.count).toFixed(2)}{" "}
                </Text>
              </View>
            </View>
          </View>
        </BoxShadow>
      </View>
    );
  };

  return (
    <View style={Styles.container}>
      <View style={Styles.mainDetailsView} />
      <View style={Styles.container}>
        <FlatList
          showsVerticalScrollIndicator={false}
          style={Styles.flateList}
          keyExtractor={(item, index) => index.toString()}
          data={props.getFilteredItemsData()}
          renderItem={({ item, index }) => renderItem(item, index)}
        />
      </View>
      <View style={styles.divider} />
      <View style={Styles.devider}>
        <View style={Styles.container}>
          <Text style={styles.title}>Total</Text>
        </View>
        <View style={Styles.totalPrice}>
          <Text style={styles.title}>£ {props.getPrice().toFixed(2)}</Text>
        </View>
      </View>
      <View style={Styles.devider2}>
        <View style={Styles.container}>
          <Text style={styles.itemSubtitle}>V.A.T</Text>
        </View>
        <View style={Styles.textView}>
          <Text style={styles.itemSubtitle}>£ {(vat / 100).toFixed(2)}</Text>
        </View>
      </View>
      <View style={Styles.devider}>
        <View style={Styles.container}>
          <Text style={styles.itemSubtitle}>Taxes/Fee</Text>
        </View>
        <View style={Styles.textView}>
          <Text style={styles.itemSubtitle}>£ {(taxes / 100).toFixed(2)}</Text>
        </View>
      </View>
      <View style={Styles.devider}>
        <View style={Styles.container}>
          <Text style={styles.itemSubtitle}>Service Charge</Text>
        </View>
        <View style={Styles.textView}>
          <Text style={styles.itemSubtitle}>
            £ {(service_charges / 100).toFixed(2)}
          </Text>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={Styles.devider}>
        <View style={Styles.container}>
          <Text style={styles.title}>Grand Total</Text>
        </View>
        <View style={Styles.textView}>
          <Text style={styles.title}>£ {props.getTotalPrice().toFixed(2)}</Text>
        </View>
      </View>
      <View style={Styles.devider2}>
        <View style={Styles.textView}>
          <TextInput
            style={styles.primaryInput}
            placeholder="Table/Service unit"
          />
        </View>
      </View>
      <View style={Styles.smallDevider}>
        {!saved && (
          <TouchableOpacity
            onPress={() => {
              if (
                props.getFilteredItemsData().length > 0 &&
                _clicked == false
              ) {
                _clicked = true;
                // console.log(props.getFilteredItemsData().length);
                callOrder();
              }
            }}
          >
            <View style={Styles.setBorder}>
              <Text style={[styles.itemTitle, Styles.setText]}>Confirm</Text>
            </View>
          </TouchableOpacity>
        )}
        {saved && (
          <View style={Styles.saved}>
            <View style={Styles.container}>
              <Text style={[styles.itemTitle, Styles.customfont]}>Date : </Text>
            </View>
            {info.weekofday != null && (
              <View style={Styles.textView}>
                <Text style={[styles.itemTitle, Styles.customfont]}>
                  {info.weekofday.slice(0, 3)} {info.day}{" "}
                  {info.month.slice(0, 3)}
                  {info.time}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
}
