import { BaseColor } from "common/color";
import styles from "common/style";
import React, { useRef } from "react";
import { TouchableOpacity, View, Dimensions, Image, Text } from "react-native";
import { BoxShadow } from "react-native-shadow";
type Props = {
    item: any;
    index: number;
    openList: () => void;
    _businesslength: number;
};

const BusinessCard = (props: Props) => {
    const { item, index, openList, _businesslength } = props;

    return (
        <TouchableOpacity onPress={() => openList()}>
            <View>
                <BoxShadow
                    setting={{
                        width: Dimensions.get("window").width - 22, //- 22
                        height: 120,
                        color: "#000",
                        border: 3,
                        radius: 3,
                        opacity: 0.1,
                        x: 0,
                        y: 4,
                        style: { marginVertical: 5 },
                    }}
                >
                    <View style={styles.card_bg}>
                        {
                            <Image
                                style={styles.itemImg}
                                source={{ uri: item.business.photo }}
                                resizeMode="stretch"
                            />
                        }
                        <View style={styles.cardContainer}>
                            <View>
                                <Text style={styles.itemTitle}>
                                    {item.business.name}
                                </Text>
                                <Text
                                    style={[
                                        styles.itemDescription,
                                        { marginTop: 7 },
                                    ]}
                                >
                                    {item.business.address}
                                </Text>
                                <Text
                                    style={[
                                        styles.itemDescription,
                                        { marginTop: 0 },
                                    ]}
                                >
                                    {item.business.postcode}
                                </Text>
                                <View style={styles.businessBottom}>
                                    <View style={styles.starContainer}>
                                        <Text
                                            style={[
                                                styles.itemStarText,
                                                { marginRight: 2 },
                                            ]}
                                        >
                                            {" "}
                                            {item.business.star != null
                                                ? item.business.star.toFixed(1)
                                                : "0.0"}{" "}
                                        </Text>
                                        <Image
                                            style={styles.itemIcon}
                                            source={require("../../assets/star.png")}
                                            resizeMode="stretch"
                                        />
                                    </View>

                                    <Text
                                        style={[
                                            styles.itemTimeText,
                                            { marginLeft: 30, marginRight: 15 },
                                        ]}
                                    >
                                        {" "}
                                        {item.business.Distance != null
                                            ? item.business.Distance.toFixed(2)
                                            : "0.00"}{" "}
                                        km{" "}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={{ marginRight: 10 }}>
                            <Image
                                //source={require("../../assets/icon_start.png")}
                                resizeMode="stretch"
                            />
                        </View>
                    </View>
                </BoxShadow>

                {_businesslength * 120 <
                    Dimensions.get("window").height - 120 &&
                    index == _businesslength - 1 && (
                        <View
                            style={{
                                height:
                                    Dimensions.get("window").height -
                                    _businesslength * 120 -
                                    120,
                                backgroundColor: BaseColor.mainBackground,
                                alignItems: "center",
                            }}
                        />
                    )}
            </View>
        </TouchableOpacity>
    );
};

export default BusinessCard;
