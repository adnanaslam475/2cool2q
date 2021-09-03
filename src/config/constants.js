export const Constants = {
  //Backend_Server_Address: "http://160.153.254.238:8001",
  //Websocket_Server_Address: "ws://160.153.254.238:8001",
  //Backend_Server_Address: "http://192.168.1.86:8001",
  //Websocket_Server_Address: "ws://192.168.1.86:8001",
  // Backend_Server_Address: "http://192.168.1.203:8001",
  // Websocket_Server_Address: "ws://192.168.1.203:8001",
  //Backend_Server_Address: "https://blue-monkey-86.loca.lt",
  //Websocket_Server_Address: "wss://calm-insect-31.loca.lt",
  // "https://2cool2q.app:8001"
  // http://192.168.1.103:5000

  Backend_Server_Address: "https://2cool2q.app:8001",
  // Backend_Server_Address_local:'http://192.168.1.106:5000',
  Websocket_Server_Address: "ws://2cool2q.app:8001",

  TAB_ACTIVITY_PAGE: 1,
  TAB_SEARCH_PAGE: 2,
  TAB_QR_PAGE: 3,
  TAB_FAVORITE_PAGE: 4,
  AVAILABILITY: 5,
  SETTING: 6,

  DEPARTMENT: 7,
  CHECKIN_ME: 8,
  QUEUE_ME: 9,
  BOOK_ME: 10,

  CHECK_IN_TICKET: 11,
  QUEUE_TICKET: 12,
  BOOK_TICKET: 13,
  MENU_ONLY: 14,

  MAX_NUMBER_ITEMS_TO_ORDER: 20, // QuantityCounter setting for items in menu
  MIN_NUMBER_OF_PEOPLE: 1, // QuantityCounter setting when counting people

  DEPARTMENT_TYPE: {
    CHECK_IN: "1",
    MENU_ONLY: "2",
    VIRTUAL_QUEUE: "3",
    BOOKING: "4",
    GROUPS: "5",
  },

  PASSWORD_VALIDATION: [
    "be at least 6 characters long",
    "include at least one upper and one lower case letter",
    "include at least one number",
    // "Recommended: ",
    // "8 characters long;",
    // "include at least one upper and one lower case letter;",
    // "include atleast one number;",
    // "include atleast one character (e.g. !@]#?_-)",
  ],
  
  USERID_VALIDATION: [
    "be at least 6 characters long",
    "no spaces allowed",
    "can include characters like _ . - but not more than 3",
    "can include numbers",
  ],
};
