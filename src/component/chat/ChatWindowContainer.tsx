import React, { createContext, PropsWithChildren, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Message } from "./types";

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
});

type ContextShape = [
  Message[],
  React.Dispatch<React.SetStateAction<Message[]>>
];

export const ChatContext = createContext<ContextShape>([[], () => undefined]);
export const ChatContextProvider = ChatContext.Provider;
export const ChatContextConsumer = ChatContext.Consumer;

export function ChatWindowContainer({
  queueId,
  children,
}: PropsWithChildren<{ queueId: string }>): JSX.Element {
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <ChatContextProvider value={[messages, setMessages]}>
      <View style={styles.container}>{children}</View>
    </ChatContextProvider>
  );
}
