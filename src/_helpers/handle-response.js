import { authenticationService } from "../_services";
import EncDec from "../e2e/e2e_functions/index";
import { isEmpty } from "./_helperFunctions";
export function handleResponse(response, isEncrypted) {
  if (
    isEncrypted
      ? 1
      : localStorage.getItem("isenc")
      ? parseInt(localStorage.getItem("isenc"))
      : 0
  ) {
    return response.text().then((text) => {
      const data = text && JSON.parse(text);
      //const data = result;

      if (!response.ok) {
        if ([401, 403].indexOf(response.status) !== -1) {
          // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
          authenticationService.logout();
          //location.reload(true);
        }
        const error = (data && data.Message) || response.statusText;
        return Promise.reject(error);
      }
      if (data.hasOwnProperty("Data")) {
        data.Data = JSON.parse(EncDec.decryptRequest(data.Data));
      }

      return data;
    });
  } else {
    return response.text().then((text) => {
      const data = text && JSON.parse(text);
      //const data = result;
      if (!response.ok) {
        if ([401, 403].indexOf(response.status) !== -1) {
          // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
          authenticationService.logout();
          //location.reload(true);
        }
        const error = (data && data.Message) || response.statusText;
        return Promise.reject(error);
      }
      return data;
    });
  }
}
