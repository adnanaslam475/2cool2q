import React, { useContext, useEffect, useRef, useState } from "react";
import messaging from "@react-native-firebase/messaging";
import {
    FlatList,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import { ChatBubble, ChatBubbleDirection } from "./Bubble";
import { Constants } from "../../config/constants";
import RNFetchBlob from "rn-fetch-blob";
import { Message } from "./types";
import { ChatInput } from "./ChatInput";
import { SocketAction, SocketDataContext } from "../../providers/socket-data";
import { Text } from "native-base";
import { Globals } from "config/globals";

interface ChatWindowProps {
    queueId: number;
}

const styles = StyleSheet.create({
    chatView: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxHeight: "80%",
        padding: 10,
    },
    messageListContainer: {
        width: "100%",
        height: "100%",
    },
    messageList: {
        width: "100%",
    },
});

export function ChatWindow(props: ChatWindowProps): JSX.Element | null {
    const { socket: ws } = useContext(SocketDataContext);
    const [messages, setMessages] = useState<Message[]>([]);
    const scrollViewRef = useRef<ScrollView | null>(null);

    useEffect(() => {
        (async () => {
            try {
              const FCMKey = await messaging().getToken();
              ws?.emit(
                  "ClientMessage",
                  JSON.stringify({
                      action: SocketAction.NEW_FCM_KEY,
                      fcmKey: FCMKey,
                      userId: Globals.userNo,
                  })
              );
          } catch {}
        })()
        const handler = (rawMessage: string) => {
            try {
                const message = JSON.parse(rawMessage);

                switch (message.action) {
                    case SocketAction.NEW_MESSAGE_FROM_CLIENT:
                    case SocketAction.NEW_MESSAGE_FROM_BUSINESS:
                        setMessages((currentMessages) => [
                            ...currentMessages,
                            message.message,
                        ]);
                }
            } catch {}
        };
        ws?.on("ServerMessage", handler);

        return () => {
            ws?.off("ServerMessage", handler);
        };
    }, [ws]);

    useEffect(() => {
        (async () => {
            const url =
                Globals.selectedBusiness.type === "book"
                    ? `${Constants.Backend_Server_Address}/chat/${props.queueId}/booking`
                    : `${Constants.Backend_Server_Address}/chat/${props.queueId}`;
            // Get the current state of the chat
            const reply = await RNFetchBlob.fetch("GET", url, {
                "Content-Type": "application/json",
            });

            setMessages(reply.json());
        })();
    }, [props.queueId]);

    /********** Chat content *********/
    return (
        <View style={styles.chatView}>
            <ScrollView
                style={styles.messageListContainer}
                ref={scrollViewRef}
                onContentSizeChange={() => scrollViewRef.current?.scrollToEnd()}
            >
                <FlatList
                    style={styles.messageList}
                    data={messages}
                    keyExtractor={(item, index) => item.MSGNOT_ID + "_" + index}
                    renderItem={({ item }): JSX.Element => {
                        return (
                            <ChatBubble
                                key={item.MSGNOT_ID}
                                text={item.MSGNOT_message}
                                direction={
                                    item.QCONV_from_business != undefined
                                        ? item.QCONV_from_business
                                            ? ChatBubbleDirection.Left
                                            : ChatBubbleDirection.Right
                                        : item.ACONV_from_business
                                        ? ChatBubbleDirection.Left
                                        : ChatBubbleDirection.Right
                                }
                                timestamp={item.QCONV_created_on}
                            />
                        );
                    }}
                />
            </ScrollView>
            <ChatInput queueId={props.queueId} socket={ws} />
            {/* REMOVE THIS, THIS IS FOR TESTING ONLY. */}
            {/*
            <Pressable
                style={{
                    backgroundColor: "green",
                    borderRadius: 5,
                    padding: 10,
                    margin: 10,
                }}
                onPress={() => {
                    console.log("Globals", Globals);
                    ws?.emit(
                        "ClientMessage",
                        JSON.stringify({
                            action: "NEW_MESSAGE_FROM_BUSINESS",
                            queueId: props.queueId,
                            targetUser: Globals.userNo,
                            messageId:
                                Globals.selectedBusiness.type === "book"
                                    ? 31
                                    : 13,
                            type: Globals.selectedBusiness.type,
                            message:
                                Globals.selectedBusiness.type === "book"
                                    ? "Test message from Business to Client booked"
                                    : "Test message from Business to Client queuing",
                        })
                    );
                }}
            >
                <Text style={{ color: "white" }}>
                    Press me to send a business message, remove me. This is for
                    testing only.
                </Text>
            </Pressable>
            */}
        </View>
    );
}
