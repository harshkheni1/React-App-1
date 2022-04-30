import React, { Component } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import swal from "sweetalert";
//import ODatePicker from "../ODatePicker";
import OImageCanvas from "../OImageCanvas";
import OIFileUpload from "../OFileUpload";
import moment from "moment";
import { Calendar } from "primereact/calendar";
import { CustomTextField } from "../CustomTextField";
import { authenticationService, formService } from "../../_services";
import classNames from "classnames";
export default class MutualNDA extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: authenticationService.currentUserValue,
      mutualNDA: {},
      AIPRINT_MODE: false,
      editMode: true,
      setMutualNDAStatus: false,
      isClientSigPresent: true
    };
  }

  componentDidMount() {
    this.getMutualNDAProfileById();
  }

  getMutualNDAProfileById = () => {
    this.state.currentUser.id &&
      formService
        .getMutualNDAProfileById(this.state.currentUser.id)
        .then((data) => {
          this.setState({ mutualNDA: data.Data });
          this.props.setMutualNDAStatus(data.Data.isCompleted);
        });
  };

  print() {
    window.print();
  }

  isClientSignaturePresent(values, initialValues) {
    let obj = values.signature1EPSignType ? values : initialValues;
    const checkArray = (arr) => {
      return arr.length ? arr.includes("Yes") : false;
    };

    switch (obj.signature1EPSignType) {
      case 1:
        return checkArray(obj.signature1EPSignAgree);
      case 2:
        return !!obj.signature1EPFileSketch;
      case 3:
        return !!obj.signature1EPFilePrint;
      default:
        return false;
    }
  }

  render() {
    const { editMode } = this.state;
    return (
      <Formik
        enableReinitialize={true}
        initialValues={{
          day: this.state.mutualNDA.day
            ? this.state.mutualNDA.day
            : moment().format("DD"),
          month: this.state.mutualNDA.month
            ? this.state.mutualNDA.month
            : moment().format("MMMM"),
          recipient1: this.state.mutualNDA.recipient1 || "",
          day2: this.state.mutualNDA.day2
            ? this.state.mutualNDA.day2
            : moment().format("DD"),
          month2: this.state.mutualNDA.month2
            ? this.state.mutualNDA.month2
            : moment().format("MMMM"),
          witness1: this.state.mutualNDA.witness1 || "",
          witness_recipient1: this.state.mutualNDA.witness_recipient1 || "",
          signature1: this.state.mutualNDA.signature1 || "",
          name1: this.state.mutualNDA.name1 || "",
          title1: this.state.mutualNDA.title1 || "",
          witness2: this.state.mutualNDA.witness2 || "",
          witness_recipient2:
            "Automotive Parts Manufacturers’ Association (APMA)",
          signature2: this.state.mutualNDA.signature2 || "",
          name2: "Flavio Volpe",
          title2: "President",
          apmaCompanyId: this.state.currentUser.id,
          mutualNDAId: this.state.mutualNDA._id || null,

          AIPRINT_MODE: false,
          signature1EPSignType:
            this?.state?.mutualNDA?.signature1EPSignType || "",
          signature1EPSignAgreeTime:
            this?.state?.mutualNDA?.signature1EPSignAgreeTime || "",
          signature1EPSignAgree: this?.state?.mutualNDA?.signature1EPSignAgree
            ? [this?.state?.mutualNDA?.signature1EPSignAgree]
            : [],
          signature1EPFileSketch:
            this?.state?.mutualNDA?.signature1EPFileSketch || "",
          signature1EPFilePrint:
            this?.state?.mutualNDA?.signature1EPFilePrint || "",
          signature1EPSignDate: this.state.mutualNDA?.signature1EPSignDate
            ? moment
                .utc(parseInt(this.state.mutualNDA.signature1EPSignDate))
                .format("YYYY-MM-DD")
            : "",
          signature2EPSignType: "1",
          signature2EPSignAgreeTime:
            this?.state?.mutualNDA?.signature2EPSignAgreeTime ||
            new Date().getTime(),
          signature2EPSignAgree: this?.state?.mutualNDA?.signature2EPSignAgree
            ? [this?.state?.mutualNDA?.signature2EPSignAgree]
            : ["Yes"],
          signature2EPFileSketch:
            this?.state?.mutualNDA?.signature2EPFileSketch || "",
          signature2EPFilePrint:
            this?.state?.mutualNDA?.signature2EPFilePrint || "",
          signature2EPSignDate: this.state.mutualNDA?.signature2EPSignDate
            ? moment
                .utc(parseInt(this.state.mutualNDA.signature2EPSignDate))
                .format("YYYY-MM-DD")
            : ""
        }}
        validationSchema={Yup.object().shape({})}
        onSubmit={(formData, { setStatus, setSubmitting, resetForm }) => {
          let requestData = {
            ...formData,
            signature1EPSignAgree: formData.signature1EPSignAgree
              ? formData.signature1EPSignAgree[0]
              : "",

            signature2EPSignAgree: formData.signature2EPSignAgree
              ? formData.signature2EPSignAgree[0]
              : ""
          };

          if (requestData.day === "") {
            swal("Date is Required", "", "error");
            setSubmitting(false);
            return;
          }
          if (requestData.month === "") {
            swal("Month is Required", "", "error");
            setSubmitting(false);
            return;
          }

          if (requestData.recipient1 === "") {
            swal("Recipient is Required", "", "error");
            setSubmitting(false);
            return;
          }
          if (requestData.day2 === "") {
            swal("Date is Required", "", "error");
            setSubmitting(false);
            return;
          }

          if (requestData.month2 === "") {
            swal("Month is Required", "", "error");
            setSubmitting(false);
            return;
          }

          if (requestData.witness_recipient1 === "") {
            swal("Witness Recipient is Required", "", "error");
            setSubmitting(false);
            return;
          }
          if (requestData.title1 === "") {
            swal("Title is Required", "", "error");
            setSubmitting(false);
            return;
          }

          if (requestData.name1 === "") {
            swal("Name is Required", "", "error");
            setSubmitting(false);
            return;
          }

          if (!this.isClientSignaturePresent(formData, {})) {
            swal("Signature is Required", "", "error");
            setSubmitting(false);
            return;
          }

          setSubmitting(true);
          formService
            .saveMutualNDA(requestData)
            .then((mutualNDA) => {
              setSubmitting(false);
              swal("Mutual NDA Saved Successfully!", "", "success");
              this.getMutualNDAProfileById();
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
          handleBlur,
          handleReset,
          handleSubmit,
          initialValues
        }) => {
          return (
            <form
              onReset={handleReset}
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className="pt-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="mt-4">
                    <img
                      className="mb-4 apma-form-logo"
                      src={
                        window.location.origin + "/assets/images/apma_logo.jpg"
                      }
                    ></img>
                  </div>
                  <div>
                    <div className="text-right mb-2">
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          this.setState({ editMode: !editMode });
                        }}
                      >
                        {editMode ? "View" : "Edit"}
                      </button>
                      {!editMode && (
                        <button
                          className="btn btn-primary ml-2"
                          onClick={() => this.print()}
                        >
                          Print
                        </button>
                      )}
                    </div>
                    {this.state.mutualNDA.updatedAt ? (
                      <div className="">
                        Latest Update:{" "}
                        {moment(this.state.mutualNDA.updatedAt).format(
                          "MM/DD/YYYY hh:mm a"
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>

                <h3 className="text-center">MUTUAL NON-DISCLOSURE AGREEMENT</h3>
                <p>
                  THIS NON-DISCLOSURE AGREEMENT (the “Agreement”) is entered
                  into and is effective as of the
                  <Field
                    name="day"
                    //type="text"
                    component={CustomTextField}
                    isEdit={editMode}
                    className="apma-input mx-1"
                  />{" "}
                  day of{" "}
                  <Field
                    name="month"
                    component={CustomTextField}
                    isEdit={editMode}
                    className="apma-input mx-1"
                  />
                  2021 by and between
                </p>
                <div className="text-center">
                  <Field
                    name="recipient1"
                    component={CustomTextField}
                    isEdit={editMode}
                    className="apma-input mx-1"
                  />
                  <p>(hereinafter “RECIPIENT 1”)</p>
                  <br />
                  and
                  <br />
                  <p className="mt-2">
                    <strong>
                      Automotive Parts Manufacturers’ Association (APMA){" "}
                    </strong>
                    (hereinafter “RECIPIENT 2”)
                  </p>
                </div>
                <p>
                  WHEREAS RECIPIENT 1 and RECIPIENT 2 shall be known as the
                  “RECIPIENTS” for the purpose of this Agreement,
                </p>
                <p>
                  AND WHEREAS the RECIPIENTS are in ownership and possession of
                  certain Confidential Information (hereinafter “Confidential
                  Information”),
                </p>
                <p>
                  AND WHEREAS the RECIPIENTS wish to investigate the possibility
                  of entering a future business relationship for the purpose of
                  participating in the APMA’s Project Arrow.
                </p>
                <p>
                  NOW THEREFORE THIS AGREEMENT WITNESSETH that in consideration
                  of the RECIPIENTS disclosing the Confidential Information to
                  each other and the mutual covenants and other good and
                  valuable consideration, the receipt and sufficiency of which
                  is hereby acknowledged, the RECIPIENTS both mutually hereto
                  covenants, undertakes and agrees with as follows:
                </p>
                <div>
                  <h5>
                    <strong>1.0 Definition of Confidential Information</strong>
                  </h5>
                  <div className="contentText">
                    <span className="inlineBlock">1.1 </span>
                    <p className="px-3 inlineBlock pb-4">
                      In this Agreement “the Confidential Information” means
                      information relating to the products, services, ideas,
                      business, personnel, trademarks, copyrights, intellectual
                      property or commercial activities of the RECIPIENTS,
                      including but not limited to that information disclosed by
                      the RECIPIENTS to each other regarding the RECIPIENTS’
                      services, and other information learned by the RECIPIENTS
                      from each other’s employees, agents or through each
                      other’s documentation, that relates to the RECIPIENTS
                      products, designs, business plans, business opportunities,
                      finances, research, development, know-how, personnel, or
                      third-party confidential information disclosed to
                      Recipient by the RECIPIENTS, the terms and conditions of
                      this Agreement, and the existence of the discussions
                      between RECIPIENT 1 and RECIPIENT 2 will be referred to
                      collectively in this Agreement as “Confidential
                      Information”. Confidential Information, however, does not
                      include information that:
                    </p>
                    <div className="pl-5">
                      <p>
                        (a) is now or subsequently becomes generally available
                        to the public through no fault or breach on the part of
                        the RECIPIENTS;
                      </p>
                      <p>
                        (b) the RECIPIENTS can demonstrate to have had
                        rightfully in its possession prior to disclosure either
                        of the RECIPIENTS;
                      </p>
                      <p>
                        (c) is independently developed by the RECIPIENTS without
                        the use of any Confidential Information, or
                      </p>
                      <p>
                        (d) the RECIPIENTS rightfully obtain from a third party
                        who has the right to transfer or disclose it.
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h5>
                    <strong>
                      2.0 Non-disclosure and Non-use of Confidential Information
                    </strong>
                  </h5>
                  <div className="contentText">
                    <span className="inlineBlock">2.1</span>
                    <p className="px-3 inlineBlock pb-4">
                      The RECIPIENTS will not disclose, publish or disseminate
                      Confidential Information to anyone other than those of its
                      employees with a need to know and the RECIPIENTS both
                      agree to take reasonable precautions to prevent any
                      unauthorized use, disclosure, publication or dissemination
                      of Confidential Information.
                    </p>
                  </div>
                  <div className="contentText">
                    <span className="inlineBlock">2.2</span>
                    <p className="px-3 inlineBlock pb-4">
                      The RECIPIENTS agree to accept Confidential Information
                      for the sole purpose of evaluation in connection with
                      business discussions with between the RECIPIENTS.
                    </p>
                  </div>
                  <div className="contentText">
                    <span className="inlineBlock">2.3</span>
                    <p className="px-3 inlineBlock pb-4">
                      The RECIPIENTS agree not to use Confidential Information
                      otherwise for its own or any third party’s benefit without
                      the prior written approval of an authorized representative
                      of either of the RECIPIENTS in each instance.
                    </p>
                  </div>
                </div>
                <div>
                  <h5>
                    <strong>3.0 Exclusive Dealing</strong>
                  </h5>
                  <div className="contentText">
                    <span className="inlineBlock">3.1</span>
                    <p className="px-3 inlineBlock pb-4">
                      The RECIPIENTS agree to exclusively deal with the
                      respective Owners in all matters dealing with the
                      financing, marketing, selling, or otherwise commercially
                      exploiting the Confidential Information.
                    </p>
                  </div>
                </div>
                <div>
                  <h5>
                    <strong>4.0 Ownership of Confidential Information</strong>
                  </h5>
                  <div className="contentText">
                    <span className="inlineBlock">4.1</span>
                    <p className="px-3 inlineBlock pb-4">
                      The RECIPIENTS acknowledges and agree that the
                      Confidential Information that is disclosed to it by the
                      RECIPIENTS, or that it acquires, sees, or learns of as a
                      direct or indirect consequence of the discussions
                      contemplated herein, and all dealings and transactions
                      that follow or result from such discussion(s), are the
                      exclusive property of the RECIPIENTS respectively, and the
                      RECIPIENTS will keep that information strictly
                      confidential, as a fiduciary.
                    </p>
                  </div>
                  <div className="contentText">
                    <span className="inlineBlock">4.2</span>
                    <p className="px-3 inlineBlock pb-4">
                      The RECIPIENTS acknowledge and agrees that it shall not
                      acquire any right or interest in the Confidential
                      Information and that the RECIPIENTS shall remain the sole
                      owner of its Confidential Information including, but not
                      limited to all patent, copyright, trademark, trade secret,
                      trade name, contract, industrial design, and other
                      property rights pertaining thereto, anywhere in the world.
                      The RECIPIENTS shall not manufacture, use, sell, or
                      distribute the Confidential Information without the
                      written permission of the RECIPIENTS.
                    </p>
                  </div>
                </div>
                <div>
                  <h5>
                    <strong>5.0 General</strong>
                  </h5>
                  <div className="contentText">
                    <span className="inlineBlock">5.1</span>
                    <p className="px-3 inlineBlock pb-4">
                      Within ten business days of receipt of either of the
                      RECIPIENTS written request, the RECIPIENTS will return all
                      documents, records and copies thereof containing
                      Confidential Information to the requesting party. For
                      purposes of this section, the term “documents” includes
                      all information fixed in any tangible medium of
                      expression, in whatever form or format.
                    </p>
                  </div>
                  <div className="contentText">
                    <span className="inlineBlock">5.2</span>
                    <p className="px-3 inlineBlock pb-4">
                      The RECIPIENTS hereby acknowledge that unauthorized
                      disclosure or use of any Confidential Information could
                      cause irreparable harm and significant injury to either of
                      the RECIPIENTS that may be difficult to ascertain.
                      Accordingly, the RECIPIENTS agree that either one will
                      have the right to seek and obtain immediate injunctive
                      relief to enforce obligations under this Agreement in
                      addition to any other rights and remedies it may have.
                    </p>
                  </div>
                  <div className="contentText">
                    <span className="inlineBlock">5.3</span>
                    <p className="px-3 inlineBlock pb-4">
                      This Agreement shall be binding upon and insure to the
                      benefit of both Parties and their respective heirs,
                      successors, assigns and representatives.
                    </p>
                  </div>
                  <div className="contentText">
                    <span className="inlineBlock">5.4</span>
                    <p className="px-3 inlineBlock pb-4">
                      If any covenant or provision of the Agreement is
                      determined to be void or unenforceable in whole or part,
                      then such void or unenforceable covenant or provision
                      shall be deleted from this Agreement and shall not affect
                      or impair the enforceability or validity of any other
                      covenant or provision of this Agreement or any part
                      thereof.
                    </p>
                  </div>
                  <div className="contentText">
                    <span className="inlineBlock">5.5</span>
                    <p className="px-3 inlineBlock pb-4">
                      This Agreement shall be governed by the laws of the
                      province of Ontario and any action arising out of this
                      Agreement shall be brought in the province of Ontario.
                    </p>
                  </div>
                </div>
                <div>
                  <h5>
                    <strong>6.0 Execution Authority</strong>
                  </h5>
                  <div className="contentText">
                    <span className="inlineBlock">6.1</span>
                    <p className="px-3 inlineBlock pb-4">
                      The persons whose signatures appear below certify that
                      they are authorized to enter this Agreement on behalf of
                      the Party for whom they sign.
                    </p>
                  </div>
                </div>
                <p>
                  IN WITNESS WHEREOF, this Agreement was executed by the Parties
                  hereto:
                  <br /> DATED this
                  <Field
                    name="day2"
                    component={CustomTextField}
                    isEdit={editMode}
                    className="apma-input mx-1"
                  />{" "}
                  day of{" "}
                  <Field
                    name="month2"
                    component={CustomTextField}
                    isEdit={editMode}
                    className="apma-input mx-1"
                  />
                  2021.
                </p>
                <div className="row">
                  <div className="col-md-12">
                    <div className="apmadetailscard">
                      <div className="row mt-3">
                        <div className="col-md-6 col-sm-12">
                          <p>
                            Recipient: 1
                            <Field
                              name="witness_recipient1"
                              component={CustomTextField}
                              isEdit={editMode}
                              className="apma-input mx-1"
                            />
                          </p>
                          <p>Per (signature): </p>
                          <div className="col-md-12 pl-0 float-left">
                            <div className="">
                              {editMode ? (
                                <Field
                                  type="select"
                                  autoComplete="off"
                                  name="signature1EPSignType"
                                  className="Capitalize"
                                  render={({ fields }) => (
                                    <select
                                      value={values.signature1EPSignType}
                                      onChange={(e) =>
                                        setFieldValue(
                                          "signature1EPSignType",
                                          parseInt(e.target.value)
                                        )
                                      }
                                      className=""
                                    >
                                      <option value="">
                                        Please Choose Sign Mode
                                      </option>
                                      <option value="1">
                                        {"Electronic Signature"}
                                      </option>
                                      <option value="2">
                                        {"Open Signature Pad"}
                                      </option>
                                      <option value="3">
                                        {"Upload Signed Form"}
                                      </option>
                                    </select>
                                  )}
                                />
                              ) : null}
                            </div>

                            {values.signature1EPSignType == 1 && (
                              <>
                                <div className="form-group p-1 border border-primary border-1">
                                  <div className="d-flex">
                                    <div>
                                      <div className="">
                                        This form has been electronically signed
                                        by giving consent to APMA to acknowledge
                                        the form on their behalf. The above
                                        named Client has reviewed the content,
                                        verified understanding of the purpose of
                                        the form, and given their consent.
                                      </div>
                                      <div className="radiogroup">
                                        <ul className="checklists">
                                          <li>
                                            <Field
                                              onChange={() => {
                                                setFieldValue(
                                                  "signature1EPSignAgree",
                                                  values.signature1EPSignAgree.includes(
                                                    "Yes"
                                                  )
                                                    ? ["No"]
                                                    : ["Yes"]
                                                );
                                                if (
                                                  !values.signature1EPSignAgree.includes(
                                                    "Yes"
                                                  )
                                                ) {
                                                  setFieldValue(
                                                    "signature1EPSignAgreeTime",
                                                    new Date().getTime()
                                                  );
                                                } else {
                                                  setFieldValue(
                                                    "signature1EPSignAgreeTime",
                                                    ""
                                                  );
                                                }
                                              }}
                                              name="signature1EPSignAgree"
                                              type="checkbox"
                                              id="signature1EPSignAgree"
                                              value="Yes"
                                              className="filled-in chk-col-purple"
                                            />
                                            <label
                                              htmlFor="signature1EPSignAgree"
                                              className="ml-1"
                                            >
                                              I Agree
                                            </label>
                                            {values.signature1EPSignAgreeTime && (
                                              <div
                                                style={{
                                                  background: "#ccc",
                                                  color: "black"
                                                }}
                                                className="py-1 px-2 "
                                              >
                                                Time:{" "}
                                                {moment(
                                                  parseInt(
                                                    values.signature1EPSignAgreeTime
                                                  )
                                                ).format("MM/DD/YYYY HH:mm")}
                                              </div>
                                            )}
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                            {values.signature1EPSignType == 2 && (
                              <div className="form-group">
                                <div className="d-flex">
                                  <OImageCanvas
                                    initial={
                                      this.state.mutualNDA
                                        .signature1EPFileSketch
                                    }
                                    id={this.state.currentUser.id}
                                    image={values.signature1EPFileSketch}
                                    done={(file) => {
                                      setFieldValue(
                                        "signature1EPFileSketch",
                                        file
                                      );
                                    }}
                                    hideHead={!editMode}
                                  />
                                </div>
                              </div>
                            )}
                            {values.signature1EPSignType == 3 &&
                              this.state.AIPRINT_MODE != true && (
                                <>
                                  <div className="form-group">
                                    <div className="d-flex">
                                      <OIFileUpload
                                        initial={
                                          this.state.mutualNDA
                                            .signature1EPFilePrint
                                        }
                                        id={this.state.currentUser.id}
                                        image={values.signature1EPFilePrint}
                                        done={(file) => {
                                          setFieldValue(
                                            "signature1EPFilePrint",
                                            file
                                          );
                                        }}
                                        hideHead={!editMode}
                                      />
                                    </div>
                                  </div>
                                </>
                              )}
                          </div>
                          <p className="mb-0">
                            Name:{" "}
                            <Field
                              name="name1"
                              component={CustomTextField}
                              isEdit={editMode}
                              className="apma-input mx-1"
                            />
                          </p>
                          <p className="mb-0">
                            Title:{" "}
                            <Field
                              name="title1"
                              component={CustomTextField}
                              isEdit={editMode}
                              className="apma-input mx-1"
                            />
                          </p>
                          <p>I have authority to bind the Corporation</p>
                          <p>
                            <i>
                              *Executed pursuant to the Electronic Commerce Act
                            </i>
                          </p>
                        </div>
                        <div className="col-md-6 col-sm-12">
                          <p>
                            Recipient: 2{" "}
                            <Field
                              name="witness_recipient2"
                              component={CustomTextField}
                              className="apma-input mx-1"
                              innerClassName="mb-3"
                            />
                          </p>
                          <p>Per (signature): </p>
                          {this.isClientSignaturePresent(
                            values,
                            initialValues
                          ) ? (
                            <div className="col-md-12 pl-0 float-left">
                              {values.signature2EPSignType == 1 && (
                                <>
                                  <div
                                    className={classNames(
                                      "form-group p-1 border border-primary border-1",
                                      {
                                        "mt-4": editMode
                                      }
                                    )}
                                  >
                                    <div className="d-flex">
                                      <div>
                                        <div className="">
                                          This form has been electronically
                                          signed by giving consent to APMA to
                                          acknowledge the form on their behalf.
                                          The above named Client has reviewed
                                          the content, verified understanding of
                                          the purpose of the form, and given
                                          their consent.
                                        </div>
                                        <div className="radiogroup">
                                          <ul className="checklists">
                                            <li>
                                              <Field
                                                onChange={() => {
                                                  setFieldValue(
                                                    "signature2EPSignAgree",
                                                    values.signature2EPSignAgree.includes(
                                                      "Yes"
                                                    )
                                                      ? ["No"]
                                                      : ["Yes"]
                                                  );
                                                  if (
                                                    !values.signature2EPSignAgree.includes(
                                                      "Yes"
                                                    )
                                                  ) {
                                                    setFieldValue(
                                                      "signature2EPSignAgreeTime",
                                                      new Date().getTime()
                                                    );
                                                  } else {
                                                    setFieldValue(
                                                      "signature2EPSignAgreeTime",
                                                      ""
                                                    );
                                                  }
                                                }}
                                                name="signature2EPSignAgree"
                                                type="checkbox"
                                                id="signature2EPSignAgree"
                                                value="Yes"
                                                className="filled-in chk-col-purple"
                                              />
                                              <label
                                                htmlFor="signature2EPSignAgree"
                                                className="ml-1"
                                              >
                                                {" "}
                                                I Agree
                                              </label>
                                              {values.signature2EPSignAgreeTime && (
                                                <div
                                                  style={{
                                                    background: "#ccc",
                                                    color: "black"
                                                  }}
                                                  className="py-1 px-2 "
                                                >
                                                  Time:{" "}
                                                  {moment(
                                                    parseInt(
                                                      values.signature2EPSignAgreeTime
                                                    )
                                                  ).format("MM/DD/YYYY HH:mm")}
                                                </div>
                                              )}
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}
                              {values.signature2EPSignType == 2 && (
                                <div className="form-group">
                                  <div className="d-flex">
                                    <OImageCanvas
                                      initial={
                                        this.state.mutualNDA
                                          .signature2EPFileSketch
                                      }
                                      id={this.state.currentUser.id}
                                      image={values.signature2EPFileSketch}
                                      done={(file) => {
                                        setFieldValue(
                                          "signature2EPFileSketch",
                                          file
                                        );
                                      }}
                                      hideHead={!editMode}
                                    />
                                  </div>
                                </div>
                              )}
                              {values.signature2EPSignType == 3 &&
                                this.state.AIPRINT_MODE != true && (
                                  <>
                                    <div className="form-group">
                                      <div className="d-flex">
                                        <OIFileUpload
                                          initial={
                                            this.state.mutualNDA
                                              .signature2EPFilePrint
                                          }
                                          id={this.state.currentUser.id}
                                          image={values.signature2EPFilePrint}
                                          done={(file) => {
                                            setFieldValue(
                                              "signature2EPFilePrint",
                                              file
                                            );
                                          }}
                                          hideHead={!editMode}
                                        />
                                      </div>
                                    </div>
                                  </>
                                )}
                            </div>
                          ) : (
                            <div className="col-md-12 pl-0 float-left">
                              <div
                                className={classNames(
                                  "form-group p-1 border border-primary border-1",
                                  {
                                    "mt-4": editMode
                                  }
                                )}
                              >
                                <p className="mt-3">Client Signature Missing</p>
                              </div>
                            </div>
                          )}

                          <p className="mb-0">
                            Name:{" "}
                            <Field
                              name="name2"
                              component={CustomTextField}
                              className="apma-input mx-1"
                            />
                          </p>
                          <p className="mb-0">
                            Title:{" "}
                            <Field
                              name="title2"
                              component={CustomTextField}
                              className="apma-input mx-1"
                            />
                          </p>

                          <p>I have authority to bind the Corporation</p>
                          <p>
                            <i>
                              *Executed pursuant to the Electronic Commerce Act
                            </i>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {editMode && (
                  <div className="row">
                    <div className="offset-md-4 col-md-4">
                      <button
                        onClick={() => handleSubmit()}
                        disabled={isSubmitting}
                        className="btn btn-primary btn-lg btn-block text-uppercase mt-2"
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
                )}
              </div>
            </form>
          );
        }}
      </Formik>
    );
  }
}
