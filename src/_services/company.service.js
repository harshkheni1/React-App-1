import config from "../config";
import { authHeader, handleResponse } from "../_helpers";
import { encData } from "../_helpers/_helperFunctions";
import axios from "axios";

export const companyService = {
  register,
  getCompanyById,
  updateProfile,
  updateLogo,
  createProfileChangeRequest,
  saveFile,
  getFilesByCompanyId,
  getSignedLinkFromKey,
  changePassword,
  forgotPassword,
  setPassword,
  featuredCompanyList,
  getPublicCompanyById,
  getAllActiveCompanies,
  getPublicCompanyByLocationAndSector,
  companySearch,
  getCompanyPendingProfileReq,
  getAllActiveCompaniesLocation,
  browseBySectorList,
  getListOfCompaniesBySector,
  getFilesForSpecificCompany,
  saveServiceKeyword,
  browseByCityList,
  getListOfCompaniesByCity,
  deleteResourceFile,
  toggleDetailsAreCorrectByCompanyId,
  getCompanyBySectorForHomePage
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
  return fetch(
    `${config.apiUrl}/api/v1/companies/register`,
    requestOptions
  ).then(handleResponse);
}

function getCompanyById(companyId) {
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };
  return fetch(
    `${config.apiUrl}/api/v1/companies/${companyId}`,
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
    `${config.apiUrl}/api/v1/companies/${companyId}`,
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
    `${config.apiUrl}/api/v1/companies/logo-image/${companyId}`,
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
    `${config.apiUrl}/api/v1/companies/profile-request`,
    requestOptions
  ).then(handleResponse);
}

function saveFile(data) {
  const requestOptions = {
    method: "POST",
    headers: authHeader(),
    body: encData(data)
  };
  return fetch(
    `${config.apiUrl}/api/v1/companies/files/save`,
    requestOptions
  ).then(handleResponse);
}

function getFilesByCompanyId(companyId) {
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };
  return fetch(
    `${config.apiUrl}/api/v1/companies/files/${companyId}`,
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
    `${config.apiUrl}/api/v1/companies/files/get-file-url`,
    requestOptions
  ).then(handleResponse);
}

function changePassword(data) {
  const requestOptions = {
    method: "POST",
    headers: authHeader(),
    body: encData(data)
  };
  return fetch(
    `${config.apiUrl}/api/v1/companies/changepassword`,
    requestOptions
  ).then(handleResponse);
}

function forgotPassword(data) {
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
    `${config.apiUrl}/api/v1/companies/forgotpassword`,
    requestOptions
  ).then(handleResponse);
}

function setPassword(data, token) {
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
    `${config.apiUrl}/api/v1/companies/setpassword/${token}`,
    requestOptions
  ).then(handleResponse);
}

function getListOfCompaniesBySector(sector) {
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };

  return fetch(
    `${config.apiUrl}/api/v1/companies/getCompanyBySector/${sector}`,
    requestOptions
  ).then(handleResponse);
}

function getCompanyBySectorForHomePage(sector) {
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };

  return fetch(
    `${config.apiUrl}/api/v1/companies/getCompanyBySectorForHomePage/${sector}`,
    requestOptions
  ).then(handleResponse);
}

function featuredCompanyList() {
  const requestOptions = {
    method: "GET"
  };
  return fetch(
    `${config.apiUrl}/api/v1/companies/featured-companylist`,
    requestOptions
  ).then(handleResponse);
}

function getAllActiveCompaniesLocation() {
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };
  return fetch(
    `${config.apiUrl}/api/v1/companies/getAllActiveCompaniesLocation`,
    requestOptions
  ).then(handleResponse);
}

function getPublicCompanyById(companyId) {
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };
  return fetch(
    `${config.apiUrl}/api/v1/companies/public/${companyId}`,
    requestOptions
  ).then(handleResponse);
}

function getAllActiveCompanies() {
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };
  return fetch(
    `${config.apiUrl}/api/v1/companies/active-companies`,
    requestOptions
  ).then(handleResponse);
}

function getPublicCompanyByLocationAndSector(params) {
  const requestOptions = {
    method: "GET"
  };
  return fetch(
    `${config.apiUrl}/api/v1/companies/getCompanyBySectorAndLocation?location=${params.location}&sector=${params.sector}`,
    requestOptions
  ).then(handleResponse);
}
function companySearch(SearchParam) {
  const requestOptions = {
    method: "GET"
  };
  return fetch(
    `${config.apiUrl}/api/v1/companies/companySearch?search=${SearchParam.globalSearch}`,
    requestOptions
  ).then(handleResponse);
}

function getCompanyPendingProfileReq(companyId) {
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };
  return fetch(
    `${config.apiUrl}/api/v1/companies/profile-change-requests/${companyId}`,
    requestOptions
  ).then(handleResponse);
}

function browseBySectorList() {
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };
  return fetch(
    `${config.apiUrl}/api/v1/companies/browseBySectorList`,
    requestOptions
  ).then(handleResponse);
}

function getFilesForSpecificCompany(companyId) {
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };

  return fetch(
    `${config.apiUrl}/api/v1/companies/company-files/${companyId}`,
    requestOptions
  ).then(handleResponse);
}

function saveServiceKeyword(data) {
  const requestOptions = {
    method: "POST",
    headers: authHeader(),
    body: encData(data)
  };
  return fetch(
    `${config.apiUrl}/api/v1/companies/saveServiceKeyword`,
    requestOptions
  ).then(handleResponse);
}

function browseByCityList() {
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };
  return fetch(
    `${config.apiUrl}/api/v1/companies/browseByCityList`,
    requestOptions
  ).then(handleResponse);
}

function getListOfCompaniesByCity(city) {
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };

  return fetch(
    `${config.apiUrl}/api/v1/companies/getCompanyByMunicipality/${city}`,
    requestOptions
  ).then(handleResponse);
}

function deleteResourceFile(data) {
  const requestOptions = {
    method: "POST",
    headers: authHeader(),
    body: encData(data)
  };
  return fetch(
    `${config.apiUrl}/api/v1/companies/files/delete`,
    requestOptions
  ).then(handleResponse);
}

function toggleDetailsAreCorrectByCompanyId(data) {
  const requestOptions = {
    method: "POST",
    headers: authHeader(),
    body: encData(data)
  };
  return fetch(
    `${config.apiUrl}/api/v1/companies/toggle-is-agreed`,
    requestOptions
  ).then(handleResponse);
}
