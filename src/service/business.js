import { Constants } from "../config/constants";
import RNFetchBlob from "rn-fetch-blob";

export function getBusinessListByName(params) {
  return new Promise(function (resolve, reject) {
    const body = JSON.stringify(params);
    RNFetchBlob.fetch(
      "POST",
      Constants.Backend_Server_Address + "/getBusinessListByName",
      {
        "Content-Type": "application/json",
      },
      body
    )
      .then((response) => {
        resolve(response.json());
      })
      .catch((errorMessage, statusCode) => {
        console.log(errorMessage);
        reject(errorMessage);
      });
  });
}

export function getBusinessListByFilter(params) {
  return new Promise(function (resolve, reject) {
    const body = JSON.stringify(params);
    RNFetchBlob.fetch(
      "POST",
      Constants.Backend_Server_Address + "/getBusinessListByFilter",
      {
        "Content-Type": "application/json",
      },
      body
    )
      .then((response) => {
        resolve(response.json());
      })
      .catch((errorMessage, statusCode) => {
        console.log(errorMessage);
        reject(errorMessage);
      });
  });
}

export function openTime(params) {
  // console.log("=========== opentime call service PARAMS = ", params);
  return new Promise(function (resolve, reject) {
    const body = JSON.stringify(params);
    RNFetchBlob.fetch(
      "POST",
      Constants.Backend_Server_Address + "/opentime",
      {
        "Content-Type": "application/json",
      },
      body
    )
      .then((response) => {
        resolve(response.json());
      })
      .catch((errorMessage, statusCode) => {
        console.log(errorMessage);
        reject(errorMessage);
      });
  });
}

export function getMenus(params) {
  return new Promise(function (resolve, reject) {
    const body = JSON.stringify(params);
    RNFetchBlob.fetch(
      "POST",
      Constants.Backend_Server_Address + "/menus",
      {
        "Content-Type": "application/json",
      },
      body
    )
      .then((response) => {
        resolve(response.json());
      })
      .catch((errorMessage, statusCode) => {
        console.log(errorMessage);
        reject(errorMessage);
      });
  });
}

export function availableSlots(params) {
  return new Promise(function (resolve, reject) {
    const body = JSON.stringify(params);
    RNFetchBlob.fetch(
      "POST",
      Constants.Backend_Server_Address + "/availableslots",
      {
        "Content-Type": "application/json",
      },
      body
    )
      .then((response) => {
        resolve(response.json());
      })
      .catch((errorMessage, statusCode) => {
        console.log(errorMessage);
        reject(errorMessage);
      });
  });
}
export function availableDates(params) {
  return new Promise(function (resolve, reject) {
    const body = JSON.stringify(params);
    RNFetchBlob.fetch(
      "POST",
      Constants.Backend_Server_Address + "/availabledates",
      {
        "Content-Type": "application/json",
      },
      body
    )
      .then((response) => {
        resolve(response.json());
      })
      .catch((errorMessage, statusCode) => {
        console.log(errorMessage);
        reject(errorMessage);
      });
  });
}

export function CallApi(params, sublink) {
  return new Promise(function (resolve, reject) {
    const body = JSON.stringify(params);

    RNFetchBlob.fetch(
      "POST",
      Constants.Backend_Server_Address + "/" + sublink,
      {
        "Content-Type": "application/json",
        Accept: "application/json, text/plain, */*",
      },
      body
    )
      .then((response) => {
        resolve(response.json());
      })
      .catch((errorMessage, statusCode) => {
        console.log(errorMessage);
        reject(errorMessage);
      });
  });
}
