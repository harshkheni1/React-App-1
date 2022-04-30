import React, { Component } from "react";
import { connect } from "react-redux";
import "./LoginPage.css";
import { Link } from "react-router-dom";
import { authenticationService } from "../_services/";
import PasswordMask from "react-password-mask";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
export class APMALogin extends Component {
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
              password: "",
              email: ""
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email("Invalid Email")
                .required("Email is required"),
              password: Yup.string().required("Password is required")
            })}
            onSubmit={(formData, { setStatus, setSubmitting }) => {
              setStatus();

              setSubmitting(true);
              authenticationService
                .APMAlogin(formData.email, formData.password)
                .then(
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
                    className="mb-4 pb-0 px-0 apma-logo layout-apma-logo"
                    src={
                      window.location.origin + "/assets/images/arrow-logo.jpg"
                    }
                    alt=""
                    width="72"
                    height="72"
                  />
                </div>
                <div className="form-group required">
                  <label className="control-label">Email</label>
                  <Field
                    name="email"
                    type="text"
                    placeholder="Email"
                    className={
                      "form-control" +
                      (errors.email && touched.email ? " is-invalid" : "")
                    }
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>

                <div className="form-group required">
                  <label className="control-label">Password</label>
                  <Field
                    name="password"
                    placeholder="Password"
                    autoComplete="off"
                    render={({ field }) => (
                      <PasswordMask
                        // inputStyles={{ border: "none" }}
                        buttonStyles={{
                          top: "20px",
                          backgroundColor: "transparent"
                        }}
                        //useVendorStyles={false}
                        showButtonContent={
                          <span>
                            <i className="pi pi-eye"></i>
                          </span>
                        }
                        hideButtonContent={
                          <i
                            className="pi pi-eye"
                            style={{ backgroundColor: "transparent" }}
                          ></i>
                        }
                        onChange={(password) =>
                          password === null
                            ? setFieldValue("password", "")
                            : setFieldValue("password", password)
                        }
                        {...field}
                        // className={
                        //   "form-control" +
                        //   (errors.password && touched.password
                        //     ? " is-invalid"
                        //     : "")
                        // }
                        inputClassName={
                          "form-control" +
                          (errors.password && touched.password
                            ? " is-invalid"
                            : "")
                        }
                      />
                    )}
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>

                <div className="form-group">
                  <div className="custom-control custom-checkbox">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="customCheck1"
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="customCheck1"
                    >
                      Remember me
                    </label>
                  </div>
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

                <p className="forgot-password text-right">
                  <Link to="/forgot-apma-password">Forgot Password?</Link>
                </p>
                <div>
                  <span>
                    Not Registered?{" "}
                    <Link to="/apma-signup">Create an account</Link>
                  </span>
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(APMALogin);
