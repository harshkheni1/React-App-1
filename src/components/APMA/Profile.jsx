import React, { Component } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { InputMask } from "primereact/inputmask";
import swal from "sweetalert";
import moment from "moment";
import { apmaService, authenticationService } from "../../_services";
import { isFormCompleted } from "../../_helpers/_helperFunctions";
import axios from "axios";
import config from "../../config";
export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: authenticationService.currentUserValue,
      apmaProfile: {}
    };
  }

  componentDidMount() {
    // this.state.currentUser.id &&
    //   apmaService.getApmaProfileById(this.state.currentUser.id).then((data) => {
    //     let apmaProfile = data.Data;
    //     console.log("apmaProfile: ", apmaProfile);
    //     this.setState({ apmaProfile });
    //     let isProfileCompleted = isFormCompleted(
    //       {
    //         fullLegalName: apmaProfile.fullLegalName,
    //         companyAddress: apmaProfile.companyAddress,
    //         businessWebsite: apmaProfile.businessWebsite,
    //         contactPerson: apmaProfile.contactPerson,
    //         position: apmaProfile.position,
    //         phoneNumber: apmaProfile.phoneNumber,
    //         mobileNumber: apmaProfile.mobileNumber,
    //         profileEmail: apmaProfile.profileEmail
    //       },
    //       8
    //     );
    //     console.log("isProfileCompleted: ", isProfileCompleted);
    //     this.props.setProfileStatus(isProfileCompleted);
    //   });
  }

  changeProfilepic(event) {
    // dataDispatch({ type: 'photoLoader', payload: true })
    // console.log(event.target.files)
    let selectedProfile = event.target.files;
    // console.log('the file object', selectedProfile[0])
    // setProfilepic(event.target.files)

    axios
      .post(
        `${config.apiUrl}/api/v1/apma/files/upload`,
        {
          fileName: "apma-logos/" + selectedProfile[0].name,
          fileType: selectedProfile[0].type
        },
        {
          headers: {
            Authorization: `Bearer ${this.state.currentUser.token}`,
            isenc: localStorage.getItem("isenc")
              ? parseInt(localStorage.getItem("isenc"))
              : 0
          }
        }
      )
      .then((response) => {
        var returnData = response.data.Data;
        var signedRequest = returnData.signedRequest;
        var url = returnData.url;
        // this.setState({ url: url });
        // console.log("Recieved a signed request " + signedRequest);
        // Put the fileType in the headers for the upload
        var options = {
          headers: {
            "Content-Type": selectedProfile[0].type
          }
        };
        axios
          .put(signedRequest, selectedProfile[0], options)
          .then((result) => {
            // console.log("Response from s3", result);
            this.setState({ success: true, imageLoading: false });
          })
          .catch((error) => {
            alert("ERROR " + JSON.stringify(error));
          });
        apmaService
          .updateLogo(this.state.currentUser.id, {
            logoUrl: url
          })
          .then((r) => {
            this.props.getApmaProfile();
            authenticationService.refreshApmaProfileImage(url);
          });
      })
      .catch((error) => {
        alert(JSON.stringify(error));
      });
  }

  render() {
    const { apmaProfile } = this.props;
    return (
      <div className="pt-3">
        <Formik
          enableReinitialize={true}
          initialValues={{
            fullLegalName: apmaProfile.fullLegalName
              ? apmaProfile.fullLegalName
              : apmaProfile.companyTitle || "",
            industry: apmaProfile.industry || "",
            companyAddress: apmaProfile.companyAddress || "",
            businessWebsite: apmaProfile.businessWebsite || "",
            contactPerson: apmaProfile.contactPerson || "",
            position: apmaProfile.position || "",
            phoneNumber: apmaProfile.phoneNumber || "",
            mobileNumber: apmaProfile.mobileNumber || "",
            profileEmail: apmaProfile.profileEmail || ""
          }}
          validationSchema={Yup.object().shape({
            companyAddress: Yup.string().required(
              "Company Address is required"
            ),
            industry: Yup.string().required(
              "Company Industry/Sector is required"
            ),
            businessWebsite: Yup.string().required(
              "Business Website is required"
            ),
            contactPerson: Yup.string().required("Contact Person is required"),
            position: Yup.string().required("Position is required"),
            phoneNumber: Yup.string().required("Phone Number is required"),
            mobileNumber: Yup.string().required("Mobile Number is required"),
            profileEmail: Yup.string()
              .required("Email is required")
              .email("Invalid Email")
          })}
          onSubmit={(formData, { setStatus, setSubmitting, resetForm }) => {
            setSubmitting(true);
            apmaService
              .saveApmaProfile(formData, this.state.currentUser.id)
              .then((apmaProfile) => {
                setSubmitting(false);
                swal("Profile Saved Successfully!", "", "success");
                this.props.getApmaProfile();
              })
              .catch((error) => {
                setSubmitting(false);
                setStatus(error);
              });
          }}
        >
          {({
            errors,
            status,
            touched,
            isSubmitting,
            setFieldValue,
            values,
            handleChange,
            handleBlur
          }) => {
            return (
              <Form>
                <div className="offset-md-3 col-md-6 text-center">
                  <div className="mb-2">
                    <span>Company Logo</span>
                  </div>
                  <img
                    src={
                      apmaProfile.companyLogo
                        ? apmaProfile.companyLogo
                        : "/assets/images/logo-16.svg"
                    }
                    className="img-fluid apma-profile-logo"
                    alt="logo"
                  />
                  <div className="mt-2">
                    <label className="custom-logo-upload">
                      <input
                        type="file"
                        onChange={(e) => {
                          this.changeProfilepic(e);
                        }}
                      />
                      Change Logo
                    </label>
                  </div>
                </div>
                <div className="form-group required">
                  <label className="control-label">Full Legal Name</label>
                  <Field
                    name="fullLegalName"
                    type="text"
                    placeholder="Full Legal Name"
                    className={
                      "form-control" +
                      (errors.fullLegalName && touched.fullLegalName
                        ? " is-invalid"
                        : "")
                    }
                  />
                  <ErrorMessage
                    name="fullLegalName"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>

                <div className="form-group required">
                  <label className="control-label">
                    Company Industry/Sector
                  </label>
                  <Field
                    name="industry"
                    type="text"
                    placeholder="Company Industry/Sector"
                    className={
                      "form-control" +
                      (errors.industry && touched.industry ? " is-invalid" : "")
                    }
                  />
                  <ErrorMessage
                    name="industry"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>

                <div className="form-group required">
                  <label className="control-label">Company Address</label>
                  <Field
                    name="companyAddress"
                    type="text"
                    placeholder="Company Address"
                    className={
                      "form-control" +
                      (errors.companyAddress && touched.companyAddress
                        ? " is-invalid"
                        : "")
                    }
                  />
                  <ErrorMessage
                    name="companyAddress"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>

                <div className="form-group required">
                  <label className="control-label">Business Website</label>
                  <Field
                    name="businessWebsite"
                    type="text"
                    placeholder="Business Website"
                    className={
                      "form-control" +
                      (errors.businessWebsite && touched.businessWebsite
                        ? " is-invalid"
                        : "")
                    }
                  />
                  <ErrorMessage
                    name="businessWebsite"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>

                <div className="form-group required">
                  <label className="control-label">Contact Person</label>
                  <Field
                    name="contactPerson"
                    type="text"
                    placeholder="Contact Person"
                    className={
                      "form-control" +
                      (errors.contactPerson && touched.contactPerson
                        ? " is-invalid"
                        : "")
                    }
                  />
                  <ErrorMessage
                    name="contactPerson"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>

                <div className="form-group required">
                  <label className="control-label">Position</label>
                  <Field
                    name="position"
                    type="text"
                    placeholder="Position"
                    className={
                      "form-control" +
                      (errors.position && touched.position ? " is-invalid" : "")
                    }
                  />
                  <ErrorMessage
                    name="position"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>

                <div className="form-group required">
                  <label className="control-label">Phone Number</label>
                  <InputMask
                    mask="(999) 999-9999"
                    value={values.phoneNumber}
                    className={
                      "form-control" +
                      (errors.phoneNumber && touched.phoneNumber
                        ? " is-invalid"
                        : "")
                    }
                    onChange={(e) => setFieldValue("phoneNumber", e.value)}
                  ></InputMask>
                  <ErrorMessage
                    name="phoneNumber"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>

                <div className="form-group required">
                  <label className="control-label">Mobile Number</label>
                  <InputMask
                    mask="(999) 999-9999"
                    value={values.mobileNumber}
                    className={
                      "form-control" +
                      (errors.mobileNumber && touched.mobileNumber
                        ? " is-invalid"
                        : "")
                    }
                    onChange={(e) => setFieldValue("mobileNumber", e.value)}
                  ></InputMask>
                  <ErrorMessage
                    name="mobileNumber"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>

                <div className="form-group required">
                  <label className="control-label">Email</label>
                  <Field
                    name="profileEmail"
                    type="text"
                    placeholder="Email"
                    className={
                      "form-control" +
                      (errors.profileEmail && touched.profileEmail
                        ? " is-invalid"
                        : "")
                    }
                  />
                  <ErrorMessage
                    name="profileEmail"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>
                <div className="row">
                  <div className="offset-md-3 col-md-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary btn-lg btn-block text-uppercase"
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

                  {apmaProfile.updatedAt ? (
                    <div className="col-md-3 d-flex align-items-center justify-content-center">
                      Latest Update:{" "}
                      {moment(apmaProfile.updatedAt).format(
                        "MM/DD/YYYY hh:mm a"
                      )}
                    </div>
                  ) : null}
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    );
  }
}
