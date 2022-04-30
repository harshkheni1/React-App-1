import React, { Component } from "react";
import { connect } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import swal from "sweetalert";
import { apmaService, companyService } from "../_services";

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}

class ForgotApmaPassword extends Component {
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
              email: ""
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email("Invalid-Email")
                .required("Email is required")
            })}
            onSubmit={(formData, { setStatus, setSubmitting }) => {
              setStatus();
              apmaService.forgotApmaPassword(formData).then(
                (user) => {
                  //NotificationManager.success(user.Data.Message,"", 5000);
                  swal(user.Data.Message, "", "success");
                  const { from } = this.props.location.state || {
                    from: { pathname: "/apma-login" }
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

                <div className="form-group text-center mb-0 m-t-20">
                  <div className="col-xs-12">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary btn-lg btn-block text-uppercase"
                    >
                      Send Email
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
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgotApmaPassword);
