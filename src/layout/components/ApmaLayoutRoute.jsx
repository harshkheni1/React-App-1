import React from "react";
import ApmaLayout from "./ApmaLayout";
import { Route, Redirect } from "react-router-dom";
import { authenticationService } from "../../_services";
const ApmaLayoutRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(matchProps) => {
        const currentUser = authenticationService.currentUserValue;

        if (!currentUser) {
          return (
            <Redirect
              to={{
                pathname: "/apma-login",
                state: { from: matchProps.location }
              }}
            />
          );
        }
        return (
          <ApmaLayout>
            <Component {...matchProps} />
          </ApmaLayout>
        );
      }}
    />
  );
};

export default ApmaLayoutRoute;
