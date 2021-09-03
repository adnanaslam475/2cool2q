import { Constants } from "../config/constants";
import RNFetchBlob from "rn-fetch-blob";

export function getDepartments(params) {
  return new Promise(function (resolve, reject) {
    const body = JSON.stringify(params);
    RNFetchBlob.fetch(
      "POST",
      Constants.Backend_Server_Address + "/departments",
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
        console.log(errorMessage);
      });
  });
}
