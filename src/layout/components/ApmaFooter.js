import React, { Component } from "react";

export class ApmaFooter extends Component {
  render() {
    return (
      <div className="layout-footer">
        <div className="row">
          <div className="col-sm-8 footer-text">
            <span>
              Project Arrow ©2021 &nbsp; &nbsp; &nbsp; The Automotive Parts
              Manufacturers' Association of Canada (APMA)
            </span>
          </div>

          <div className="col-sm-4 imgCenter">
            <a href="https://www.yqgtech.com/index.html" target="_blank">
              <img
                className="px-3 float-right"
                src="/assets/images/yqg-logo.svg"
                alt="Logo"
                width="85"
              />
            </a>
            <span className="pt-2 float-right">powered by</span>
          </div>
        </div>
      </div>
    );
  }
}
