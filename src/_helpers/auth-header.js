import { authenticationService } from "../_services";

export function authHeader(encrypt) {
  // return authorization header with jwt token
  const currentUser = authenticationService.currentUserValue;
  if (currentUser && currentUser.token) {
    return {
      Authorization: `Bearer ${currentUser.token}`,
      "Content-Type": `application/json`,
      isenc: encrypt
        ? 1
        : localStorage.getItem("isenc")
        ? parseInt(localStorage.getItem("isenc"))
        : 0
    };
  } else {
    return {};
  }
}
