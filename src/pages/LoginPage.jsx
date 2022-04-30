import React, { Component } from "react";
import { connect } from "react-redux";
import "./LoginPage.css";
import { Link } from "react-router-dom";
import { authenticationService } from "../_services/";
import PasswordMask from "react-password-mask";
import { Formik, Field, Form, ErrorMessage } from "formik";
import ReCAPTCHA from "react-google-recaptcha";
import * as Yup from "yup";
export class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: ""
    };
  }
  componentDidMount() {
    document.body.classList.add("bg-banner");
  }
  componentWillUnmount() {
    document.body.classList.remove("bg-banner");
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
              email: Yup.string().required("Email is required"),
              password: Yup.string().required("Password is required")
            })}
            onSubmit={(formData, { setStatus, setSubmitting }) => {
              setStatus();

              setSubmitting(true);
              authenticationService
                .login(formData.email, formData.password, formData.captchaValue)
                .then(
                  (company) => {
                    setSubmitting(false);
                    const { from } = this.props.location.state || {
                      from: { pathname: "/aboutus" }
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
                  <Link to="/">
                    {" "}
                    <img
                      className="mb-4 px-3 pt-3 weedc-logo"
                      src={
                        window.location.origin +
                        "/assets/images/weedc_new_logo.svg"
                      }
                      alt=""
                      width="90"
                      height="90"
                    />
                  </Link>
                </div>
                <div className="form-group required">
                  <label className="control-label">Email</label>
                  <Field
                    name="email"
                    type="text"
                    placeholder="Email"
                    onBlur={(e) => {
                      this.setState({ email: e.target.value });
                    }}
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

                <ReCAPTCHA
                  sitekey="6LdCdCcaAAAAAAK2m__qSQQDyZdvoBVpptXo3v-O"
                  onChange={(value) => setFieldValue("captchaValue", value)}
                />
                <br></br>

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
                  <a href={`/forgot-password?email=${this.state.email}`}>
                    Forgot password?
                  </a>
                </p>
                <div>
                  <span>
                    Not Registered?{" "}
                    <Link to="/register">Create an account</Link>
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
