import config from "../config";
import { authHeader, handleResponse } from "../_helpers";
import { encData } from "../_helpers/_helperFunctions";

export const sectorService = {
  getAllSectors,
  getAllSectorsPublic
};

function getAllSectors() {
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };

  return fetch(
    `${config.apiUrl}/api/v1/sectors/getAllSectors`,
    requestOptions
  ).then(handleResponse);
}

function getAllSectorsPublic() {
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };

  return fetch(
    `${config.apiUrl}/api/v1/sectors/getAllSectorsPublic`,
    requestOptions
  ).then(handleResponse);
}
