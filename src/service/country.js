import { Constants } from "../config/constants";
import RNFetchBlob from "rn-fetch-blob";

export function getCountry(params) {
  return new Promise(function (resolve, reject) {
    const body = JSON.stringify(params);
    RNFetchBlob.fetch(
      "GET",
      Constants.Backend_Server_Address + "/country",
      {
        "Content-Type": "application/json",
      },
      body
    )
      .then((response) => {
        // console.log('get', response.json())
        resolve(response.json());
      })
      .catch((errorMessage, statusCode) => {
        console.log('error')
        reject(errorMessage);
        console.log(errorMessage);
      });
  });
}

