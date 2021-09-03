import { Image, StyleSheet, TextInput } from "react-native";
import React from "react";
import IconButton from "./IconButton";
import ShadowBox, { ShadowBoxType } from "./ShadowBox";
import { BaseColor } from "../common/color";

const iconMagnifyingGlass = require("../assets/mag.png");
const iconCross = require("../assets/icon_cross.png");

const styles = StyleSheet.create({
  container: {
    flexShrink: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: BaseColor.primaryBlueColor,
    backgroundColor: BaseColor.mainBackground,
  },

  // TODO: icons in the whole app should be refactored and be a single configurable component
  icon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  input: {
    height: 37,
    fontSize: 16,
    lineHeight: 0,
    flexGrow: 1,
    padding: 0,
    color: BaseColor.blackColor,
  },
});

/**
 * SearchBar component
 *
 * @param value - text to show in input
 * @param onChange - fired when input text changes
 * @param onSubmit - fired when input is submitted
 * @returns {JSX.Element}
 * @constructor
 */
const SearchBar = ({ value, onChange, onSubmit }) => {
  const placeholder = "Search";
  const showCrossIcon = value.length > 0;

  const clearInput = () => {
    onChange("");
  };

  return (
    <ShadowBox style={styles.container} type={ShadowBoxType.ROUND}>
      <Image source={iconMagnifyingGlass} style={styles.icon} />

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        returnKeyType="done"
        //value={value} //what was the purpose of this???
        onChangeText={onChange}
        onSubmitEditing={onSubmit}
      />

      {showCrossIcon && <IconButton source={iconCross} onPress={clearInput} />}
    </ShadowBox>
  );
};

export default SearchBar;
