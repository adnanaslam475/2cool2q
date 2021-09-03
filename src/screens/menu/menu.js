import React, { useState, useEffect, useMemo } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import styles from "../../common/style";
import { BaseColor } from "../../common/color";
import Topbar2 from "../../component/topbar2";
import { Globals } from "../../config/globals";
import { CallApi, getMenus } from "../../service/business";
import TotalMenu from "./TotalMenu";
import SelectedMenu from "./SelectedMenu";
import Styles from "../../styles/pages/menu";
import Toast from "react-native-simple-toast";

export default function MenuScreen(props) {
  const [old_items, setOldItems] = useState([]);
  const [items, setItems] = useState([]);
  const [taxesData, setTaxesData] = useState({
    service_charges: 0,
    taxes: 0,
    vat: 0,
  }); // calced tax value
  const [taxes, setTaxes] = useState({
    service_charges: 0,
    taxes: 0,
    vat: 0,
  }); // tax init value
  const [searchList, setSearchList] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [peep, setPeep] = useState(0); // peep name is used instead of selected items
  const [price, setPrice] = useState(0);
  const [type, setType] = useState(1);
  const [search, setSearch] = useState(false);
  const [saved, setSaved] = useState(false);
  const [menuData, setMenuData] = useState({});
  const [businessData, setBusinessData] = useState({});
  const totalPrice = useMemo(() => {
    // console.log("taxes?.taxes", taxes?.taxes || 0);
    return (
      parseInt(price || 0) +
      parseInt(taxes?.taxes || 0) +
      parseInt(taxes?.vat || 0) +
      parseInt(taxes?.service_charges || 0)
    );
  }, [taxes, price]); // calced total cost
  useEffect(() => {
    if (
      Globals.selectedBusiness.type != null &&
      Globals.selectedBusiness.type == "orders"
    ) {
      setType(2);
    } else {
      callMenus();
      callBusiness();
    }
  }, []);

  goBack = () => {
    if (type == 1 || saved) {
      props.navigation.goBack();
    } else {
      changePage(1);
    }
  };

  getPrice = () => {
    return price / 100;
  };
  getTaxes = () => {
    return taxes;
  };

  getItems = () => {
    return items;
  };
  getTotalPrice = () => {
    return totalPrice / 100;
  };
  // called when make order for getting menus
  getFilteredItems = (search_len) => {
    var flag = true;
    if (search_len > 0) {
      setSearch(true);
      flag = true;
    } else if (search_len == 0) {
      setSearch(false);
      flag = false;
    } else if (search_len == -1) {
      flag = search;
    }
    var tmp = [];
    var index = 0;
    var count = 0;
    var price = 0;
    // get from search lists.
    if (flag) {
      for (var i = 0; i < searchList.length; i++) {
        if (searchList[i].count > 0) {
          tmp[index] = searchList[i];
          index = index + 1;
          count = count + searchList[i].count;
          price = price + searchList[i].count * searchList[i].unit_price * 100;
        }
      }
    }
    // add to main lists form search lists.
    for (var i = 0; i < items.length; i++) {
      for (var k = 0; k < items[i].items.length; k++) {
        for (var j = 0; j < items[i].items[k].items.length; j++) {
          var myIndex = -1;
          for (var l = 0; l < tmp.length; l++) {
            if (
              tmp[l].count > 0 &&
              items[i].items[k].items[j].item_id == tmp[l].item_id
            ) {
              myIndex = l;
              break;
            }
          }
          if (myIndex != -1) {
            items[i].items[k].items[j] = tmp[myIndex];
          }
        }
      }
    }
    // get total tmp count
    tmp = [];
    index = 0;
    var count = 0;
    var price = 0;
    for (var i = 0; i < items.length; i++) {
      for (var k = 0; k < items[i].items.length; k++) {
        for (var j = 0; j < items[i].items[k].items.length; j++) {
          if (items[i].items[k].items[j].count > 0) {
            tmp[index] = items[i].items[k].items[j];
            index = index + 1;
            count = count + items[i].items[k].items[j].count;
            price =
              price +
              items[i].items[k].items[j].count *
              items[i].items[k].items[j].unit_price *
              100;
          }
        }
      }
    }
    const { service_charges, taxes, vat } = taxesData;
    setTaxes({
      service_charges: price * (service_charges / 100),
      taxes: price * (taxes / 100),
      vat: price * (vat / 100),
    });

    setPeep(count);
    setPrice(price);
    setFilteredItems(tmp);
  };

  setFilteredItemsVal = (val) => {
    setFilteredItems(val);
  };
  setSavedVal = () => {
    setSaved(true);
  };

  getFilteredItemsDelete = () => {
    var tmp = [];
    var index = 0;
    var count = 0;
    var price = 0;
    for (var i = 0; i < items.length; i++) {
      for (var k = 0; k < items[i].items.length; k++) {
        for (var j = 0; j < items[i].items[k].items.length; j++) {
          if (
            items[i].items[k].items[j].count > 0 &&
            items[i].items[k].items[j].selected == 0
          ) {
            tmp[index] = items[i].items[k].items[j];
            index = index + 1;
            count = count + items[i].items[k].items[j].count;
            price =
              price +
              items[i].items[k].items[j].count *
              items[i].items[k].items[j].unit_price *
              100;
          }
          if (
            items[i].items[k].items[j].count > 0 &&
            items[i].items[k].items[j].selected == 1
          ) {
            items[i].items[k].items[j].selected = 0;
            items[i].items[k].items[j].count = 0;
          }
        }
      }
    }

    if (search) {
      for (var i = 0; i < searchList.length; i++) {
        if (searchList[i].count > 0 && searchList[i].selected == 0) {
          tmp[index] = searchList[i];
          index = index + 1;
          count = count + searchList[i].count;
          price = price + searchList[i].count * searchList[i].unit_price * 100;
        }
        if (searchList[i].count > 0 && searchList[i].selected == 1) {
          searchList[i].count = 0;
          searchList[i].selected = 0;
        }
      }
    }

    setPeep(count);
    setPrice(price);
    setFilteredItems(tmp);
  };

  searchItem = (key) => {
    var filtered_data = [];
    var total_items = [];
    var isCat = false;
    var isSub = false;
    if (key != null && key.length > 2) {
      for (var category = 0; category < old_items.length; category++) {
        var tmp = {};
        var sub = [];
        if (key != null && key.length > 0) {
          isCat = false;
          if (
            old_items[category].category != null &&
            old_items[category].category
              .toLowerCase()
              .includes(key.toLowerCase())
          ) {
            isCat = true;
          }
          for (
            var subcategory = 0;
            subcategory < old_items[category].items.length;
            subcategory++
          ) {
            isSub = false;
            if (
              old_items[category].items[subcategory].subcategory != null &&
              old_items[category].items[subcategory].subcategory
                .toLowerCase()
                .includes(key.toLowerCase())
            ) {
              isSub = true;
            }
            var items = [];
            for (
              var k = 0;
              k < old_items[category].items[subcategory].items.length;
              k++
            ) {
              var obj = {};
              if (
                isCat ||
                isSub ||
                old_items[category].items[subcategory].items[k].name
                  .toLowerCase()
                  .includes(key.toLowerCase())
              ) {
                var it = old_items[category].items[subcategory].items[k];
                var index = -1;
                for (var j = 0; j < filteredItems.length; j++) {
                  if (
                    filteredItems[j].item_id ==
                    old_items[category].items[subcategory].items[k].item_id
                  ) {
                    index = j;
                  }
                }
                if (index != -1) {
                  obj = {
                    menu_id: it.menu_id,
                    item_id: it.item_id,
                    name: it.name,
                    item_link: it.item_link,
                    des: it.des,
                    unit_price: it.unit_price,
                    count: filteredItems[index].count,
                    selected: 0,
                  };
                } else {
                  obj = {
                    menu_id: it.menu_id,
                    item_id: it.item_id,
                    name: it.name,
                    item_link: it.item_link,
                    des: it.des,
                    unit_price: it.unit_price,
                    count: 0,
                    selected: 0,
                  };
                }
                items.push(obj);
                total_items.push(obj);
              }
            }
            var v1 = {
              subcategory: null,
              sub_id: null,
              isShown: true,
              items: items,
            };
            sub.push(v1);
          }
        }
        tmp = { category: null, cat_id: null, isShown: true, items: sub };
        filtered_data.push(tmp);
      }
      // console.log(total_items);
      setSearchList(total_items);
    } else {
    }
  };

  getSearchLists = () => {
    return searchList;
  };

  getFilteredItemsData = () => {
    return filteredItems;
  };

  getPeep = () => {
    return peep;
  };

  setPeepVal = (p) => {
    setPeep(p);
  };
  setPriceVal = (p) => {
    setPrice(p);
  };
  setItemsVal = (its) => {
    setItems(its);
  };

  changePage = (val) => {
    setType(val);
  };

  renderMenuPage = () => {
    if (type == 1) {
      return <TotalMenu {...this} />;
    } else if (type == 2) {
      return <SelectedMenu {...this} />;
    }
  };

  async function callMenus() {
    let par = {
      department_id: Globals.selectedDepartment.department_id,
    };
    getMenus(par)
      .then((res) => {
        // console.log(res);
        if (res.status == 200) {
          if (res.menus.length > 0) {
            setOldItems(res.menus);
            setItems(res.menus);
          }
          if (res.taxesdata) {
            setTaxesData(res.taxesdata);
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

  async function callBusiness() {
    let par = {
      department_id: Globals.selectedDepartment.department_id,
    };
    CallApi(par, "getBusinessByDept")
      .then((res) => {
        console.log(res);
        if (res.status == 200) {
          setMenuData(res.menu);
          setBusinessData(res.business);
        } else if (res.status === 300 || res.status === 400) {
          alert("No business data");
          Toast.show(res.msg, Toast.SHORT, ["UIAlertController"]);
        } else {
          Toast.show(res.msg, Toast.SHORT, ["UIAlertController"]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <View style={Styles.mainMenuContainer}>
      <Topbar2 {...this} />
      <View style={Styles.mainMenuView}>
        <Image
          style={Styles.menuImageSize}
          source={{
            uri:
              menuData != null &&
                menuData.photo != null &&
                menuData.photo.includes("http")
                ? menuData.photo
                : Globals.selectedBusiness.business.photo,
          }}
        />
        <View style={Styles.menuView}>
          <Text
            style={[
              styles.itemTitle,
              // eslint-disable-next-line react-native/no-inline-styles
              { color: BaseColor.whiteColor, padding: 7 },
            ]}
          >
            {Globals.selectedBusiness.business.name}
            {"\n"}
            {Globals.selectedDepartment.name}
          </Text>
        </View>

        {/* Shopping Card */}
        <TouchableOpacity
          style={Styles.menuList}
          onPress={() => {
            if (peep > 0) setType(2);
            console.log("press", Globals.departmentId);
          }}
        >
          <View style={Styles.cartContainer}>
            <Image
              style={Styles.cartIcon}
              source={require("../../assets/ic_cart.png")}
            />
            {peep > 0 && !saved && (
              <View style={Styles.peepView}>
                <Text style={Styles.peepText}>{peep}</Text>
              </View>
            )}
            <View style={Styles.peepStyle}>
              <Text
                style={[
                  styles.itemTitle,
                  { color: BaseColor.primaryBlueColor },
                ]}
              >
                {" "}
                £ {getPrice().toFixed(2)}{" "}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={Styles.menuListView}>
          <View style={{}}>
            <Text style={[styles.itemTitle, Styles.menuText]}>
              {type == 1 && menuData?.MENU_name != null
                ? menuData.MENU_name
                : ""}
              {type == 2 ? "Your Order" : ""}
            </Text>
          </View>
        </View>
      </View>
      {renderMenuPage()}
    </View>
  );
}
