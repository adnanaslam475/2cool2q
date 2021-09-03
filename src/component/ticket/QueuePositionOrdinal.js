import React from "react";
import { Text, View } from "react-native";
import Styles from "../../styles/components/queuePositionOrdinal";

/*  <QueuePositionOrdinal positionNo = {slotInfo.current_position} nFontColour= {BaseColor.blackColor} nFontSize={18} nFontWeight = {"600"}></QueuePositionOrdinal>
 */

const QueuePositionOrdinal = ({
  positionNo,
  clientStatus,
  nFontColour,
  nFontSize,
  nFontWeight,
}) => {
  /* Calculate last number in position for sequence st, nd, rd and th */

  var indicator = require("ordinal/indicator");
  var ordinal = indicator(positionNo);

  return (
    <View style={Styles.container}>
      <Text
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          flex: 1,
          color: nFontColour,
          fontWeight: nFontWeight,
          fontSize: nFontSize,
          textAlign: "center",
        }}
      >
        {/* Ticket position number */ positionNo != 0 ? "" + positionNo : ""}
        {
          /* Number sequence */
          positionNo == 0 && (clientStatus == undefined || clientStatus == 4)
            ? "You're in"
            : "" + ordinal
        }
      </Text>
    </View>
  );
};

QueuePositionOrdinal.defaultProps = {
  positionNo: 0,
  nFontSize: 0,
  nFontcolour: 0,
  nFontWeight: 0,
};

export default QueuePositionOrdinal;
