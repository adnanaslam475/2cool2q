import React from "react";
import { Text, View } from "react-native";
import Styles from "../../styles/components/queuePositionOrdinal";

/*  <MinsToHoursConverter minutes = {waiting_time} nFontColour= {BaseColor.blackColor} nFontSize={18} nFontWeight = {"600"}></QueuePositionOrdinal>
 */

const convertMinsToTime = (mins) => {

  let finalTime = mins + "m";
  if (mins > 60) {
    let hours = Math.floor(mins / 60);
    let minutes = mins % 60;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    finalTime = (minutes == 0 || minutes == '00') ? `${hours}h` : `${hours}h ${minutes}m`;
  }
  return finalTime;
}

const MinsToHoursConverter = ({
  minutes,
  nFontColour,
  nFontSize,
  nFontWeight,
}) => {

  return (
    <View style={{
      flex: 1,
      color: nFontColour,
      fontWeight: nFontWeight,
      fontSize: nFontSize,
      textAlign: "left",
    }}>
      <Text>
        {/* Convert to hours */}
        {convertMinsToTime(minutes)}
      </Text>
    </View>
  );
};

MinsToHoursConverter.defaultProps = {
  minutes: 0,
  nFontSize: 0,
  nFontcolour: 0,
  nFontWeight: 0,
};

export default MinsToHoursConverter;
