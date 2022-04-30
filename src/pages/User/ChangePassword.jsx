import { Component } from "react";
import React from "react";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import { connect } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import PasswordMask from "react-password-mask";
import { authenticationService } from "../../_services";
import { companyService } from "../../_services/company.service";

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {}
class ChangePassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      profileCompletionPercent: 0,
      activeIndex: 0,
      currentUser: authenticationService.currentUserValue,
      companyData: {},
      isDemographicsComplete: false,
      isContactDetailsComplete: false,
      isAboutResourcesComplete: false,
      isAboutBusinessesComplete: false,
      isAboutOpportunitiesComplete: false,
      url: "",
      fileUploadModal: false,
      uploadProgress: 0,
      companyFiles: [],
      audioModal: false,
      videoModal: false
    };
  }

  render() {
    //const items = [{ label: "Change Password" }];
    //const home = { icon: "pi pi-home", url: "/aboutus" };

    return (
      <>
        <Formik
          enableReinitialize={true}
          initialValues={{
            currentpassword: "",
            newpassword: "",
            confirmpassword: "",
            companyId: this.state.currentUser.id
          }}
          validationSchema={Yup.object().shape({
            currentpassword: Yup.string().required(
              "Current password is required"
            ),
            // newpassword: Yup.string().required('New password is required'),
            newpassword: Yup.string()
              .matches(
                /^(?=.*[a-z])(?=.*[A-Z])/,
                "Must have both uppercase and lowercase letters"
              )
              .matches(/^(?=.*[0-9])/, "Must consist of a number")
              .matches(/^(?=.{8,})/, "Must be atleast 8 character long")
              .required("Password is required")
              .when("currentpassword", {
                is: (val) => (val && val.length > 0 ? true : false),
                then: Yup.string().notOneOf(
                  [Yup.ref("currentpassword")],
                  "Current Password and New Password cannot be same"
                )
              }),
            // confirmpassword: Yup.string().required('Confirm password is required'),
            confirmpassword: Yup.string()
              .required("Confirm password is required")
              .when("newpassword", {
                is: (val) => (val && val.length > 0 ? true : false),
                then: Yup.string().oneOf(
                  [Yup.ref("newpassword")],
                  "Both password need to be the same"
                )
              })
          })}
          onSubmit={(formData, { setStatus, setSubmitting }) => {
            setStatus();
            companyService.changePassword(formData).then(
              (user) => {
                //NotificationManager.success(user.Data.Message,"", 5000);
                swal(user.Data.Message, "", "success");
                const { from } = this.props.location.state || {
                  from: { pathname: "/aboutus" }
                };
                this.props.history.push(from);
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
            setFieldValue
          }) => (
            <Form>
              <div className="p-grid p-justify-center">
                <div className="col-sm-6 col-xs-12">
                  <div className="card">
                    <div className="col-md-12">
                      <div className="form-group required">
                        <label className="control-label">Password</label>
                        <Field
                          name="currentpassword"
                          placeholder="Password"
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
                                  ? setFieldValue("currentpassword", "")
                                  : setFieldValue("currentpassword", password)
                              }
                              {...field}
                              inputClassName={
                                "form-control" +
                                (errors.currentpassword &&
                                touched.currentpassword
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                          )}
                        />
                        <ErrorMessage
                          name="currentpassword"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      <div className="form-group required">
                        <label className="control-label">New Password</label>
                        <Field
                          name="newpassword"
                          placeholder="newpassword"
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
                                  ? setFieldValue("newpassword", "")
                                  : setFieldValue("newpassword", password)
                              }
                              {...field}
                              inputClassName={
                                "form-control" +
                                (errors.newpassword && touched.newpassword
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                          )}
                        />
                        <ErrorMessage
                          name="newpassword"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      <div className="form-group required">
                        <label className="control-label">
                          Confirm Password
                        </label>
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
                                (errors.confirmpassword &&
                                touched.confirmpassword
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
                    </div>
                  </div>
                  <div>
                    <div className="row p-grid p-formgrid p-fluid">
                      <div className="col-md-6 p-mb-2  p-lg-6  p-mb-lg-0">
                        <Link
                          to="/aboutus"
                          className="btn btn-outline-secondary mr-2 btn-block"
                        >
                          Cancel
                        </Link>
                      </div>
                      <div className=" col-md-6 p-mb-2 p-lg-6 p-mb-lg-0">
                        {" "}
                        <div className="border-0 accordionfooter text-right">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-primary btn-block"
                          >
                            {" "}
                            Change Password{" "}
                          </button>
                          {isSubmitting && (
                            <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {status && (
                    <div className={"alert alert-danger"}>{status}</div>
                  )}
                </div>
              </div>
            </Form>
          )}
        />
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
