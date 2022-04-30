import config from "../config";
import { authHeader, handleResponse } from "../_helpers";
import { encData } from "../_helpers/_helperFunctions";

export const naicsService = {
  getNaicsChildFromParent
};

function getNaicsChildFromParent(data) {
  const requestOptions = {
    method: "POST",
    headers: authHeader(),
    body: encData(data)
  };
  return fetch(
    `${config.apiUrl}/api/v1/naics/get-naics-child-from-parent`,
    requestOptions
  ).then(handleResponse);
}
