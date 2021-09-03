import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import common_styles from "../../../common/style";
import styles from "./style";
import DepartmentTypeView from "../departmenttype/departmenttype";
import CheckInView from "../checkin/checkin";
import QueueView from "../queue/queue";
import BookView from "../book/book";
import Topbar from "../../../component/topbar";
import { Constants } from "../../../config/constants";
import {
  ICON_FAVORITE,
  ICON_PHONE,
  ICON_WEBSITE,
  ICON_DIRECTION,
  ICON_OPEN_TIME,
} from "../../../assets/index";

export default function DepartmentView(props) {
  // type = 1 : check in , type = 2  queue , type =3 book
  const [type, setType] = useState(0);
  const [business, setBusiness] = useState(null);

  goBack = () => {
    props.changeContentPage(Constants.TAB2);
  };

  openDepartmentDetails = (type) => {
    setType(type);
  };

  openDepartmentTicket = (type) => {
    props.changeContentPage(type);
  };
  getResource = () => {
    var bus = props.getBusiness();
    return bus.photo;
  };

  renderDepartmentType = () => {
    if (type == 0) {
      return <DepartmentTypeView {...this} />;
    } else if (type == 1) {
      return <CheckInView {...this} />;
    } else if (type == 2) {
      return <QueueView {...this} />;
    } else if (type == 3) {
      return <BookView {...this} />;
    }
  };

  return (
    <View style={styles.container}>
      <Topbar {...this} />
      <View style={styles.imageHeight}>
        <Image
          style={styles.imageHeight}
          source={{ uri: getResource() }}
          resizeMode="stretch"
        />
        <View style={styles.bannerBottom}>
          <View style={styles.bannerTitleContainerLeft}>
            <Text style={styles.bannerTitle}>
              {props.getBusiness().name} {props.getBusiness().name}{" "}
            </Text>
            <Text style={styles.bannerDescription}>
              {props.getBusiness().address}
            </Text>
          </View>
          <View style={styles.bannerTitleContainerRight}>
            <View style={styles.iconView}>
              <Image
                style={styles.itemIcon}
                source={ICON_FAVORITE}
                resizeMode="stretch"
              />
              <Text style={styles.bannerDescription}>
                {" "}
                {props.getBusiness().star}{" "}
              </Text>
            </View>
            <Text style={styles.bannerDescription}>Cafe Coffe</Text>
          </View>
        </View>
      </View>
      <View style={styles.iconPhone}>
        <View style={styles.itemContainer}>
          <View style={styles.itemBox}>
            <Image
              style={styles.itemIcon}
              source={ICON_PHONE}
              resizeMode="stretch"
            />
          </View>
        </View>
        <View style={styles.itemContainer}>
          <View style={styles.itemBox}>
            <Image
              style={styles.itemIcon}
              source={ICON_DIRECTION}
              resizeMode="stretch"
            />
          </View>
        </View>
        <View style={styles.itemContainer}>
          <View style={styles.itemBox}>
            <Image
              style={styles.itemIcon}
              source={ICON_FAVORITE}
              resizeMode="stretch"
            />
          </View>
        </View>
        <View style={styles.itemContainer}>
          <View style={styles.itemBox}>
            <Image
              style={styles.itemIcon}
              source={ICON_WEBSITE}
              resizeMode="stretch"
            />
          </View>
        </View>
      </View>
      <View style={[common_styles.divider, styles.divederMain]} />
      <View style={styles.deviderView}>
        <View style={styles.imageView}>
          <Image
            style={styles.itemIcon}
            source={ICON_OPEN_TIME}
            resizeMode="stretch"
          />
        </View>
        <View style={styles.menuView}>
          <TouchableOpacity onPress={() => {}}>
            <View style={common_styles.secondaryBtn}>
              <Text style={common_styles.btnText}>Menu</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      {renderDepartmentType()}
    </View>
  );
}
