import _ from "lodash";
import React, { Component } from "react";
import { Text, View } from "react-native";
import Star from "./Star";
import Styles from "../styles/components/topRating";

export default class TapRating extends Component {
  static defaultProps = {
    defaultRating: 3,
    reviews: ["Terrible", "Bad", "Okay", "Good", "Great"],
    count: 5,
    onFinishRating: () =>
      console.log("Rating selected. Attach a function here."),
    showRating: true,
  };

  constructor() {
    super();
    this.state = {
      position: 5,
    };
  }

  componentDidMount() {
    const { defaultRating } = this.props;
    this.setState({ position: defaultRating });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.defaultRating !== this.props.defaultRating) {
      this.setState({ position: nextProps.defaultRating });
    }
  }

  renderStars(rating_array) {
    return _.map(rating_array, (star, index) => {
      return star;
    });
  }

  starSelectedInPosition(position) {
    const { onFinishRating } = this.props;
    onFinishRating(position);
    this.setState({ position: position });
  }

  render() {
    const { position } = this.state;
    const { count, reviews, showRating } = this.props;
    const rating_array = [];
    _.times(count, (index) => {
      rating_array.push(
        <Star
          key={index}
          position={index + 1}
          starSelectedInPosition={this.starSelectedInPosition.bind(this)}
          fill={position >= index + 1}
          {...this.props}
        />
      );
    });

    return (
      <View style={Styles.ratingContainer}>
        {showRating && (
          <Text style={Styles.reviewText}>{reviews[position - 1]}</Text>
        )}
        <View style={Styles.starContainer}>
          {this.renderStars(rating_array)}
        </View>
      </View>
    );
  }
}
