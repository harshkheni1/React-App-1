import { BehaviorSubject } from "rxjs";
import config from "../config";
import { handleResponse } from "../_helpers";
import EncDec from "../e2e/e2e_functions/index";

const currentUserSubject = new BehaviorSubject(
  JSON.parse(sessionStorage.getItem("currentUser"))
);
const currentDepartmentSubject = new BehaviorSubject(
  sessionStorage.getItem("currentDepartment")
);
const currentDepartmentNameSubject = new BehaviorSubject(
  sessionStorage.getItem("currentDepartmentName")
);

export const authenticationService = {
  login,
  logout,
  APMAlogin,
  currentUser: currentUserSubject.asObservable(),
  get currentUserValue() {
    return currentUserSubject.value;
  },
  currentDepartment: currentDepartmentSubject.asObservable(),
  get currentDepartmentValue() {
    return currentDepartmentSubject.value;
  },
  get currentDepartmentNameValue() {
    return currentDepartmentNameSubject.value;
  },
  changeDepartment,
  setDepartmentName,
  otpLogin,
  refreshApmaProfileImage
};

function changeDepartment(departmentId, departmentName) {
  sessionStorage.setItem("currentDepartment", departmentId);
  currentDepartmentSubject.next(departmentId);
  setDepartmentName(departmentName);
  window.location.href = "/";
}
function setDepartmentName(departmentName) {
  currentDepartmentNameSubject.next(departmentName);
  sessionStorage.setItem("currentDepartmentName", departmentName);
}
function encData(data, encrypt) {
  let isenc = encrypt
    ? 1
    : localStorage.getItem("isenc")
    ? parseInt(localStorage.getItem("isenc"))
    : 0;
  if (isenc == 1) {
    return JSON.stringify({
      enc_string: EncDec.encryptResponse(JSON.stringify(data))
    });
  } else {
    return JSON.stringify(data);
  }
}

function login(email, password, captcha) {
  const requestOptions = {
    method: "POST",
    //headers: { 'Content-Type': 'application/json' },
    headers: {
      "Content-Type": "application/json",
      isenc: localStorage.getItem("isenc") || 0
    },

    //body: JSON.stringify({ email, password })
    body: encData({ email, password, captcha })
  };

  return fetch(`${config.apiUrl}/api/v1/companies/authenticate`, requestOptions)
    .then(handleResponse)
    .then((company) => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      sessionStorage.setItem("currentUser", JSON.stringify(company.Data));
      currentUserSubject.next(company.Data);
      return company.Data;
    });
}

function otpLogin(data) {
  const requestOptions = {
    method: "POST",
    //headers: { 'Content-Type': 'application/json' },
    headers: {
      "Content-Type": "application/json",
      isenc: localStorage.getItem("isenc") || 0
    },

    //body: JSON.stringify({ email, password })
    body: encData(data)
  };

  return fetch(`${config.apiUrl}/api/v1/apma/otp-authenticate`, requestOptions)
    .then(handleResponse)
    .then((apma) => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      sessionStorage.setItem("currentUser", JSON.stringify(apma.Data));
      currentUserSubject.next(apma.Data);
      return apma.Data;
    });
}

function logout() {
  // remove user from session storage to log user out
  sessionStorage.removeItem("currentUser");
  currentUserSubject.next(null);
}

function APMAlogin(email, password) {
  const requestOptions = {
    method: "POST",
    //headers: { 'Content-Type': 'application/json' },
    headers: {
      "Content-Type": "application/json",
      isenc: 1 //localStorage.getItem("isenc") || 0
    },

    //body: JSON.stringify({ email, password })
    body: encData({ email, password }, true)
  };

  return fetch(`${config.apiUrl}/api/v1/apma/authenticate`, requestOptions)
    .then((response) => handleResponse(response, true))
    .then((company) => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      sessionStorage.setItem("currentUser", JSON.stringify(company.Data));
      currentUserSubject.next(company.Data);
      return company.Data;
    });
}

function refreshApmaProfileImage(image) {
  let userData = JSON.parse(sessionStorage.getItem("currentUser"));
  userData.companyLogo = image;
  sessionStorage.setItem("currentUser", JSON.stringify(userData));
  currentUserSubject.next(userData);
}
