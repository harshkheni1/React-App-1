import React, { Component } from "react";
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Row,
  Col
} from "reactstrap";
import classnames from "classnames";
import MutualNDA from "../../components/APMA/MutualNDA";
import ArrowPartnershipAgreement from "../../components/APMA/ArrowPartnershipAgreement";
import Profile from "../../components/APMA/Profile";
import RFP from "../../components/APMA/RFP";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { isFormCompleted } from "../../_helpers/_helperFunctions";
import { apmaService } from "../../_services/apma.service";
import { authenticationService } from "../../_services/authentication.service";
import { Toast } from "primereact/toast";
export default class ApmaPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "1",
      isProfileCompleted: false,
      isMutualNDACompleted: false,
      isArrowPartnershipCompleted: false,
      isRFPCompleted: false,
      currentUser: authenticationService.currentUserValue,
      apmaProfile: {}
    };
  }

  componentDidMount() {
    this.getApmaProfile();
  }

  toggleTab = (tab) => {
    if (this.state.activeTab !== tab) {
      if (!this.state.isProfileCompleted) {
        this.toast.show({
          severity: "warn",
          summary: "Warning",
          detail: "Please complete profile first"
        });
      } else {
        this.setState({ activeTab: tab });
      }
    }
  };

  setProfileStatus = (status) => {
    this.setState({ isProfileCompleted: status });
  };

  setMutualNDAStatus = (status) => {
    this.setState({ isMutualNDACompleted: status });
  };

  setArrowPartnershipStatus = (status) => {
    this.setState({ isArrowPartnershipCompleted: status });
  };

  setRFPStatus = (status) => {
    this.setState({ isRFPCompleted: status });
  };

  getApmaProfile = () => {
    this.state.currentUser.id &&
      apmaService.getApmaProfileById(this.state.currentUser.id).then((data) => {
        let apmaProfile = data.Data;

        let isProfileCompleted = isFormCompleted(
          {
            fullLegalName: apmaProfile.fullLegalName,
            companyAddress: apmaProfile.companyAddress,
            businessWebsite: apmaProfile.businessWebsite,
            contactPerson: apmaProfile.contactPerson,
            position: apmaProfile.position,
            phoneNumber: apmaProfile.phoneNumber,
            mobileNumber: apmaProfile.mobileNumber,
            profileEmail: apmaProfile.profileEmail
          },
          8
        );
        this.setState({ apmaProfile, isProfileCompleted });
      });
  };

  render() {
    const {
      activeTab,
      isProfileCompleted,
      apmaProfile,
      isMutualNDACompleted,
      isArrowPartnershipCompleted,
      isRFPCompleted
    } = this.state;
    return (
      <div className="p-grid">
        <Toast ref={(el) => (this.toast = el)} position="top-right"></Toast>
        <div className="p-col-12">
          <div className="card">
            <Nav tabs>
              <NavItem className="apma-forms-tab">
                <NavLink
                  className={classnames("cursor-pointer", {
                    active: activeTab === "1"
                  })}
                  onClick={() => {
                    this.toggleTab("1");
                  }}
                >
                  Profile
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="ml-2"
                    style={{
                      color: isProfileCompleted ? "#4cbb17" : "#ffa500"
                    }}
                  />
                </NavLink>
              </NavItem>
              <NavItem className="apma-forms-tab">
                <NavLink
                  className={classnames("cursor-pointer", {
                    active: activeTab === "2"
                  })}
                  onClick={() => {
                    this.toggleTab("2");
                  }}
                >
                  Mutual NDA
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="ml-2"
                    style={{
                      color: isMutualNDACompleted ? "#4cbb17" : "#ffa500"
                    }}
                  />
                </NavLink>
              </NavItem>
              {/* <NavItem className="apma-forms-tab">
                <NavLink
                  className={classnames("cursor-pointer", {
                    active: activeTab === "3"
                  })}
                  onClick={() => {
                    this.toggleTab("3");
                  }}
                >
                  Arrow Partnership Agreement
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="ml-2"
                    style={{
                      color: isArrowPartnershipCompleted ? "#4cbb17" : "#ffa500"
                    }}
                  />
                </NavLink>
              </NavItem> */}
              <NavItem className="apma-forms-tab">
                <NavLink
                  className={classnames("cursor-pointer", {
                    active: activeTab === "4"
                  })}
                  onClick={() => {
                    this.toggleTab("4");
                  }}
                >
                  RFP
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="ml-2"
                    style={{
                      color: isRFPCompleted ? "#4cbb17" : "#ffa500"
                    }}
                  />
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
              <TabPane tabId="1">
                <Row>
                  <Col sm="12" md="12">
                    <Profile
                      setProfileStatus={this.setProfileStatus}
                      apmaProfile={apmaProfile}
                      getApmaProfile={this.getApmaProfile}
                    />
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId="2">
                <Row>
                  <Col sm="12" md="12">
                    <MutualNDA
                      setMutualNDAStatus={this.setMutualNDAStatus}
                      apmaProfile={this.state.apmaProfile}
                    />
                  </Col>
                </Row>
              </TabPane>
              {/* <TabPane tabId="3">
                <Row>
                  <Col sm="12" md="12">
                    <ArrowPartnershipAgreement
                      setArrowPartnershipStatus={this.setArrowPartnershipStatus}
                      apmaProfile={this.state.apmaProfile}
                    />
                  </Col>
                </Row>
              </TabPane> */}
              <TabPane tabId="4">
                <Row>
                  <Col sm="12" md="12">
                    {" "}
                    <RFP
                      setRFPStatus={this.setRFPStatus}
                      apmaProfile={this.state.apmaProfile}
                    />
                  </Col>
                </Row>
              </TabPane>
            </TabContent>
          </div>
        </div>
      </div>
    );
  }
}
