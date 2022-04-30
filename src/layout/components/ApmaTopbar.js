import React, { Component } from "react";
import { InputText } from "primereact/inputtext";
// import { Menu } from "primereact/menu";
// import { Button } from "primereact/button";
import PropTypes from "prop-types";
import { authenticationService, companyService } from "../../_services";

import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
export class ApmaTopbar extends Component {
  static defaultProps = {
    onToggleMenu: null
  };

  static propTypes = {
    onToggleMenu: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      currentUser: authenticationService.currentUserValue,
      currentUserSubject: authenticationService.currentUser,
      companyData: "",

      dropdownOpen: false
    };
  }

  toggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  };

  componentDidMount() {
    if (window.location.pathname !== "/apma") {
      this.getCompanyById();
    }
    this.state.currentUserSubject.subscribe({
      next: (v) => {
        this.setState({ currentUser: v });
      }
    });
  }

  getCompanyById = () => {
    companyService
      .getCompanyById(this.state.currentUser.id)
      .then((data) => {
        if (data && data.Status) {
          this.setState({
            companyData: data.Data
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    const { currentUser, companyData, anchorEl, dropdownOpen } = this.state;
    return (
      <div className="layout-topbar clearfix">
        <button
          className="p-link layout-menu-button"
          onClick={this.props.onToggleMenu}
        >
          <span className="pi pi-bars" />
        </button>
        {currentUser ? (
          <div className="layout-topbar-icons" style={{ display: "flex" }}>
            <Dropdown isOpen={dropdownOpen} toggle={() => this.toggle()}>
              <DropdownToggle className="p-link custom-top-bar-dropdown">
                <div>
                  <span className="welcome-header">
                    Welcome, {currentUser.companyTitle}
                  </span>
                  {currentUser.companyLogo != "" && (
                    <img
                      src={
                        currentUser.companyLogo || "/assets/images/logo-16.svg"
                      }
                      className="company-profile-logo-header"
                      alt="logo"
                    />
                  )}
                </div>
              </DropdownToggle>
              <DropdownMenu
                className="small-menu"
                style={{ minWidth: "190px" }}
              >
                <div style={{ textAlign: "center" }}>
                  {currentUser.companyLogo != "" && (
                    <img
                      src={
                        currentUser.companyLogo || "/assets/images/logo-16.svg"
                      }
                      className="menu-item-logo"
                      alt="logo"
                    />
                  )}
                  <div style={{ fontSize: 14, fontWeight: "bold" }}>
                    {currentUser.companyTitle}
                  </div>
                  <div style={{ fontSize: 14 }}>{currentUser.email}</div>
                </div>
                <DropdownItem divider />
                <div
                  style={{ marginLeft: 8, cursor: "pointer" }}
                  onClick={(e) => this.props.logout(e)}
                >
                  <i className="pi pi-power-off" style={{ marginRight: 8 }}></i>
                  Logout
                </div>
              </DropdownMenu>
            </Dropdown>
          </div>
        ) : null}
      </div>
    );
  }
}
