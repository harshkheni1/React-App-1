import React from "react";
import DashboardLayout from "./DashboardLayout";
import { Route, Redirect } from "react-router-dom";
import { authenticationService } from "../../_services";
const DashboardLayoutRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(matchProps) => {
        const currentUser = authenticationService.currentUserValue;

        if (!currentUser) {
          return (
            <Redirect
              to={{ pathname: "/login", state: { from: matchProps.location } }}
            />
          );
        }
        return (
          <DashboardLayout>
            <Component {...matchProps} />
          </DashboardLayout>
        );
      }}
    />
  );
};

export default DashboardLayoutRoute;
