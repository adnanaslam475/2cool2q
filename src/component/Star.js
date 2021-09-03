import React, { PureComponent } from "react";
import { StyleSheet, Animated, TouchableOpacity } from "react-native";
import { BaseColor } from "../common/color";

const STAR_IMAGE = require("../assets/ic_star1.png");
const STAR_SELECTED_IMAGE = require("../assets/ic_star_alt.png");
const STAR_SIZE = 50;

export default class Star extends PureComponent {
  static defaultProps = {
    selectedColor: "#0d97df",
    unselectedColor: "#d8d8d8",
  };

  // #d8d8d8dd

  constructor() {
    super();
    this.springValue = new Animated.Value(1);

    this.state = {
      selected: false,
    };
  }

  spring() {
    const { position, starSelectedInPosition } = this.props;

    this.springValue.setValue(1.2);

    Animated.spring(this.springValue, {
      toValue: 1,
      friction: 2,
      tension: 1,
    }).start();

    this.setState({ selected: !this.state.selected });
    starSelectedInPosition(position);
  }

  render() {
    const {
      fill,
      size,
      selectedColor,
      isDisabled,
      unselectedColor,
    } = this.props;
    const starSource =
      fill && selectedColor === null ? STAR_SELECTED_IMAGE : STAR_IMAGE;

    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={this.spring.bind(this)}
        disabled={isDisabled}
      >
        <Animated.Image
          source={starSource}
          style={[
            styles.starStyle,
            {
              tintColor: fill ? selectedColor : unselectedColor,
              width: size || STAR_SIZE,
              height: size || STAR_SIZE,
              transform: [{ scale: this.springValue }],
            },
          ]}
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  starStyle: {
    marginHorizontal: 4,
    marginVertical: 5,
  },
});
