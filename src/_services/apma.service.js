import config from "../config";
import { authHeader, handleResponse } from "../_helpers";
import { encData } from "../_helpers/_helperFunctions";
import axios from "axios";

export const apmaService = {
  register,
  getCompanyById,
  updateProfile,
  updateLogo,
  createProfileChangeRequest,
  saveFile,
  getFilesByCompanyId,
  getSignedLinkFromKey,
  saveApmaProfile,
  getApmaProfileById,
  setApmaPassword,
  forgotApmaPassword
};

function register(data) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      isenc: localStorage.getItem("isenc")
        ? parseInt(localStorage.getItem("isenc"))
        : 0
    },
    body: encData(data)
  };
  return fetch(`${config.apiUrl}/api/v1/apma/register`, requestOptions).then(
    handleResponse
  );
}
function setApmaPassword(data, token) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      isenc: 1
    },
    body: encData(data, true)
  };

  return fetch(
    `${config.apiUrl}/api/v1/apma/set-apma-password/${token}`,
    requestOptions
  ).then((response) => handleResponse(response, true));
}

function getCompanyById(companyId) {
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };
  return fetch(
    `${config.apiUrl}/api/v1/apma/${companyId}`,
    requestOptions
  ).then(handleResponse);
}

function updateProfile(companyId, data) {
  const requestOptions = {
    method: "POST",
    headers: authHeader(),
    body: encData(data)
  };
  return fetch(
    `${config.apiUrl}/api/v1/apma/${companyId}`,
    requestOptions
  ).then(handleResponse);
}

function updateLogo(companyId, data) {
  const requestOptions = {
    method: "POST",
    headers: authHeader(),
    body: encData(data)
  };
  return fetch(
    `${config.apiUrl}/api/v1/apma/logo-image/${companyId}`,
    requestOptions
  ).then(handleResponse);
}

function createProfileChangeRequest(data) {
  const requestOptions = {
    method: "POST",
    headers: authHeader(),
    body: encData(data)
  };
  return fetch(
    `${config.apiUrl}/api/v1/apma/profile-request`,
    requestOptions
  ).then(handleResponse);
}

function saveFile(data) {
  const requestOptions = {
    method: "POST",
    headers: authHeader(),
    body: encData(data)
  };
  return fetch(`${config.apiUrl}/api/v1/apma/files/save`, requestOptions).then(
    handleResponse
  );
}

function getFilesByCompanyId(companyId) {
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };
  return fetch(
    `${config.apiUrl}/api/v1/apma/files/${companyId}`,
    requestOptions
  ).then(handleResponse);
}

function getSignedLinkFromKey(data) {
  const requestOptions = {
    method: "POST",
    headers: authHeader(),
    body: encData(data)
  };
  return fetch(
    `${config.apiUrl}/api/v1/apma/files/get-file-url`,
    requestOptions
  ).then(handleResponse);
}

function saveApmaProfile(data, id) {
  const requestOptions = {
    method: "POST",
    headers: authHeader(),
    body: encData(data)
  };
  return fetch(`${config.apiUrl}/api/v1/apma/${id}`, requestOptions).then(
    handleResponse
  );
}

function getApmaProfileById(id) {
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };
  return fetch(`${config.apiUrl}/api/v1/apma/${id}`, requestOptions).then(
    handleResponse
  );
}

function forgotApmaPassword(data) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": `application/json`,
      isenc: localStorage.getItem("isenc")
        ? parseInt(localStorage.getItem("isenc"))
        : 0
    },
    body: encData(data)
  };
  return fetch(
    `${config.apiUrl}/api/v1/apma/forgot-apma-password`,
    requestOptions
  ).then(handleResponse);
}
