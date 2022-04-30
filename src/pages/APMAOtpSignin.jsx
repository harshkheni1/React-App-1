import React, { Component } from "react";
import { connect } from "react-redux";
import "./LoginPage.css";
import { Link } from "react-router-dom";
import { authenticationService } from "../_services/";
import PasswordMask from "react-password-mask";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
export class APMAOtpSignin extends Component {
  componentDidMount() {
    document.body.classList.add("bg-apma-banner");
  }
  componentWillUnmount() {
    document.body.classList.remove("bg-apma-banner");
  }
  render() {
    return (
      <div className="auth-wrapper">
        <div className="auth-inner">
          <Formik
            initialValues={{
              otp: ""
            }}
            validationSchema={Yup.object().shape({
              otp: Yup.string().required("Email is required")
            })}
            onSubmit={(formData, { setStatus, setSubmitting }) => {
              setStatus();

              setSubmitting(true);
              authenticationService.otpLogin(formData).then(
                (company) => {
                  setSubmitting(false);
                  const { from } = this.props.location.state || {
                    from: { pathname: "/apma" }
                  };
                  this.props.history.push(from);
                  //this.setState({modal:true});
                },
                (error) => {
                  setSubmitting(false);
                  setStatus(error);
                }
              );
            }}
            render={({
              errors,
              status,
              touched,
              isSubmitting,
              setFieldValue,
              values,
              handleChange
            }) => (
              <Form>
                <h3 className="text-uppercase">Sign In</h3>
                <div className="text-center">
                  <img
                    className="mb-4 px-1 py-1 apma-logo"
                    src={
                      window.location.origin + "/assets/images/apma_logo.jpg"
                    }
                    alt=""
                    width="72"
                    height="72"
                  />
                  <img
                    className="mb-4 pb-0 px-0 apma-register-logo layout-apma-logo"
                    src={
                      window.location.origin + "/assets/images/arrow-logo.jpg"
                    }
                    alt=""
                    width="50"
                    height="100"
                  />
                </div>
                <div className="form-group required">
                  <label className="control-label">OTP</label>
                  <Field
                    name="otp"
                    type="text"
                    placeholder=""
                    className={
                      "form-control" +
                      (errors.email && touched.email ? " is-invalid" : "")
                    }
                  />
                  <ErrorMessage
                    name="otp"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary btn-block"
                >
                  Submit{" "}
                  {isSubmitting && (
                    <span>
                      <i className="pi pi-spin pi-spinner"></i>
                    </span>
                  )}
                </button>

                {status && (
                  <div className={"alert alert-danger mt-2"}>{status}</div>
                )}
              </Form>
            )}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(APMAOtpSignin);
