import { Constants } from "../config/constants";
// import { Globals } from "../config/globals";
import RNFetchBlob from "rn-fetch-blob";

export function serviceLogin(params) {
  let formdata = new FormData();
  formdata.append("email", params.email);
  formdata.append("password", params.password);
  return new Promise(function (resolve, reject) {
    const body = JSON.stringify(params);
    RNFetchBlob.config({ timeout: 25000 })
      .fetch(
        "POST",
        Constants.Backend_Server_Address + "/login",
        {
          "Content-Type": "application/json",
        },
        body
      )
      .then((response) => {
        resolve(response.json());
      })
      .catch((errorMessage, statusCode) => {
        reject(errorMessage);
      });
  });
}

export function serviceRegister(params) {
  return new Promise(function (resolve, reject) {
    const body = JSON.stringify(params);
    console.log(params)
    RNFetchBlob.fetch(
      "POST",
      Constants.Backend_Server_Address + "/register",
      {
        "Content-Type": "application/json",
      },
      body
    )
      .then((response) => {
        resolve(response.json());
      })
      .catch((errorMessage, statusCode) => {
        reject(errorMessage);
      });
  });
}

export function otp(params) {
  return new Promise(function (resolve, reject) {
    const body = JSON.stringify(params);
    RNFetchBlob.fetch(
      "POST",
      Constants.Backend_Server_Address + "/otp",
      {
        "Content-Type": "application/json",
      },
      body
    )
      .then((response) => {
        resolve(response.json());
      })
      .catch((errorMessage, statusCode) => {
        reject(errorMessage);
      });
  });
}

export function forgotPassword(params) {
  return new Promise(function (resolve, reject) {
    const body = JSON.stringify(params);
    RNFetchBlob.fetch(
      "POST",
      Constants.Backend_Server_Address + "/forgotpassword",
      {
        "Content-Type": "application/json",
      },
      body
    )
      .then((response) => {
        resolve(response.json());
      })
      .catch((errorMessage, statusCode) => {
        reject(errorMessage);
      });
  });
}


export function removeProfile(params) {
  return new Promise(function (resolve, reject) {
    const body = JSON.stringify(params);
    console.log(params)
    RNFetchBlob.fetch(
      "POST",
      Constants.Backend_Server_Address + "/remove_profile",
      {
        "Content-Type": "application/json",
      },
      body
    )
      .then((response) => {
        resolve(response.json());
      })
      .catch((errorMessage, statusCode) => {
        reject(errorMessage);
      });
  });
}

export function updatePassword(params) {
  return new Promise(function (resolve, reject) {
    const body = JSON.stringify(params);
    RNFetchBlob.fetch(
      "POST",
      Constants.Backend_Server_Address + "/updatepassword",
      {
        "Content-Type": "application/json",
      },
      body
    )
      .then((response) => {
        resolve(response.json());
      })
      .catch((errorMessage, statusCode) => {
        reject(errorMessage);
      });
  });
}

export function getGpsLocation(params) {
  return new Promise(function (resolve, reject) {
    RNFetchBlob.fetch(
      "POST",
      "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBRHZ24e9OnPUSM4J2pLfOzVGrXBkFia_g",
      {
        "Content-Type": "application/json",
      },
      null
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

export function loadProfile(params) {
  return new Promise(function (resolve, reject) {
    const body = JSON.stringify(params);
    RNFetchBlob.fetch(
      "POST",
      Constants.Backend_Server_Address + "/loadProfile",
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


export function updateProfile(params, bdata) {
  return new Promise(function (resolve, reject) {
    const body = JSON.stringify(params);
    RNFetchBlob.fetch(
      "POST",
      Constants.Backend_Server_Address + "/updateprofile",
      {
        "Content-Type": "application/octet-stream",
      },
      [
        { name: "information", data: body },
        {
          name: "profile-pic", filename: bdata.fileName,
          data: bdata.data
        },
      ]
    )
      .then((response) => {
        resolve(response.json());
      })
      .catch((errorMessage, statusCode) => {
        reject(errorMessage);
      });
  });
}

export function updateProfile2(params) {
  return new Promise(function (resolve, reject) {
    const body = JSON.stringify(params);
    RNFetchBlob.fetch(
      "POST",
      Constants.Backend_Server_Address + "/updateprofile",
      null,
      [{ name: "information", data: body }]
    )
      .then((response) => {
        resolve(response.json());
      })
      .catch((errorMessage, statusCode) => {
        reject(errorMessage);
      });
  });
}

export function serviceGetAsset(params) {
  return new Promise(function (resolve, reject) {
    RNFetchBlob.fetch(
      "POST",
      Constants.Backend_Server_Address + "/getAsset",
      {
        "Content-Type": "multipart/form-data",
      },
      [{ name: "number", data: params.number }]
    )
      .then((response) => {
        resolve(response.json());
      })
      .catch((errorMessage, statusCode) => {
        reject(errorMessage);
      });
  });
}
