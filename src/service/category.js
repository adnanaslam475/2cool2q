import { Constants } from "../config/constants";
import RNFetchBlob from "rn-fetch-blob";

export function getCategory(params) {
  return new Promise(function (resolve, reject) {
    const body = JSON.stringify(params);
    RNFetchBlob.fetch(
      "GET",
      Constants.Backend_Server_Address + "/categories",
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
