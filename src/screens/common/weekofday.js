import React from "react";
import { View, Text } from "react-native";
import common_styles from "../../common/style";

export const WeekofdayView = ({ item, weekofday, type, order }) => {
  return (
    <View>
      {item.from != null && item.to != null && (
        <View style={{ flexDirection: "row" }}>
          <Text
            style={[
              common_styles.open_time_header,
              { fontWeight: weekofday == type ? "700" : "400" },
            ]}
          >
            {order == 0 ? type : ""}
          </Text>
          <Text
            style={[
              common_styles.open_time,
              { fontWeight: weekofday == type ? "700" : "400" },
            ]}
          >
            {item.from + "-" + item.to}
          </Text>
        </View>
      )}
      {(item.from == null || item.to == null) && order == 0 && (
        <View style={{ flexDirection: "row" }}>
          <Text
            style={[
              common_styles.open_time_header,
              { fontWeight: weekofday == type ? "700" : "400" },
            ]}
          >
            {order == 0 ? type : ""}
          </Text>
          <Text
            style={[
              common_styles.open_time,
              { fontWeight: weekofday == type ? "700" : "400" },
            ]}
          >
            Closed
          </Text>
        </View>
      )}
    </View>
  );
};
