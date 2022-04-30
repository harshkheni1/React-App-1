import React, { Component } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { InputMask } from "primereact/inputmask";
import {
  apmaService,
  authenticationService,
  formService
} from "../../_services";
import OImageCanvas from "../OImageCanvas";
import OIFileUpload from "../OFileUpload";
import moment from "moment";
import { CustomTextField } from "../CustomTextField";
import swal from "sweetalert";

export default class ArrowPartnershipAgreement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: authenticationService.currentUserValue,
      arrowAgreement: {},
      AIPRINT_MODE: false,
      editMode: false
    };
  }

  componentDidMount() {
    this.getArrowAgreementProfileById();
  }

  getArrowAgreementProfileById = () => {
    this.state.currentUser.id &&
      formService
        .getArrowAgreementProfileById(this.state.currentUser.id)
        .then((data) => {
          this.setState({ arrowAgreement: data.Data });
          this.props.setArrowPartnershipStatus(data.Data.isCompleted);
        });
  };

  print() {
    window.print();
  }
  render() {
    const { editMode } = this.state;
    return (
      <Formik
        enableReinitialize={true}
        initialValues={{
          day: this.state.arrowAgreement.day
            ? this.state.arrowAgreement.day
            : moment().format("DD"),
          month: this.state.arrowAgreement.month
            ? this.state.arrowAgreement.month
            : moment().format("MMMM"),
          year: this.state.arrowAgreement.year
            ? this.state.arrowAgreement.year
            : moment().format("YY"),
          recipient: this.state.arrowAgreement.recipient
            ? this.state.arrowAgreement.recipient
            : this.props.apmaProfile.companyTitle,
          region: this.state.arrowAgreement.region || "",
          address: this.state.arrowAgreement.address
            ? this.state.arrowAgreement.address
            : this.props.apmaProfile.companyAddress,
          time: this.state.arrowAgreement.time
            ? this.state.arrowAgreement.time
            : moment().format("HH:mm"),
          date1: this.state.arrowAgreement.date1
            ? this.state.arrowAgreement.date1
            : moment().format("DD"),
          month1: this.state.arrowAgreement.month1
            ? this.state.arrowAgreement.month1
            : moment().format("MMMM"),
          year1: this.state.arrowAgreement.year1
            ? this.state.arrowAgreement.year1
            : moment().format("YY"),
          recipient1: "Flavio Volpe",
          title1: "President",
          recipient2: this.state.arrowAgreement.recipient2
            ? this.state.arrowAgreement.recipient2
            : this.props.apmaProfile.companyTitle,
          title2: this.state.arrowAgreement.title2 || "",
          apmaCompanyId: this.state.currentUser.id,
          arrowpartnershipsId: this.state.arrowAgreement._id,
          signature1EPSignType: "1",
          signature1EPSignAgreeTime:
            this?.state?.arrowAgreement?.signature1EPSignAgreeTime || "",
          signature1EPSignAgree: this?.state?.arrowAgreement
            ?.signature1EPSignAgree
            ? [this?.state?.arrowAgreement?.signature1EPSignAgree]
            : [],
          signature1EPFileSketch:
            this?.state?.arrowAgreement?.signature1EPFileSketch || "",
          signature1EPFilePrint:
            this?.state?.arrowAgreement?.signature1EPFilePrint || "",
          signature1EPSignDate: this.state.arrowAgreement?.signature1EPSignDate
            ? moment
                .utc(parseInt(this.state.arrowAgreement.signature1EPSignDate))
                .format("YYYY-MM-DD")
            : "",
          signature2EPSignType:
            this?.state?.arrowAgreement?.signature2EPSignType || "",
          signature2EPSignAgreeTime:
            this?.state?.arrowAgreement?.signature2EPSignAgreeTime || "",
          signature2EPSignAgree: this?.state?.arrowAgreement
            ?.signature2EPSignAgree
            ? [this?.state?.arrowAgreement?.signature2EPSignAgree]
            : [],
          signature2EPFileSketch:
            this?.state?.arrowAgreement?.signature2EPFileSketch || "",
          signature2EPFilePrint:
            this?.state?.arrowAgreement?.signature2EPFilePrint || "",
          signature2EPSignDate: this.state.arrowAgreement?.signature2EPSignDate
            ? moment
                .utc(parseInt(this.state.arrowAgreement.signature2EPSignDate))
                .format("YYYY-MM-DD")
            : ""
        }}
        validationSchema={Yup.object().shape({})}
        onSubmit={(formData, { setStatus, setSubmitting, resetForm }) => {
          setSubmitting(true);
          let requestData = {
            ...formData,
            signature1EPSignAgree: formData.signature1EPSignAgree
              ? formData.signature1EPSignAgree[0]
              : "",

            signature2EPSignAgree: formData.signature2EPSignAgree
              ? formData.signature2EPSignAgree[0]
              : ""
          };
          formService
            .saveArrowPartnerShipAgreement(requestData)
            .then((arrowagreement) => {
              setSubmitting(false);
              swal(
                "Arrow Partnership Aggreement Saved Successfully!",
                "",
                "success"
              );
              this.getArrowAgreementProfileById();
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
          handleSubmit
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
                    {this.state.arrowAgreement.updatedAt ? (
                      <div className="">
                        Latest Update:{" "}
                        {moment(this.state.arrowAgreement.updatedAt).format(
                          "MM/DD/YYYY hh:mm a"
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>

                <h3 className="text-center">Project Arrow</h3>
                <h4 className="text-center">
                  ZEV Technology Concept Vehicle Development Partnership
                  Agreement
                </h4>
                <h4>
                  <strong>BETWEEN</strong>
                </h4>
                <p>
                  THIS CONSULTANT AGREEMENT MADE this
                  <Field
                    component={CustomTextField}
                    isEdit={editMode}
                    name="day"
                    className="apma-input mx-1"
                  />
                  , day of{" "}
                  <Field
                    component={CustomTextField}
                    isEdit={editMode}
                    name="month"
                    className="apma-input mx-1"
                  />
                  , 20
                  <Field
                    component={CustomTextField}
                    isEdit={editMode}
                    name="year"
                    className="apma-input mx-1"
                  />
                </p>

                <div className="text-center">
                  <Field
                    component={CustomTextField}
                    isEdit={editMode}
                    name="recipient"
                    placeholder=" INSERT PARTY NAME"
                    className="apma-input mx-1"
                  />
                  <p>(hereafter known as “PARTY ACRONYM”) </p>
                  <br />
                  AND
                  <br />
                  <p className="mt-2">
                    <strong>
                      Automotive Parts Manufacturers’ Association(APMA)
                    </strong>{" "}
                    (hereinafter “APMA”)
                  </p>
                  <p className="mt-2">(Together known as the “Parties”)</p>
                </div>
                <p>
                  <strong>WHEREAS</strong> APMA is Canada’s national
                  association, incorporated under the laws of Ontario,
                  representing OEM producers of parts, equipment, tools,
                  supplies, advanced technology, and services for the worldwide
                  automotive industry. The APMA was founded in 1952 and its
                  membership accounts for 90% of independent parts production in
                  Canada. The fundamental objective of the APMA is to promote
                  the original equipment (O.E.) automotive supply manufacturing
                  industry both domestically and internationally;
                </p>
                <p>
                  <strong>AND WHEREAS</strong> APMA is uniquely positioned to
                  provide direct industry access, networking, and links the
                  purposes of assisting PARTY to develop a greater market access
                  and business development;
                </p>
                <p>
                  <strong>AND WHEREAS</strong> the PARTY is a Corporation,
                  incorporated under the law of{" "}
                  <Field
                    component={CustomTextField}
                    isEdit={editMode}
                    name="region"
                    placeholder="INSERT REGION"
                    className="apma-input mx-1"
                  />
                  , located at{" "}
                  <Field
                    component={CustomTextField}
                    isEdit={editMode}
                    name="address"
                    placeholder="INSERT
                  ADDRESS"
                    className="apma-input mx-1"
                  />
                  ;
                </p>
                <p>
                  <strong>AND WHEREAS</strong> PARTY wishes to engage APMA under
                  its Project Arrow for the purposes of the services and
                  benefits herein, subject to the terms and conditions set out;
                </p>
                <p>
                  <strong>NOW THEREFORE THIS AGREEMENT WITNESSETH</strong> that
                  in consideration of the mutual covenants herein contained and
                  for the other good and valuable consideration now paid by each
                  party to the other party, to receipt and sufficiently of which
                  is hereby acknowledged, the parties agree as follows:
                </p>
                <div>
                  <h5>
                    <strong>1. SERVICES OF THE PROJECT ARROW</strong>
                  </h5>
                  <div className="contentText">
                    <span className="inlineBlock">1.1 </span>
                    <p className="px-3 inlineBlock pb-4">
                      The services to be provided by the APMA to PARTY shall be
                      as follows;
                    </p>
                    <div className="pl-5">
                      <p>
                        (a) To provide the services described in “Schedule A”,
                        attached hereto and forms part of this agreement;
                      </p>
                      <p>
                        (b) To provide general Consulting Services with respect
                        to Business Development within the automotive sector;
                      </p>
                      <p>
                        (c) Such other services as are mutually agreed upon by
                        the parties. APMA shall provide the services
                        contemplated hereunder in a timely, diligent and
                        professional manner.
                      </p>
                      <p>
                        (d) the RECIPIENTS rightfully obtain from a third party
                        who has the right to transfer or disclose it.
                      </p>
                    </div>
                  </div>
                  <div className="contentText">
                    <span className="inlineBlock">1.2 </span>
                    <p className="px-3 inlineBlock pb-4">
                      Nothing contained in this agreement or in the performance
                      of any of the Services shall be construed as creating a
                      partnership, joint venture or relationship of employer and
                      employee between the APMA and PARTY.
                    </p>
                  </div>
                </div>
                <div>
                  <h5>
                    <strong>2. PARTY Contribution to Project Arrow</strong>
                  </h5>
                  <div className="contentText">
                    <span className="inlineBlock">2.1 </span>
                    <p className="px-3 inlineBlock pb-4">
                      The Parties hereby acknowledge and confirm that, subject
                      to the provision by APMA of the Services pursuant to the
                      terms hereof, the fee payable by the PARTY to the APMA for
                      the Services to be provided pursuant to this agreement
                      shall be the sum of $25,000 (Canadian) per year, inclusive
                      of all applicable taxes and subject to applicable
                      withholdings as required by the applicable law, of which
                      the parties shall reasonably agree.
                    </p>
                  </div>
                  <div className="contentText">
                    <span className="inlineBlock">2.2 </span>
                    <p className="px-3 inlineBlock pb-4">
                      The Parties agree that the fee shall be payable in twelve
                      (12) equal monthly installments due in full on the first
                      day of every month.
                    </p>
                  </div>
                </div>
                <div>
                  <h5>
                    <strong>3. Term</strong>
                  </h5>
                  <div className="contentText">
                    <span className="inlineBlock">3.1 </span>
                    <p className="px-3 inlineBlock pb-4">
                      The term of this agreement shall be for a period of twelve
                      (12) months commencing on Insert Date and terminating on
                      Insert Date. Notwithstanding the foregoing, the
                      commencement of the term hereof is conditional upon PARTY
                      completing and executing an annual membership agreement.
                    </p>
                  </div>
                </div>
                <div>
                  <h5>
                    <strong>4. Termination</strong>
                  </h5>
                  <div className="contentText">
                    <span className="inlineBlock">4.1 </span>
                    <p className="px-3 inlineBlock pb-4">
                      Either Party may terminate this agreement, on thirty (30)
                      days’ notice to the other party upon occurrence of any of
                      the following conditions:
                    </p>
                    <div className="pl-5">
                      <p>
                        (a) a material breach of any of the terms of this
                        agreement by the other party;
                      </p>
                      <p>
                        (b) The Parties may terminate this Agreement immediately
                        upon mutual agreement of the parties.
                      </p>
                    </div>
                  </div>
                  <div className="contentText">
                    <span className="inlineBlock">4.2 </span>
                    <p className="px-3 inlineBlock pb-4">
                      In the event that the agreement hereunder is terminated,
                      any fees accrued prior to the termination of this
                      agreement shall still be due and payable.
                    </p>
                  </div>
                </div>

                <div>
                  <h5>
                    <strong>5. Confidentiality</strong>
                  </h5>
                  <div className="contentText">
                    <span className="inlineBlock">5.1 </span>
                    <p className="px-3 inlineBlock pb-4">
                      The Parties hereto agree to retain in confidence any and
                      all information that belongs to the other Party and to not
                      disclose same to third parties, nor to use it directly or
                      indirectly for their own benefit, unless explicitly
                      authorized by the originating party. Each Party shall
                      promptly notify the other of unauthorized access,
                      exchange, collection, use, or disclosure, of confidential
                      information including losses and shall provide full
                      details of the occurrence.
                    </p>
                  </div>
                  <div className="contentText">
                    <span className="inlineBlock">5.2 </span>
                    <p className="px-3 inlineBlock pb-4">
                      For clarity, 5.1 shall not be interpreted as to interfere
                      with the purpose of this agreement, and APMA may use the
                      confidential information of PARTY solely to perform
                      Services for the benefit of PARTY.
                    </p>
                  </div>
                </div>

                <div>
                  <h5>
                    <strong>6. Dispute Resolution </strong>
                  </h5>
                  <div className="contentText">
                    <span className="inlineBlock">6.1 </span>
                    <p className="px-3 inlineBlock pb-4">
                      Disputes concerning this Agreement shall not be litigated.
                      All disputes arising in connection with this Agreement
                      which cannot be resolved through negotiations to the
                      mutual satisfaction of both Parties within thirty (30)
                      days, or such longer period as may be mutually agreed
                      upon, may be submitted by either Party to arbitration in
                      accordance with the Commercial Arbitration Act of Canada,
                      R.S.C., 1985, c. 17 (2nd Supp.), as amended, and shall be
                      subject to the following:
                    </p>
                  </div>
                  <div className="pl-5">
                    <p>
                      (a) The Party requesting such arbitration shall do so by
                      written notice to the other Party.
                    </p>
                    <p>
                      (b) The arbitration shall take place in Toronto, Ontario
                      before a single arbitrator to be chosen jointly by the
                      Parties. Failing agreement of the Parties on a single
                      arbitrator within thirty (30) days of such notice
                      requesting arbitration, either party may apply to a judge
                      of a court having jurisdiction in Toronto, Ontario for the
                      appointment of a single arbitrator.
                    </p>
                    <p>
                      (c) Each Party shall pay its own costs and an equal share
                      of all of the costs of the arbitration and the fees of the
                      arbitrator, except for the exceptional circumstance in
                      which an arbitral award may require the payment of all
                      costs by a Party who has brought a plainly frivolous
                      dispute.
                    </p>
                    <p>
                      (d) The arbitrator shall issue a written decision as soon
                      as practicable after the conclusion of the final hearing,
                      but in any event no later than sixty (60) days thereafter,
                      unless that time period is extended for a fixed period by
                      the Arbitrator on written notice to each Party because of
                      illness or other cause beyond the Arbitrator’s control.
                      The decision shall be rendered in such form that judgment
                      may be entered thereon in any court having jurisdiction.
                    </p>
                    <p>
                      (e) The decision shall be final and binding on the Parties
                      in accordance with the Commercial Arbitration Act of
                      Canada. This clause shall not preclude any Party from
                      seeking provisional remedies from any court of appropriate
                      jurisdiction.
                    </p>
                  </div>
                </div>

                <div>
                  <h5>
                    <strong>7. Conditions</strong>
                  </h5>
                  <div className="contentText">
                    <span className="inlineBlock">7.1 </span>
                    <p className="px-3 inlineBlock pb-4">
                      The PARTY shall provide reasonable assistance to the APMA
                      in order to facilitate services as in Schedule “A”.
                    </p>
                  </div>
                  <div className="contentText">
                    <span className="inlineBlock">7.2 </span>
                    <p className="px-3 inlineBlock pb-4">
                      The Parties shall maintain an open and clear form of
                      communication during the term of this agreement.
                    </p>
                  </div>
                  <div className="contentText">
                    <span className="inlineBlock">7.3 </span>
                    <p className="px-3 inlineBlock pb-4">
                      The APMA shall perform the services in a professional
                      manner.
                    </p>
                  </div>
                  <div className="contentText">
                    <span className="inlineBlock">7.4 </span>
                    <p className="px-3 inlineBlock pb-4">
                      The APMA may suspend its performance of any obligations
                      under this agreement and any obligations thereto should
                      any payments be in arrears.
                    </p>
                  </div>
                </div>

                <div>
                  <h5>
                    <strong>8. General Matters</strong>
                  </h5>
                  <div className="contentText">
                    <span className="inlineBlock">8.0.1 </span>
                    <p className="px-3 inlineBlock pb-4">
                      This agreement shall be construed in accordance with the
                      laws of the Province of Ontario.
                    </p>
                  </div>
                  <div className="contentText">
                    <span className="inlineBlock">8.0.2 </span>
                    <p className="px-3 inlineBlock pb-4">
                      If any Party waives any term, provision or the other
                      Party’s breach of this Agreement, such waiver shall not be
                      effective unless it is in writing and signed by the Party
                      granting the waiver. No waiver of a breach of this
                      Agreement shall constitute a waiver of any other or
                      subsequent breach. This Agreement may be modified only by
                      mutual written agreement of authorized representatives of
                      the Parties.
                    </p>
                  </div>
                  <div className="contentText">
                    <span className="inlineBlock">8.0.3 </span>
                    <p className="px-3 inlineBlock pb-4">
                      The APMA shall not be liable, in tort or in contract, for
                      failure or delay in performance of the obligations in this
                      agreement caused by circumstances beyond the APMA’s
                      reasonable control.
                    </p>
                  </div>
                  <div className="contentText">
                    <span className="inlineBlock">8.0.4 </span>
                    <p className="px-3 inlineBlock pb-4">
                      The APMA does not guarantee any particular result, or
                      outcome as a result of APMA’s advice or in the performance
                      of its services to SIAC and shall not be liable for any
                      actions and or inaction taken or not taken by PARTY in
                      reliance upon the advice provided by the APMA.{" "}
                    </p>
                  </div>
                  <div className="contentText">
                    <span className="inlineBlock">8.0.5 </span>
                    <p className="px-3 inlineBlock pb-4">
                      APMA shall not assign its rights or delegate any
                      performance under this agreement without PARTY’s prior
                      written consent. This agreement shall inure to the benefit
                      of and be binding upon the parties hereto and their
                      respective heirs, executors, administrators and legal
                      representatives.
                    </p>
                  </div>
                  <div className="contentText">
                    <span className="inlineBlock">8.0.6 </span>
                    <p className="px-3 inlineBlock pb-4">
                      The division of this agreement in articles, sections and
                      subsections is for convenience of reference only and shall
                      not affect the interpretation or construction of this
                      agreement.
                    </p>
                  </div>
                  <div className="contentText">
                    <span className="inlineBlock">8.0.7 </span>
                    <p className="px-3 inlineBlock pb-4">
                      In the event of a breach of any of the clauses of this
                      Agreement, by any of the parties, upon completion of the
                      process described in Section 6 and prior to initiating any
                      court proceedings, the aggrieved party shall provide
                      notice as to any breach and shall afford the breaching
                      Party thirty (30) days to remedy any breach, or as the
                      Parties may agree.{" "}
                    </p>
                  </div>
                  <div className="contentText">
                    <span className="inlineBlock">8.0.8 </span>
                    <p className="px-3 inlineBlock pb-4">
                      Every provision of this Agreement is intended to be
                      severable. If any term or provision hereof is illegal or
                      invalid for any reason whatsoever, such illegality or
                      invalidity shall not affect the validity of the remainder
                      of this Agreement.{" "}
                    </p>
                  </div>
                  <div className="contentText">
                    <span className="inlineBlock">8.0.9 </span>
                    <p className="px-3 inlineBlock pb-4">
                      The Parties acknowledge that they have been advised to
                      obtain independent legal advice, and that they have read
                      and understand the terms of this agreement.
                    </p>
                  </div>
                  <div className="contentText">
                    <span className="inlineBlock">8.1.0 </span>
                    <p className="px-3 inlineBlock pb-4">
                      This agreement may be executed in several counterparts and
                      such counterparts together shall constitute and the same
                      agreement.
                    </p>
                  </div>
                </div>
                <p>
                  Dated at
                  <Field
                    component={CustomTextField}
                    isEdit={editMode}
                    name="time"
                    className="apma-input mx-1"
                  />
                  , this{" "}
                  <Field
                    component={CustomTextField}
                    isEdit={editMode}
                    name="date1"
                    className="apma-input mx-1"
                  />
                  , day of
                  <Field
                    component={CustomTextField}
                    isEdit={editMode}
                    name="month1"
                    className="apma-input mx-1"
                  />
                  ,20
                  <Field
                    component={CustomTextField}
                    isEdit={editMode}
                    name="year1"
                    className="apma-input mx-1"
                  />
                </p>
                <div className="row">
                  <div className="col-md-12">
                    <div className="apmadetailscard">
                      <div className="row mt-3 ">
                        <div className="col-md-6 col-sm-12">
                          <h5>
                            Automotive Parts Manufacturers’ Association(APMA)
                          </h5>
                          <br />
                          <Field
                            component={CustomTextField}
                            name="recipient1"
                            className="apma-input mx-1"
                          />
                          <br />
                          <br />
                          Per:{" "}
                          {/* <Field
                      type="text"
                      name="per1"
                      className="apma-input mx-1"
                    /> */}
                          <div className="col-md-12 float-left">
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
                                            <label htmlFor="signature1EPSignAgree">
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
                                      this.state.arrowAgreement
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
                                          this.state.arrowAgreement
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
                          <br />
                          Title:{" "}
                          <Field
                            component={CustomTextField}
                            name="title1"
                            className="apma-input mx-1"
                          />
                          <br /> I have authority to bind the Corporation
                          <br />
                          <br />
                          <i>
                            *Executed pursuant to the Electronic Commerce Act
                          </i>
                        </div>

                        <div className="col-md-6 col-sm-12">
                          <h5>PARTY NAME</h5> <br />
                          <Field
                            component={CustomTextField}
                            isEdit={editMode}
                            name="recipient2"
                            className="apma-input mx-1"
                          />
                          <br />
                          <br />
                          Per :{" "}
                          {/* <Field
                      type="text"
                      name="per2"
                      className="apma-input mx-1"
                    /> */}
                          <div className="col-md-12 float-left">
                            <div className="">
                              {editMode ? (
                                <Field
                                  type="select"
                                  autoComplete="off"
                                  name="signature2EPSignType"
                                  className="Capitalize"
                                  render={({ fields }) => (
                                    <select
                                      value={values.signature2EPSignType}
                                      onChange={(e) =>
                                        setFieldValue(
                                          "signature2EPSignType",
                                          e.target.value
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

                            {values.signature2EPSignType == 1 && (
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
                                            <label htmlFor="signature2EPSignAgree">
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
                                      this.state.arrowAgreement
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
                                          this.state.arrowAgreement
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
                          <br />
                          Title:{" "}
                          <Field
                            component={CustomTextField}
                            isEdit={editMode}
                            name="title2"
                            className="apma-input mx-1"
                          />
                          <br /> I have authority to bind the Corporation
                          <br />
                          <br />
                          <i>
                            *Executed pursuant to the Electronic Commerce Act
                          </i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <br />
                {editMode && (
                  <div className="row">
                    <div className="offset-md-4 col-md-4">
                      <button
                        onClick={() => handleSubmit()}
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
