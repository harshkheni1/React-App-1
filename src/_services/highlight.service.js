import config from "../config";
import { authHeader, handleResponse } from "../_helpers";
import { encData } from "../_helpers/_helperFunctions";

export const highlightService = {
  addHighlight,
  getAllHighlights,
  getHistoryofHighlights
};

function addHighlight(data) {
  const requestOptions = {
    method: "POST",
    headers: authHeader(),
    body: encData(data)
  };
  return fetch(`${config.apiUrl}/api/v1/highlights`, requestOptions).then(
    handleResponse
  );
}

function getAllHighlights() {
  const requestOptions = {
    method: "GET"
  };
  return fetch(
    `${config.apiUrl}/api/v1/highlights/getAllHighlights`,
    requestOptions
  ).then(handleResponse);
}

function getHistoryofHighlights(id) {
  const requestOptions = {
    headers: authHeader(),
    method: "GET"
  };
  return fetch(
    `${config.apiUrl}/api/v1/highlights/getHighlightsHistory/${id}`,
    requestOptions
  ).then(handleResponse);
}
