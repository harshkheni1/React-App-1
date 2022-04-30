import { authenticationService } from "../_services";
import EncDec from "../e2e/e2e_functions/index";

export function handleResponseNoDecrypt(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
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
