import { BaseColor } from "../../common/color";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { Constants } from "../../config/constants";
import RNFetchBlob from "rn-fetch-blob";
import { PresetMessage } from "./types";
import { FlatList } from "react-native-gesture-handler";
import { Icon } from "native-base";
import { Socket } from "socket.io-client";
import { Globals } from "config/globals";

interface ChatInputProps {
    queueId: number;
    socket?: Socket;
}

const styles = StyleSheet.create({
    container: {
        borderTopColor: BaseColor.lightGrey,
        borderTopWidth: 2,
        marginTop: 10,
        display: "flex",
        flexDirection: "row",
    },

    dropdown: {
        width: "85%",
        left: "2.5%",
        padding: 10,
        borderColor: BaseColor.primaryBlueColor,
        borderWidth: 1,
    },

    dropdownItem: {
        //borderBottomColor: BaseColor.lightGrey,
        //borderBottomWidth: 1,
        paddingVertical: 6,
        width: "90%",
    },
    dropdownText: {
        color: BaseColor.grayColor,
    },
    sendButton: {
        backgroundColor: BaseColor.primaryBlueColor,
        width: 50,
        height: 50,
        borderRadius: 25,
        display: "flex",
        alignContent: "center",
        justifyContent: "center",
    },
    sendIcon: {
        alignContent: "center",
        justifyContent: "center",
        color: "#FFFFFF",
    },
});

const DEFAULT_TEXT = "Select message ... ";

export function ChatInput({ queueId, socket }: ChatInputProps): JSX.Element {
    const [textInputValue, setTextInputValue] = useState(DEFAULT_TEXT);
    const [availableMessages, setAvailableMessages] = useState<PresetMessage[]>(
        []
    );
    const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
        null
    );
    const [showMessages, setShowMessages] = useState(false);

    useEffect(() => {
        (async () => {
            const url =
                Globals.selectedBusiness.type === "book"
                    ? `${Constants.Backend_Server_Address}/chat/${queueId}/available-messages/booking`
                    : `${Constants.Backend_Server_Address}/chat/${queueId}/available-messages`;

            const reply = await RNFetchBlob.fetch("GET", url, {
                "Content-Type": "application/json",
            });

            setAvailableMessages(reply.json());
        })();
    }, [queueId]);
    /* List of Messages to send */
    const list = showMessages ? (
        <FlatList
            data={availableMessages}
            keyExtractor={(item) => item.MSGNOT_ID}
            renderItem={({ item }) => (
                <Pressable
                    onPress={() => {
                        setTextInputValue(item.MSGNOT_message);
                        setSelectedMessageId(item.MSGNOT_ID);
                        setShowMessages(false);
                    }}
                >
                    <View key={item.MSGNOT_ID} style={styles.dropdownItem}>
                        <Text style={styles.dropdownText}>
                            {item.MSGNOT_message}
                        </Text>
                    </View>
                </Pressable>
            )}
        />
    ) : null;

    return (
        /****** Chat messages dropdown *****/
        <View style={styles.container}>
            <View style={styles.dropdown}>
                {list}
                <Pressable onPress={() => setShowMessages(!showMessages)}>
                    <View style={styles.dropdownItem}>
                        <Text
                            style={StyleSheet.flatten([
                                styles.dropdownText,
                                { color: "black" },
                            ])}
                        >
                            {textInputValue}
                        </Text>
                    </View>
                </Pressable>
            </View>
            {/* paper-plane send button */}
            <Pressable
                style={StyleSheet.flatten([
                    styles.sendButton,
                    {
                        backgroundColor:
                            textInputValue === DEFAULT_TEXT ||
                            textInputValue === ""
                                ? BaseColor.darkGrey
                                : BaseColor.primaryBlueColor,
                    },
                ])}
                onPress={() => {
                    if (
                        textInputValue === DEFAULT_TEXT ||
                        textInputValue === ""
                    )
                        return null;

                    // Do the work.
                    setTextInputValue(DEFAULT_TEXT);
                    setShowMessages(false);

                    // Send the message.
                    socket?.emit(
                        "ClientMessage",
                        JSON.stringify({
                            queueId,
                            action: "NEW_MESSAGE_FROM_CLIENT",
                            type: Globals.selectedBusiness.type,
                            messageId: selectedMessageId,
                            message: textInputValue,
                            fromUser: Globals.userNo,
                        })
                    );
                }}
            >
                <Icon
                    type="SimpleLineIcons"
                    name="paper-plane"
                    style={styles.sendIcon}
                />
            </Pressable>
        </View>
    );
}
