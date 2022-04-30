import React, { Component } from "react";
import { connect } from "react-redux";
import "./LoginPage.css";
import { Formik, Field, Form, ErrorMessage } from "formik";
import PasswordMask from "react-password-mask";
import * as Yup from "yup";
import { InputMask } from "primereact/inputmask";
import { Link } from "react-router-dom";
import { companyService } from "../_services";
export class RegistrationPage extends Component {
  componentDidMount() {
    document.body.classList.add("bg-banner");
  }
  componentWillUnmount() {
    document.body.classList.remove("bg-banner");
  }
  render() {
    return (
      <div className="p-2">
        <div className="row">
          <div className="offset-md-3 col-md-6">
            <div className="registration-box px-3 py-3 mt-4 mb-4">
              <Formik
                initialValues={{
                  companyTitle: "",
                  password: "",
                  confirmPassword: "",
                  email: "",
                  industry: ""
                }}
                validationSchema={Yup.object().shape({
                  email: Yup.string().required("Email is required"),
                  password: Yup.string().when({
                    is: (val) => (val && val.length > 0 ? true : false),
                    then: Yup.string().when({
                      is: (inVal) => (inVal && inVal.length > 0 ? true : false),
                      then: Yup.string()
                        .matches(
                          /^(?=.*[a-z])(?=.*[A-Z])/,
                          "Must have both uppercase and lowercase letters"
                        )
                        .matches(/^(?=.*[0-9])/, "Must consist of a number")
                        .matches(
                          /^(?=.{8,})/,
                          "Must be atleast 8 character long"
                        )
                        .required("Password is required")
                    }),
                    otherwise: Yup.string()
                      .matches(
                        /^(?=.*[a-z])(?=.*[A-Z])/,
                        "Must have both uppercase and lowercase letters"
                      )
                      .matches(/^(?=.*[0-9])/, "Must consist of a number")
                      .matches(/^(?=.{8,})/, "Must be atleast 8 character long")
                      .required("Password is required")
                  }),
                  confirmPassword: Yup.string().when("password", {
                    is: (val) => (val && val.length > 0 ? true : false),
                    then: Yup.string()
                      .oneOf([Yup.ref("password")], "Must be same as Password")
                      .required("Confirm Password is required")
                  }),
                  companyTitle: Yup.string().required(
                    "Company Title is required"
                  )
                  // industry: Yup.string().required("Industry is required")
                })}
                onSubmit={(formData, { setStatus, setSubmitting }) => {
                  setStatus();
                  companyService.register(formData).then(
                    (company) => {
                      setSubmitting(false);
                      const { from } = this.props.location.state || {
                        from: { pathname: "/login" }
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
                    <h3 className="text-uppercase">Sign UP</h3>
                    <div className="text-center">
                      <img
                        className="mb-4 px-3 pt-3 weedc-logo-register"
                        src={
                          window.location.origin +
                          "/assets/images/weedc_new_logo.svg"
                        }
                        alt=""
                        width="90"
                        height="90"
                      />
                    </div>
                    <div className="form-group required">
                      <label className="control-label">Company Name</label>
                      <Field
                        name="companyTitle"
                        type="text"
                        placeholder="Company Name"
                        className={
                          "form-control" +
                          (errors.companyTitle && touched.companyTitle
                            ? " is-invalid"
                            : "")
                        }
                      />
                      <ErrorMessage
                        name="companyTitle"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>
                    {/* <div className="form-group required">
                      <label className="control-label">Company Industry</label>
                      <Field
                        name="industry"
                        type="text"
                        placeholder="Company Industry"
                        className={
                          "form-control" +
                          (errors.industry && touched.industry
                            ? " is-invalid"
                            : "")
                        }
                      />
                      <ErrorMessage
                        name="industry"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div> */}

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
                    <div className="form-group required">
                      <label className="control-label">Confirm Password</label>
                      <Field
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        autoComplete="off"
                        render={({ field }) => (
                          <PasswordMask
                            buttonStyles={{
                              top: "20px",
                              backgroundColor: "transparent"
                            }}
                            showButtonContent={
                              <i
                                className="pi pi-eye"
                                style={{
                                  color: "#ccc",
                                  backgroundColor: "transparent"
                                }}
                              ></i>
                            }
                            hideButtonContent={
                              <i
                                className="pi pi-eye"
                                style={{ backgroundColor: "transparent" }}
                              ></i>
                            }
                            onChange={(confirmPassword) =>
                              confirmPassword === null
                                ? setFieldValue("confirmPassword", "")
                                : setFieldValue(
                                    "confirmPassword",
                                    confirmPassword
                                  )
                            }
                            {...field}
                            // className={
                            //   "form-control" +
                            //   (errors.confirmPassword && touched.confirmPassword
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
                        name="confirmPassword"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>

                    <div className="form-group text-center mb-0 m-t-20">
                      <div className="col-xs-12">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="btn btn-primary btn-lg btn-block text-uppercase"
                        >
                          Submit
                        </button>
                        {isSubmitting && (
                          <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                        )}
                      </div>
                    </div>

                    {status && (
                      <div className={"alert alert-danger mt-2"}>{status}</div>
                    )}
                    <div className="mt-2">
                      <span>
                        Already have an account?{" "}
                        <Link to="/login">Sign in</Link>
                      </span>
                    </div>
                  </Form>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationPage);
