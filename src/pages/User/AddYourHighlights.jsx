import React, { Component } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { InputMask } from "primereact/inputmask";
import Select from "react-select";
import { highlightService, authenticationService } from "../../_services";
import { Toast } from "primereact/toast";
export default class AddYourHighlights extends Component {
  state = {
    currentUser: authenticationService.currentUserValue,
  };
  render() {
    return (
      <div className="p-grid">
        <div className="p-col-12">
          <div className="card">
            <h1>Add Your Announcements</h1>
            <Formik
              initialValues={{
                highlightType: "",
                headline: "",
                otherCategory: "",
                companyId: this.state.currentUser.id,
              }}
              validationSchema={Yup.object().shape({
                headline: Yup.string().required("Headline is Required"),
                highlightType: Yup.string().required("Highlight  is Required"),
                otherCategory: Yup.string().when("highlightType", {
                  is: "other",
                  then: Yup.string().required("Other Category is Required"),
                }),
              })}
              onSubmit={(formData, { setStatus, setSubmitting }) => {
                setStatus();
                setSubmitting(true);
                highlightService
                  .addHighlight(formData)
                  .then((data) => {
                    if (data && data.Status) {
                      setSubmitting(false);
                      this.toast.show({
                        severity: "success",
                        summary: "Success",
                        detail: "Highlight Added",
                      });
                      const { from } = this.props.location.state || {
                        from: { pathname: "/highlight-history" },
                      };
                      this.props.history.push(from);
                    }
                  })
                  .catch((error) => {
                    setStatus(error.message);
                    setSubmitting(false);
                  });
              }}
              render={({
                errors,
                status,
                touched,
                isSubmitting,
                setFieldValue,
                values,
                handleChange,
                handleBlur,
              }) => (
                <Form>
                  <div className="row">
                    <div className="col-md-6 col-sm-6 col-xs-12 form-group required">
                      <label className="control-label">
                        Select suitable type of Announcements
                      </label>
                      <select
                        name="highlightType"
                        value={values.color}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={
                          "form-control" +
                          (errors.highlightType && touched.highlightType
                            ? " is-invalid"
                            : "")
                        }
                      >
                        <option value="" label="Select a suitable type" />
                        <option
                          value="Breaking news announcements"
                          label="Breaking news announcements"
                        />
                        <option
                          value="Product launches"
                          label="Product launches"
                        />
                        <option value="Partnerships" label="Partnerships" />
                        <option
                          value="Sharing research"
                          label="Sharing research"
                        />
                        <option value="Awards" label="Awards" />
                        <option
                          value="Hiring new executives"
                          label="Hiring new executives"
                        />
                        <option
                          value="Crisis management"
                          label="Crisis management"
                        />
                        <option value="other" label="Other" />
                      </select>
                      <ErrorMessage
                        name="highlightType"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>
                    {values.highlightType === "other" ? (
                      <div className="col-md-6 col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">
                          Please specify if its other then above categories
                        </label>
                        <Field
                          name="otherCategory"
                          type="text"
                          placeholder="Categrory"
                          className={
                            "form-control" +
                            (errors.otherCategory && touched.otherCategory
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="otherCategory"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                    ) : null}
                  </div>

                  <div className="my-3">
                    <h5>
                      What Information and Content Should a Release Include?
                    </h5>
                    <span>
                      Here’s what you should include in your Announcements
                      releases:
                    </span>
                  </div>

                  <div className="row">
                    <div className="col-sm-6 col-xs-12 form-group required">
                      <label className="control-label">Headline</label>
                      <Field
                        name="headline"
                        type="text"
                        placeholder="Be sure to make it clear why your story is interesting and important."
                        className={
                          "form-control" +
                          (errors.headline && touched.headline
                            ? " is-invalid"
                            : "")
                        }
                      />
                      <ErrorMessage
                        name="headline"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>
                    <div className="col-sm-6 col-xs-12 form-group required">
                      <label className="control-label">Media Contact</label>
                      <Field
                        name="pressContact"
                        type="text"
                        placeholder="How can the media get in touch with you?"
                        className={
                          "form-control" +
                          (errors.pressContact && touched.pressContact
                            ? " is-invalid"
                            : "")
                        }
                      />
                      <ErrorMessage
                        name="pressContact"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-sm-12 col-xs-12 form-group required">
                      <label className="control-label">Body</label>
                      <Field
                        name="bodyCopy"
                        type="text"
                        placeholder="Order information by level of importance."
                        component="textarea"
                        className={
                          "form-control" +
                          (errors.bodyCopy && touched.bodyCopy
                            ? " is-invalid"
                            : "")
                        }
                      />
                      <ErrorMessage
                        name="bodyCopy"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>
                    {/* <div className="col-sm-6 col-xs-12 form-group required">
                      <label className="control-label">Point of contact</label>
                      <Field
                        name="pointOfContact"
                        type="text"
                        placeholder="This should be a name and job title for who to reach."
                        className={
                          "form-control" +
                          (errors.pointOfContact && touched.pointOfContact
                            ? " is-invalid"
                            : "")
                        }
                      />
                      <ErrorMessage
                        name="pointOfContact"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div> */}
                  </div>

                  <div className="row">
                    <div className="col-sm-6 col-xs-12 form-group required">
                      <label className="control-label">Email address</label>
                      <Field
                        name="emailAddress"
                        type="text"
                        placeholder="Give them the best one to reach the preferred point of contact."
                        className={
                          "form-control" +
                          (errors.emailAddress && touched.emailAddress
                            ? " is-invalid"
                            : "")
                        }
                      />
                      <ErrorMessage
                        name="emailAddress"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>

                    <div className="col-sm-6 col-xs-12 form-group required">
                      <label className="control-label">Phone number</label>
                      <InputMask
                        mask="(999) 999-9999"
                        value={values.phoneNumber}
                        className={
                          "form-control" +
                          (errors.phoneNumber && touched.phoneNumber
                            ? " is-invalid"
                            : "")
                        }
                        placeholder="Company landline or Individual contacts"
                        onChange={(e) => setFieldValue("phoneNumber", e.value)}
                      ></InputMask>
                      <ErrorMessage
                        name="phoneNumber"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>
                  </div>

                  <div className="form-group mb-0 m-t-20">
                    <div className="col-xs-12">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary text-uppercase"
                      >
                        Save
                        {isSubmitting && (
                          <span>
                            {" "}
                            <i className="pi pi-spin pi-spinner"></i>
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                  {status && (
                    <div className={"alert alert-danger mt-2"}>{status}</div>
                  )}
                </Form>
              )}
            />
            <Toast ref={(el) => (this.toast = el)} position="top-right"></Toast>
          </div>
        </div>
      </div>
    );
  }
}
