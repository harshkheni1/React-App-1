import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { authenticationService } from '../_services';
import { Role } from '../_helpers';

export const PrivateRoute = ({ component: Component, roles, ...rest }) => (
    <Route {...rest} render={props => {
        const currentUser = authenticationService.currentUserValue;
        if (!currentUser) {
            return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        }
        if (roles && roles.role !== currentUser.role) {
            return currentUser.role === Role.Admin ? <Redirect to={{ pathname: '/admin' }} /> : <Redirect to={{ pathname: '/' }} />;
        }
        return <Component {...props} />
    }} />
)