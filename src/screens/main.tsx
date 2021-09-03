import React, { useState, useEffect, useRef, useContext } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Share,
    BackHandler,
    Linking,
} from "react-native";
import { StatusBar } from "react-native";
import styles from "../common/style";
import { Globals } from "../config/globals";
import { Constants } from "../config/constants";
import { BaseColor } from "../common/color";
import Drawer from "react-native-drawer";
import Sidebar from "../component/sidebar";
import Overlay from "../component/overlay";
import Modal from "react-native-modal";
import ActivityView from "./tab/activity";
import SearchView from "./tab/search";
import QrView from "./tab/qr";
import FavView from "./tab/favourite";
import { AvailabilityView } from "./tab/availability/availability";
import SettingView from "./user/setting";
import { CallApi } from "../service/business";
import DefaultPreference from "react-native-default-preference";
import Toast from "react-native-simple-toast";
import { ChatWindow } from "../component/chat/ChatWindow";
import { SocketDataContext } from "../providers/socket-data";

var CurrentTab = Constants.TAB_SEARCH_PAGE;
var PreviousTab = 0;

export default function MainScreen(props) {
    const { socket } = useContext(SocketDataContext);
    const [tab, setTab] = useState(Constants.TAB_SEARCH_PAGE);
    const [business, setBusiness] = useState(null);
    const [isMask, setMask] = useState(false);
    const [isInfoDialog, setInfoDialog] = useState(false);
    const [isCheckOut, setCheckOut] = useState(false);
    const [iInfo, setIndicator] = useState({ isActive: false, msg: "" });
    const [errInfo, setError] = useState({ isActive: false, msg: "" });
    const [notification, setNotification] = useState(0);

    const [modalInfo, setModalInfo] = useState({});
    const availabilityRef = useRef();
    const _drawer = useRef();

    const backAction = () => {
     
        if (Globals.isBookChange) {
            Globals.isBookChange = false;
            if (
                availabilityRef != undefined &&
                availabilityRef.current != null
            ) {
                availabilityRef.current.changeAvailabilityPage(
                    Constants.BOOK_TICKET
                );
            }
        } else {
            Globals.isBackClicked = true;
            changeContentPage(Constants.TAB_SEARCH_PAGE);
        }

        return true;
    };

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", backAction);
        return () =>
            BackHandler.removeEventListener("hardwareBackPress", backAction);
    }, []);

    goBack = () => {
        Globals.isBackClicked = true;
        props.navigation.goBack();
    };

    openMenu = () => {
        _drawer.current?.open();
        setMask(true);
    };

    changeContentPage = (type) => {
        Globals.isBookChange = false;

        if (availabilityRef != undefined && availabilityRef.current != null) {
            availabilityRef.current.killIntervals();
        }

        PreviousTab = CurrentTab;

        if (Globals.isBackClicked) {
            Globals.isBackClicked = false;
            var index = Globals.previousPageStack.length;
            if (index > 0) {
                setTab(Globals.previousPageStack[index - 1]);
                CurrentTab = Globals.previousPageStack[index - 1];
                Globals.previousPageStack.splice(index - 1, 1);
            } else {
                setTab(type);
                if (CurrentTab == type && type == Constants.TAB_SEARCH_PAGE) {
                }
                CurrentTab = type;
            }
        } else {
            Globals.previousPageStack = [
                ...Globals.previousPageStack,
                CurrentTab,
            ];
            setTab(type);
            CurrentTab = type;
        }
    };
    changeBusiness = (business) => {
        setBusiness(business);
    };

    getBusiness = () => {
        return business;
    };

    openMenuPage = () => {
        props.navigation.navigate("Menu");
    };

    openFeedback = () => {
        props.navigation.navigate("Feedback");
    };

    setNotificationVal = (not) => {
        setNotification(not);
    };

    logout = () => {
        Globals.userNo = "0";
        props.navigation.navigate("Login");
    };

    callCloseBook = () => {
        DefaultPreference.getMultiple(["cprofile_id"])
            .then(function (values) {
                if (values[0] != null) {
                    let par = {
                        cprofile_id: 0,
                        slot_id: Globals.selectedSlotId,
                        peep: 0,
                    };
                    CallApi(par, "closebook")
                        .then((res) => {
                            if (res.status == 200) {
                                changeContentPage(Constants.TAB_ACTIVITY_PAGE);
                            } else if (res.status === 300 || res.status === 400) {
                                Toast.show(res.msg, Toast.SHORT, [
                                    "UIAlertController",
                                ]);
                            } else {
                                Toast.show(res.msg, Toast.SHORT, ["UIAlertController"]);
                            }
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                }
            })
            .catch((err) => { });
    };

    leaveQueue = () => {
        // create leave api in queue
        DefaultPreference.getMultiple(["cprofile_id"])
            .then(function (values) {
                if (values[0] != null) {
                    let par = {
                        slot_id: Globals.selectedSlotId,
                    };
                    CallApi(par, "closequeue")
                        .then((res) => {
                            if (res.status == 200) {
                                changeContentPage(Constants.TAB_ACTIVITY_PAGE);
                            } else if (res.status === 300 || res.status === 400) {
                                Toast.show(res.msg, Toast.SHORT, [
                                    "UIAlertController",
                                ]);
                            } else {
                                Toast.show(res.msg, Toast.SHORT, [
                                    "UIAlertController",
                                ]);
                            }
                            //
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                }
            })
            .catch((err) => { });
    };

    checkOut = () => {
        // create checkout api in checkin
        DefaultPreference.getMultiple(["cprofile_id"])
            .then(function (values) {
                if (values[0] != null) {
                    let par = {
                        slot_id: Globals.selectedSlotId,
                    };
                    CallApi(par, "closecheckin")
                        .then((res) => {
                            if (res.status == 200) {
                                changeContentPage(Constants.TAB_ACTIVITY_PAGE);
                            } else if (res.status === 300 || res.status === 400) {
                                Toast.show(res.msg, Toast.SHORT, [
                                    "UIAlertController",
                                ]);
                            } else {
                                Toast.show(res.msg, Toast.SHORT, ["UIAlertController"]);
                            }
                            //
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                }
            })
            .catch((err) => { });
    };

    renderTabBody = () => {
        if (tab == Constants.TAB_ACTIVITY_PAGE) {
            return <ActivityView {...this} />;
        } else if (tab == Constants.TAB_SEARCH_PAGE) {
            return <SearchView {...this} />;
        } else if (tab == Constants.TAB_QR_PAGE) {
            return <QrView {...this} />;
        } else if (tab == Constants.TAB_FAVORITE_PAGE) {
            return <FavView {...this} />;
        } else if (tab == Constants.AVAILABILITY) {
            return <AvailabilityView {...this} ref={availabilityRef} />;
            //adnan changes
        } else if (tab == Constants.SETTING) {
            return <SettingView {...this} />;
        }
    };

    menuClicked = (index) => {
        if (availabilityRef != undefined && availabilityRef.current != null) {
            availabilityRef.current.killIntervals();
        }

        switch (index) {
            case 0: //home
                PreviousTab = CurrentTab;
                setTab(Constants.TAB_SEARCH_PAGE); // second tab
                CurrentTab = Constants.TAB_SEARCH_PAGE;
                break;
            case 1: //Privacy-Policy
                Linking.openURL("https://2cool2q.com/privacy-policy");
                break;
            case 2:
                Linking.openURL("https://2cool2q.com");
                break;
            case 3:
                PreviousTab = CurrentTab;
                setTab(Constants.SETTING);
                CurrentTab = Constants.SETTING;
                break;
            case 4: // logout
                Globals.userNo = "0";
                props.navigation.navigate("Login");
                break;
            default:
        }

        _drawer.current?.close();
        setMask(false);
    };

    onShare = async () => {
        try {
            const result = await Share.share({
                message:
                    "React Native | A framework for building native apps using React",
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) { }
    };

    showInfoDialog = async () => {
        setInfoDialog(true);
    };

    showCheckOut = async (modalInfo) => {
        setCheckOut(true);
        setModalInfo(modalInfo);
    };

    const chatWindow = Globals.selectedBusiness ? (
        <ChatWindow queueId={Globals.selectedSlotId} />
    ) : null;

    useEffect(() => {
        if (chatWindow) {
            socket?.emit(
                "message",
                JSON.stringify({ action: "MARK_CLIENT_MESSAGES_READ" })
            );
        }
    });

    return (
        <Drawer
            onClose={() => setMask(false)}
            ref={_drawer}
            tapToClose={true}
            openDrawerOffset={0.4} // 20% gap on the right side of drawer
            panCloseMask={0.2}
            content={<Sidebar onMenuClicked={(index) => menuClicked(index)} />}
            side="right"
            type="overlay"
        >
            <View style={styles.primaryFullBG}>
                <StatusBar hidden={true} />
                {iInfo.isActive == true && (
                    <View style={styles.loading}>
                        <View style={styles.loaderView}>
                            <ActivityIndicator
                                color="#d84c41"
                                style={styles.activityIndicator}
                            />
                            <Text style={styles.loadingText}>{iInfo.msg}</Text>
                        </View>
                    </View>
                )}

                <View style={{ flex: 1 }}>{renderTabBody()}</View>

                <View style={styles.bottomTab}>
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={() => {
                            Globals.selectedDepartment = {};
                            changeContentPage(Constants.TAB_SEARCH_PAGE);
                        }}
                    >
                        <View
                            style={[
                                styles.tabButton,
                                {
                                    backgroundColor:
                                        tab == Constants.TAB_SEARCH_PAGE ||
                                            tab == Constants.AVAILABILITY ||
                                            tab == Constants.CHECKIN ||
                                            tab == Constants.QUEUE ||
                                            tab == Constants.BOOK
                                            ? BaseColor.primaryBlueColor
                                            : BaseColor.whiteColor,
                                },
                            ]}
                        >
                            <Image
                                source={
                                    tab == Constants.TAB_SEARCH_PAGE ||
                                        tab == Constants.AVAILABILITY ||
                                        tab == Constants.CHECKIN ||
                                        tab == Constants.QUEUE ||
                                        tab == Constants.BOOK
                                        ? require("../assets/icon_2_e.png")
                                        : require("../assets/icon_2.png")
                                }
                                resizeMode="contain"
                                style={styles.imgTabIcon30}
                            />
                            <Text
                                style={
                                    tab == Constants.TAB_SEARCH_PAGE ||
                                        tab == Constants.AVAILABILITY ||
                                        tab == Constants.CHECKIN ||
                                        tab == Constants.QUEUE ||
                                        tab == Constants.BOOK
                                        ? styles.tabTextActive
                                        : styles.tabText
                                }
                            >
                                Search
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={() => {
                            Globals.selectedDepartment = {};
                            changeContentPage(Constants.TAB_ACTIVITY_PAGE);
                        }}
                    >
                        <View
                            style={[
                                styles.tabButton,
                                {
                                    backgroundColor:
                                        tab == Constants.TAB_ACTIVITY_PAGE
                                            ? BaseColor.primaryBlueColor
                                            : BaseColor.whiteColor,
                                },
                            ]}
                        >
                            <Image
                                source={
                                    tab == Constants.TAB_ACTIVITY_PAGE
                                        ? require("../assets/icon_1_e.png")
                                        : require("../assets/icon_1.png")
                                }
                                resizeMode="contain"
                                style={styles.imgTabIcon30}
                            />
                            <Text
                                style={
                                    tab == Constants.TAB_ACTIVITY_PAGE
                                        ? styles.tabTextActive
                                        : styles.tabText
                                }
                            >
                                Activities
                            </Text>
                            {notification > 0 && (
                                <View
                                    style={[
                                        styles.notification,
                                        {
                                            position: "absolute",
                                            top: 15,
                                            right: 25,
                                            justifyContent: "center",
                                            alignContent: "center",
                                            alignSelf: "center",
                                        },
                                    ]}
                                >
                                    <Text
                                        style={{ color: BaseColor.whiteColor }}
                                    >
                                        {notification}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={() => {
                            Globals.selectedDepartment = {};
                            changeContentPage(Constants.TAB_QR_PAGE);
                        }}
                    >
                        <View
                            style={[
                                styles.tabButton,
                                {
                                    backgroundColor:
                                        tab == Constants.TAB_QR_PAGE
                                            ? BaseColor.primaryBlueColor
                                            : BaseColor.whiteColor,
                                },
                            ]}
                        >
                            <Image
                                source={
                                    tab == Constants.TAB_QR_PAGE
                                        ? require("../assets/icon_3_e.png")
                                        : require("../assets/icon_3.png")
                                }
                                resizeMode="contain"
                                style={styles.imgTabIcon30}
                            />
                            <Text
                                style={
                                    tab == Constants.TAB_QR_PAGE
                                        ? styles.tabTextActive
                                        : styles.tabText
                                }
                            >
                                QR
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={() => {
                            Globals.selectedDepartment = {};
                            changeContentPage(Constants.TAB_FAVORITE_PAGE);
                        }}
                    >
                        <View
                            style={[
                                styles.tabButton,
                                {
                                    backgroundColor:
                                        tab == Constants.TAB_FAVORITE_PAGE
                                            ? BaseColor.primaryBlueColor
                                            : BaseColor.whiteColor,
                                },
                            ]}
                        >
                            <Image
                                source={
                                    tab == Constants.TAB_FAVORITE_PAGE
                                        ? require("../assets/icon_4_e.png")
                                        : require("../assets/icon_4.png")
                                }
                                resizeMode="contain"
                                style={styles.imgTabIcon30}
                            />
                            <Text
                                style={
                                    tab == Constants.TAB_FAVORITE_PAGE
                                        ? styles.tabTextActive
                                        : styles.tabText
                                }
                            >
                                Favourites
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <Overlay isVisible={isMask} />

            <Modal backdropColor="#000" isVisible={errInfo.isActive}>
                <View
                    style={{
                        backgroundColor: BaseColor.whiteColor,
                        padding: 10,
                        borderRadius: 10,
                        alignItems: "center",
                    }}
                >
                    <View style={{ marginVertical: 0 }}>
                        <Text
                            style={{
                                color: "#FFF",
                                fontSize: 18,
                                textAlign: "center",
                                marginVertical: 20,
                            }}
                        >
                            {errInfo.msg}
                        </Text>
                        <TouchableOpacity
                            style={{ alignSelf: "center" }}
                            onPress={() =>
                                setError({ isActive: false, msg: "" })
                            }
                        >
                            <Text
                                style={{
                                    padding: 10,
                                    textAlign: "center",
                                    color: "#fff",
                                    fontWeight: "bold",
                                }}
                            >
                                {" "}
                                Dismiss{" "}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal
                style={{ margin: 10, borderRadius: 3 }}
                backdropColor="#000"
                isVisible={isInfoDialog}
            >
                <View
                    style={{
                        backgroundColor: BaseColor.whiteColor,
                        padding: 10,
                        borderRadius: 10,
                    }}
                >
                    <View style={{ marginVertical: 10, width: "100%" }}>
                        <Text
                            style={{
                                fontSize: 18,
                                color: BaseColor.primaryBlueColor,
                                marginLeft: 10,
                            }}
                        >
                            Info
                        </Text>

                        <TouchableOpacity
                            style={{
                                position: "absolute",
                                right: 0,
                                top: 0,
                                marginRight: 10,
                                marginTop: 2,
                            }}
                            onPress={() => {
                                setInfoDialog(false);
                            }}
                        >
                            <Image
                                style={{
                                    width: 25,
                                    height: 25,
                                }}
                                source={require("../assets/icon_dialog_close.png")}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    </View>
                    {chatWindow}
                </View>
            </Modal>

            {/* common close modal */}
            <Modal
                style={{ margin: 10, borderRadius: 3 }}
                backdropColor="#000"
                isVisible={isCheckOut}
            >
                <View
                    style={{
                        backgroundColor: BaseColor.whiteColor,
                        padding: 10,
                        borderRadius: 3,
                    }}
                >
                    <View
                        style={{
                            marginVertical: 0,
                            padding: 10,
                            width: "100%",
                            backgroundColor: BaseColor.whiteColor,
                        }}
                    >
                        <Text style={styles.dialog_title}>
                            {modalInfo.title}
                        </Text>

                        <Text
                            style={{
                                fontSize: 14,
                                textAlign: "center",
                                marginVertical: 20,
                            }}
                        >
                            {modalInfo.body}
                        </Text>

                        <View style={{ alignContent: "center" }}>
                            <View>
                                <TouchableOpacity
                                    style={{ marginTop: 20 }}
                                    onPress={() => {
                                        if (modalInfo.type == "booking") {
                                            callCloseBook();
                                            setCheckOut(false);
                                        } else if (modalInfo.type == "queue") {
                                            leaveQueue();
                                            setCheckOut(false);
                                        } else if (
                                            modalInfo.type == "checkin"
                                        ) {
                                            checkOut();
                                            setCheckOut(false);
                                        }
                                    }}
                                >
                                    <View style={styles.primaryBtn}>
                                        <Text style={styles.btnText}>
                                            {" "}
                                            {modalInfo.button}{" "}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            {/* <View style={{flex:1, marginLeft:20}}>
                                <TouchableOpacity style={{marginTop:20}} onPress={() => {setCheckOut(false)} }>
                                    <View style={[styles.primaryEmptyBtn]}>
                                        <Text style={[styles.btnTextEmpty]}>Back</Text>
                                    </View>
                                </TouchableOpacity>
                            </View> */}
                        </View>

                        <TouchableOpacity
                            style={{
                                position: "absolute",
                                right: 0,
                                top: 0,
                                margin: 10,
                            }}
                            onPress={() => {
                                setCheckOut(false);
                            }}
                        >
                            <Image
                                style={{
                                    width: 25,
                                    height: 25,
                                    marginBottom: 10,
                                }}
                                source={require("../assets/icon_dialog_close.png")}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </Drawer>
    );
}
