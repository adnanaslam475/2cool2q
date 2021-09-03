import React from "react";
import { Text, View } from "react-native";
import Styles from "../../styles/components/queuePositionOrdinal";

/*  <MinsToHoursRangeConverter minutes = {waiting_time} nFontColour= {BaseColor.blackColor} nFontSize={18} nFontWeight = {"600"}></QueuePositionOrdinal>
 */


const convertMinsToTime = (mins, position) => {

  let finalTime = (position === 1) ? `${mins}` : `${mins}min`;

  if (mins >= 60) {
    let hours = Math.floor(mins / 60);
    let minutes = mins % 60;
    minutes = (minutes < 10) ? '0' + minutes : minutes;
    finalTime = (minutes == 0 || minutes == '00') ? `${hours}h` : `${hours}h ${minutes}m`;
  }
  return finalTime;
}

const MinsToHoursRangeConverter = ({
  minutesFrom,
  minutesTo,
  nFontColour,
  nFontSize,
  nFontWeight,
}) => {
  let minFrom = convertMinsToTime(minutesFrom, 1) ;
  let minTo = convertMinsToTime(minutesTo, 2);
  
  return (
    <View >
      <Text style={{
      // flex: 1,
      color: nFontColour,
      fontWeight: nFontWeight,
      fontSize: 
        (minFrom.length + minTo.length + 3 < 12) 
        ? nFontSize
        : 14,
      textAlign: "left",
    }}>
        {minFrom}
        {" - "}
        {minTo}
      </Text>
    </View>
  );
};

MinsToHoursRangeConverter.defaultProps = {
  minutesFrom: 0,
  minutesTo: 0,
  nFontSize: 0,
  nFontcolour: 0,
  nFontWeight: 0,
};

export default MinsToHoursRangeConverter;
