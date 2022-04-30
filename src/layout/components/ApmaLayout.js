import React, { Component } from "react";
import classNames from "classnames";
import { ApmaTopbar } from "./ApmaTopbar";
import { ApmaFooter } from "./ApmaFooter";
import { ApmaMenu } from "./ApmaMenu";
//import {AppProfile} from './AppProfile';
import { authenticationService } from "../../_services/";
class ApmaLayout extends Component {
  constructor() {
    super();
    this.state = {
      layoutMode: "static",
      layoutColorMode: "dark",
      staticMenuInactive: false,
      overlayMenuActive: false,
      mobileMenuActive: false
    };

    this.onWrapperClick = this.onWrapperClick.bind(this);
    this.onToggleMenu = this.onToggleMenu.bind(this);
    this.onSidebarClick = this.onSidebarClick.bind(this);
    this.onMenuItemClick = this.onMenuItemClick.bind(this);
    this.createMenu();
  }

  onWrapperClick(event) {
    if (!this.menuClick) {
      this.setState({
        overlayMenuActive: false,
        mobileMenuActive: false
      });
    }

    this.menuClick = false;
  }

  onToggleMenu(event) {
    this.menuClick = true;

    if (this.isDesktop()) {
      if (this.state.layoutMode === "overlay") {
        this.setState({
          overlayMenuActive: !this.state.overlayMenuActive
        });
      } else if (this.state.layoutMode === "static") {
        this.setState({
          staticMenuInactive: !this.state.staticMenuInactive
        });
      }
    } else {
      const mobileMenuActive = this.state.mobileMenuActive;
      this.setState({
        mobileMenuActive: !mobileMenuActive
      });
    }

    event.preventDefault();
  }

  onSidebarClick(event) {
    this.menuClick = true;
  }

  onMenuItemClick(event) {
    if (!event.item.items) {
      this.setState({
        overlayMenuActive: false,
        mobileMenuActive: false
      });
    }
  }

  createMenu() {
    this.menu = [
      {
        label: "Dashboard",
        icon: "pi pi-fw pi-home",
        to: "/apma"
      }
    ];
  }

  addClass(element, className) {
    if (element.classList) element.classList.add(className);
    else element.className += " " + className;
  }

  removeClass(element, className) {
    if (element.classList) element.classList.remove(className);
    else
      element.className = element.className.replace(
        new RegExp(
          "(^|\\b)" + className.split(" ").join("|") + "(\\b|$)",
          "gi"
        ),
        " "
      );
  }

  isDesktop() {
    return window.innerWidth > 1024;
  }

  componentDidUpdate() {
    if (this.state.mobileMenuActive)
      this.addClass(document.body, "body-overflow-hidden");
    else this.removeClass(document.body, "body-overflow-hidden");
  }

  render() {
    const logo =
      this.state.layoutColorMode === "dark"
        ? "/assets/images/arrow-logo.jpg"
        : "assets/layout/images/logo.svg";

    const wrapperClass = classNames("layout-wrapper", {
      "layout-overlay": this.state.layoutMode === "overlay",
      "layout-static": this.state.layoutMode === "static",
      "layout-static-sidebar-inactive":
        this.state.staticMenuInactive && this.state.layoutMode === "static",
      "layout-overlay-sidebar-active":
        this.state.overlayMenuActive && this.state.layoutMode === "overlay",
      "layout-mobile-sidebar-active": this.state.mobileMenuActive
    });

    const sidebarClassName = classNames("layout-sidebar", {
      "layout-sidebar-dark": this.state.layoutColorMode === "dark",
      "layout-sidebar-light": this.state.layoutColorMode === "light"
    });

    return (
      <div className={wrapperClass} onClick={this.onWrapperClick}>
        <ApmaTopbar
          onToggleMenu={this.onToggleMenu}
          logout={(e) => {
            authenticationService.logout();
          }}
        />

        <div
          ref={(el) => (this.sidebar = el)}
          className={sidebarClassName}
          onClick={this.onSidebarClick}
        >
          <div className="layout-apma-logo pb-3 px-2">
            <a href="https://apma.ca/" target="_blank">
              {" "}
              <img
                alt="Logo"
                src="/assets/images/apma_logo.jpg"
                className="img-fluid"
              />
            </a>
          </div>
          <div className="layout-apma-logo layout-apma-logo-padding px-2">
            <a href="https://projectarrow.ca/" target="_blank">
              <img alt="Logo" src={logo} className="img-fluid" />
            </a>
          </div>

          {/* <AppProfile /> */}
          {/* <div className="mb-4"></div> */}
          <ApmaMenu model={this.menu} onMenuItemClick={this.onMenuItemClick} />
          <div className="footerImgLogo logo-back">
            <a href="http://choosewindsoressex.com/" target="_blank">
              <img
                className="img-fluid"
                src="/assets/images/weedc_logo.png"
                alt="Logo"
              />
            </a>
          </div>
        </div>

        <div className="layout-main">{this.props.children}</div>

        <ApmaFooter />

        <div className="layout-mask"></div>
      </div>
    );
  }
}

export default ApmaLayout;
