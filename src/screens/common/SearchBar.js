import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { BoxShadow } from "react-native-shadow";
import Styles from "../../styles/commonScreens/searchBar";
import styles from "../../common/style";
import { ICON_MAG, ICON_CROSE } from "../../assets/index";

var _type = 0;

// eslint-disable-next-line react/display-name
export const SearchBar = forwardRef((props, ref) => {
  const [key, setKey] = useState("");
  const [type, setType] = useState(0);

  useImperativeHandle(ref, () => ({
    open: (type) => {
      _type = type == 0 ? 140 : 40;

      setType(type);
      console.log("search type", _type);
    },
    showAlert() {
      alert("Child Function Called");
    },
  }));

  return (
    <BoxShadow
      setting={{
        width: Dimensions.get("window").width - _type,
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
      <View style={Styles.container}>
        <Image style={Styles.magIcon} source={ICON_MAG} resizeMode="stretch" />
        <TextInput
          style={[styles.primaryInput, Styles.textInpute]}
          placeholder="Search"
          returnKeyType="done"
          onSubmitEditing={() => props.props.searchByName(key)}
          value={key}
          onChangeText={(text) => {
            if (
              (text.length >= 3 || text.length == 0) &&
              !props.props.getEndReachCall()
            ) {
              props.props.searchByName(text);
            }
            setKey(text);
          }}
        />
        {key.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              var searchKey = key;
              setKey("");
              props.props.searchByName("");
            }}
          >
            <Image
              style={Styles.magIcon}
              source={ICON_CROSE}
              resizeMode="stretch"
            />
          </TouchableOpacity>
        )}
      </View>
    </BoxShadow>
  );
});
