import React, { Component } from "react";
import { connect } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import swal from "sweetalert";
import { apmaService, companyService } from "../_services";
import PasswordMask from "react-password-mask";

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}

class ResetApmaPassword extends Component {
  componentDidMount() {
    document.body.classList.add("bg-apma-banner");
  }
  componentWillUnmount() {
    document.body.classList.remove("bg-apma-banner");
  }
  render() {
    return (
      <React.Fragment>
        <div className="auth-wrapper">
          <div className="auth-inner">
            <Formik
              initialValues={{
                password: "",
                confirmpassword: ""
              }}
              validationSchema={Yup.object().shape({
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
                      .matches(/^(?=.{8,})/, "Must be atleast 8 character long")
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
                confirmpassword: Yup.string().when("password", {
                  is: (val) => (val && val.length > 0 ? true : false),
                  then: Yup.string()
                    .oneOf([Yup.ref("password")], "Must be same as Password")
                    .required("Confirm Password is required")
                })
              })}
              onSubmit={(formData, { setStatus, setSubmitting }) => {
                setStatus();

                apmaService
                  .setApmaPassword(formData, this.props.match.params.token)
                  .then(
                    (result) => {
                      setSubmitting(false);

                      //NotificationManager.success(user.Data.Message,"", 5000);
                      if (result.Status) {
                        swal(result.Data.Message, "", "success");
                        const { from } = this.props.location.state || {
                          from: { pathname: "/apma-login" }
                        };
                        this.props.history.push(from);
                      } else {
                        swal(result.Data.Message, "", "error");
                      }
                    },
                    (error) => {
                      setSubmitting(false);
                      setStatus(error);
                    }
                  )
                  .catch((error) => {
                    console.log("error: ", error);
                    setSubmitting(false);
                    setStatus(error);
                  });
              }}
              render={({
                errors,
                status,
                touched,
                isSubmitting,
                setFieldValue
              }) => (
                <Form>
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
                  <h3 className="text-uppercase">Recover Password</h3>

                  <div className="form-group required">
                    <label className="control-label">Password</label>
                    <Field
                      name="password"
                      placeholder="password"
                      autoComplete="off"
                      render={({ field }) => (
                        <PasswordMask
                          // inputStyles={{ border: "none" }}
                          buttonStyles={{
                            top: "20px",
                            backgroundColor: "transparent"
                          }}
                          // useVendorStyles={false}
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
                      name="confirmpassword"
                      placeholder="confirmpassword"
                      autoComplete="off"
                      render={({ field }) => (
                        <PasswordMask
                          //inputStyles={{ border: "none" }}
                          buttonStyles={{
                            top: "20px",
                            backgroundColor: "transparent"
                          }}
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
                              ? setFieldValue("confirmpassword", "")
                              : setFieldValue("confirmpassword", password)
                          }
                          {...field}
                          inputClassName={
                            "form-control" +
                            (errors.confirmpassword && touched.confirmpassword
                              ? " is-invalid"
                              : "")
                          }
                        />
                      )}
                    />
                    <ErrorMessage
                      name="confirmpassword"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>

                  <div className="form-group text-center mb-0 m-t-20">
                    <div className="col-xs-12">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary btn-lg btn-block text-uppercase waves-effect waves-light"
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
                </Form>
              )}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetApmaPassword);
