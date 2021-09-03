import React from "react";
import { Text, View } from "react-native";
import IconButton from "./IconButton";
import Styles from "../styles/components/quantityCounter";
const iconPlus = require("../assets/icon_plus.png");
const iconMinus = require("../assets/icon_minus.png");

const QuantityCounter = ({ count, max, min, onCountChange }) => {
  const step = 1;
  const disableIncrement = max !== null ? count === max : false;
  const disableDecrement = count === min;

  const onIncrement = () => {
    if (!disableIncrement) {
      onCountChange(count + step);
    }
  };

  const onDecrement = () => {
    if (!disableDecrement) {
      onCountChange(count - step);
    }
  };

  return (
    <View style={Styles.container}>
      <IconButton
        source={iconMinus}
        onPress={onDecrement}
        disabled={disableDecrement}
      />
      <Text style={Styles.number}>{count}</Text>
      <IconButton
        source={iconPlus}
        onPress={onIncrement}
        disabled={disableIncrement}
      />
    </View>
  );
};

QuantityCounter.defaultProps = {
  count: 0,
  min: 0,
  max: null,
  onCountChange: () => {},
};

export default QuantityCounter;
