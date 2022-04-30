import config from "../config";
import { authHeader, handleResponse } from "../_helpers";
import { encData } from "../_helpers/_helperFunctions";
export const serviceKeywordService = {
  getAllServiceKeyword
};

function getAllServiceKeyword() {
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };

  return fetch(
    `${config.apiUrl}/api/v1/servicesKeyword/getAllServiceKeyword`,
    requestOptions
  ).then(handleResponse);
}
