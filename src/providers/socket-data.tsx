import { Constants } from "../config/constants";
import React, {
    createContext,
    PropsWithChildren,
    useEffect,
    useRef,
    useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { AppState } from "react-native";
import messaging from "@react-native-firebase/messaging";
import { Globals } from "config/globals";

export enum AppStates {
    FOREGROUND,
    BACKGROUND,
}

export enum SocketAction {
    NEW_FCM_KEY = "NEW_FCM_KEY",
    REQUEST_BADGE_COUNT = "REQUEST_BADGE_COUNT",
    NEW_MESSAGE_FROM_BUSINESS = "NEW_MESSAGE_FROM_BUSINESS",
    NEW_MESSAGE_FROM_CLIENT = "NEW_MESSAGE_FROM_CLIENT",
    MARK_CLIENT_MESSAGES_READ = "MARK_CLIENT_MESSAGES_READ",
    MARK_BUSINESS_MESSAGES_READ = "MARK_BUSINESS_MESSAGES_READ",

    APP_BACKGROUNDED = "APP_BACKGROUNDED",
    APP_FOREGROUNDED = "APP_FOREGROUNDED",
}

interface SocketDataContextShape {
    chatBadges: number;
    socket?: Socket;
    appState?: AppStates;
    reconnectSocket?: () => void;
}

export const SocketDataContext = createContext<SocketDataContextShape>({
    chatBadges: 0,
});

export const SocketDataProvider = ({ children }: PropsWithChildren<{}>) => {
    const [badgeCount, setBadgeCount] = useState(0);
    const userId = Globals.userNo.toString();
    const socket = useRef(
        io(Constants.Backend_Server_Address, {
            query: {
                "X-User-ID": userId,
            },
        })
    );
    const [appState, setAppState] = useState<AppStates>(AppStates.FOREGROUND);

    const reconnectSocket = (): void => {
        socket.current = io(Constants.Backend_Server_Address, {
            query: {
                "X-User-ID": userId,
            },
        });
    };

    useEffect(() => {
        const possibleSocket = socket.current;

        possibleSocket?.on("badge-count", (data: number) =>
            setBadgeCount(data)
        );

        (async () => {
            await messaging().registerDeviceForRemoteMessages();
            try {
                const FCMKey = await messaging().getToken();
                console.log("FCM key is", FCMKey);

                possibleSocket?.emit(
                    "ClientMessage",
                    JSON.stringify({
                        action: SocketAction.NEW_FCM_KEY,

                        fcmKey: FCMKey,
                        userId,
                    })
                );
            } catch {}
        })();

        AppState.addEventListener("change", async (state) => {
            try {
                const FCMKey = await messaging().getToken();
                possibleSocket.emit(
                    "ClientMessage",
                    JSON.stringify({
                        action:
                            state === "active"
                                ? SocketAction.APP_FOREGROUNDED
                                : SocketAction.APP_BACKGROUNDED,
                        fcmKey: FCMKey,
                        userId,
                    })
                );
                setAppState(
                    state === "active"
                        ? AppStates.FOREGROUND
                        : AppStates.BACKGROUND
                );
            } catch {}
        });
    }, [socket.current, userId]);

    if (socket.current?.connected) socket.current?.connect();

    return (
        <SocketDataContext.Provider
            value={{
                chatBadges: badgeCount,
                socket: socket.current,
                appState,
                reconnectSocket,
            }}
        >
            {children}
        </SocketDataContext.Provider>
    );
};
export const SocketDataConsumer = SocketDataContext.Consumer;

