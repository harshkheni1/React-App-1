import React, { Component } from "react";
import { connect } from "react-redux";
import { Router, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import LoginPage from "./pages/LoginPage";
import AMPAOtpSignin, { APMAOtpSignin } from "./pages/APMAOtpSignin";
import HomePage from "./pages/HomePage";
import HomePage2 from "./pages/HomePage2";
import CompanyListing from "./pages/CompanyListing";
import SearchPage from "./pages/SearchPage";
import AboutUs from "./pages/User/AboutUs";
import RegistrationPage from "./pages/RegistrationPage";
import APMASignupPage from "./pages/APMAsignup";
import APMALoginPage from "./pages/APMALogin";
import CompanyProfile from "./pages/User/CompanyProfile";
import ChangePassword from "./pages/User/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword";
import ForgotApmaPassword from "./pages/ForgotApmaPassword";
import ResetPassword from "./pages/ResetPassword";
import ResetApmaPassword from "./pages/ResetApmaPassword ";
import CompanyDetails from "./pages/CompanyDetails";
import AddYourHighlights from "./pages/User/AddYourHighlights";
import HighlightsHistory from "./pages/User/HighlightsHistory";
import SearchPageForLocationAndSector from "./pages/SearchPageforLocationAndSector";
import ApmaPage from "./pages/APMA/ApmaPage";
import { history, Role } from "./_helpers";
import { authenticationService } from "./_services";
import { PrivateRoute } from "./components/PrivateRoute";
import DashboardLayoutRoute from "./layout/components/DashboardLayoutRoute";
import ApmaLayoutRoute from "./layout/components/ApmaLayoutRoute";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
//import 'primereact/resources/themes/nova-light/theme.css';
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "./layout/layout.scss";
import "./App.css";
//import jQuery from 'jquery';

//window.jQuery = jQuery;
function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: null,
      isAdmin: false
    };
  }

  componentWillMount() {
    if (!localStorage.getItem("isenc")) {
      localStorage.setItem("isenc", "0");
    }
    document.addEventListener("keydown", keyDownTextField, false);

    function keyDownTextField(e) {
      var keyCode = e.keyCode;
      if (e.ctrlKey && e.altKey && e.key === "e") {
        let encMode = localStorage.getItem("isenc")
          ? localStorage.getItem("isenc")
          : "0";
        if (encMode !== "1") {
          localStorage.setItem("isenc", "1");
          alert("Enc Mode On");
        } else {
          localStorage.setItem("isenc", "0");
          alert("Enc Mode Off");
        }
      }
    }
    if (!sessionStorage.getItem("pemPublic")) {
      fetch("/security/public_client.pem", { mode: "no-cors" })
        .then((response) => response.text())
        .then((data) => {
          fetch("/security/private_client.pem", { mode: "no-cors" })
            .then((response1) => response1.text())
            .then((data1) => {
              sessionStorage.setItem("pemPrivate", data1);
              sessionStorage.setItem("pemPublic", data);
            });
        })
        .catch((error) => console.error(error));
    }
  }

  render() {
    return (
      <Router history={history} onUpdate={(a) => console.log(a)}>
        {/* Common Routes */}
        <Route exact path="/" component={HomePage} />
        <Route exact path="/home" component={HomePage} />
        <Route exact path="/home2" component={HomePage2} />
        <Route exact path="/listings" component={CompanyListing} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/apma-signin" component={APMAOtpSignin} />
        <Route exact path="/apma-login" component={APMALoginPage} />
        <Route exact path="/register" component={RegistrationPage} />
        <Route exact path="/apma-signup" component={APMASignupPage} />
        <Route exact path="/search" component={SearchPage} />
        <Route
          exact
          path="/searchbylocationandsector"
          component={SearchPageForLocationAndSector}
        />
        <Route path="/company-details/:id" component={CompanyDetails} />
        <Route path="/forgot-apma-password" component={ForgotApmaPassword} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route
          path="/reset-apma-password/:token"
          component={ResetApmaPassword}
        />
        <Route path="/reset/:token" component={ResetPassword} />

        {/* Admin's Routes */}
        {/* <Route path="/dashboard" component={Dashboard} /> */}
        <DashboardLayoutRoute path="/aboutus" component={AboutUs} />
        <DashboardLayoutRoute
          path="/company-profile"
          component={CompanyProfile}
        />
        <DashboardLayoutRoute
          path="/add-highlight"
          component={AddYourHighlights}
        />
        <DashboardLayoutRoute
          path="/highlight-history"
          component={HighlightsHistory}
        />
        <DashboardLayoutRoute
          path="/change-password"
          component={ChangePassword}
        />
        <ApmaLayoutRoute path="/apma" component={ApmaPage} />
      </Router>
    );
  }
  componentDidMount() {
    authenticationService.currentUser.subscribe((x) =>
      this.setState({
        currentUser: x,
        isAdmin: x && x.role === Role.Admin
      })
    );

    // let host = window.location.origin;

    // let cssFiles = [

    // ];
    // cssFiles.map((t) => {
    //   let link = document.createElement("linkgit
    //   return true;
    // });
    // let scripts = [
    //   host + '/assets/plugins/jquery/jquery.min.js',
    //   // 'https://cdnjs.cloudflare.com/ajax/libs/jquery.mask/1.14.16/jquery.mask.min.js',
    //   'https://cdnjs.cloudflare.com/ajax/libs/jquery.inputmask/5.0.4-beta.33/bindings/inputmask.binding.min.js',
    //   host + '/assets/plugins/popper/popper.min.js',
    //   host + '/assets/plugins/bootstrap/js/bootstrap.min.js',
    //   host + '/assets/js/jquery.slimscroll.js',
    //   host + '/assets/js/waves.js',
    //   host + '/assets/js/sidebarmenu.js',
    //   host + '/assets/plugins/sticky-kit-master/dist/sticky-kit.min.js',
    //   host + '/assets/plugins/sparkline/jquery.sparkline.min.js',
    //   host + '/assets/plugins/styleswitcher/jQuery.style.switcher.js',
    //   host + '/assets/plugins/bootstrap-datepgit

    // scripts.map((t) => {
    //   let script = document.createElement("script");
    //   script.src = t;
    //   script.async = false;
    //   document.body.appendChild(script);
    //   return true;
    // });
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
