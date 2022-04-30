import React, { Component } from "react";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import {
  authenticationService,
  apmaService,
  formService
} from "../../_services";
import { CustomTextField } from "../CustomTextField";
import { CustomEditor } from "../CustomEditor";
import { CustomDropZone } from "../CustomDropZone";
import { Editor } from "primereact/editor";
import moment from "moment";
import { Tree } from "primereact/tree";
import { Dialog } from "primereact/dialog";
import { productCategories } from "../../_helpers";
import {
  getClickableLink,
  isObjectEmpty,
  getUniqueKeys
} from "../../_helpers/_helperFunctions";
import swal from "sweetalert";

export default class RFP extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: authenticationService.currentUserValue,
      editMode: true,
      selectedNodeKeys: null,
      categoryModal: false,
      cadModel: false,
      rfpProfile: {},
      cadConditonCheck: false
    };
  }
  componentDidMount() {
    this.getRFPProfileById();
  }

  getRFPProfileById = () => {
    this.state.currentUser.id &&
      formService.getRFPProfileById(this.state.currentUser.id).then((data) => {
        this.setState({
          rfpProfile: data.Data,
          selectedNodeKeys: isObjectEmpty(data.Data.productCategories)
            ? null
            : data.Data.productCategories
        });
        this.props.setRFPStatus(data.Data.isCompleted);
      });
  };

  getCadfiles = () => {
    formService.getCadFilesFromS3().then((data) => {
      data.Data.forEach((key) => {
        window.open(key, "_parent");
      });
    });

    formService.recordCadFilesDownload(this.state.currentUser.id).then(() => {
      this.setState({ cadModel: false });
    });
  };

  print() {
    window.print();
  }
  handleCadConditionChecked = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      cadConditonCheck: value
    });
  };

  closeCategoryModal = () => {
    this.setState({ categoryModal: false });
  };
  closeCadModal = () => {
    this.setState({ cadModel: false });
  };

  renderTreeCategory = () => {
    let nodes = this.state.selectedNodeKeys;
    if (nodes) {
      let list = [];
      let filteredNodes = Object.keys(nodes).filter((node) => {
        return !!nodes[node]["checked"];
      });
      getUniqueKeys(filteredNodes).forEach((key, index) => {
        list.push(<div key={`nodes-${index}`}>{key}</div>);
      });
      return list.length ? (
        <div className="alert alert-info mt-3">{list}</div>
      ) : null;
    } else {
      return null;
    }
  };

  render() {
    const { editMode, rfpProfile } = this.state;
    const { apmaProfile } = this.props;
    return (
      <Formik
        enableReinitialize={true}
        initialValues={{
          fullLegalName: apmaProfile.fullLegalName || "",
          companyAddress: apmaProfile.companyAddress || "",
          businessWebsite: apmaProfile.businessWebsite || "",
          contactPerson: apmaProfile.contactPerson || "",
          position: apmaProfile.position || "",
          mobileNumber: apmaProfile.mobileNumber || "",
          profileEmail: apmaProfile.profileEmail || "",
          phoneNumber: apmaProfile.phoneNumber || "",
          ourSolution: rfpProfile.ourSolution || "",
          safety: rfpProfile.safety || [
            { discription: "" },
            { discription: "" }
          ],
          intellectualProperty: rfpProfile.intellectualProperty || "",
          valuation: rfpProfile.valuation || [
            {
              productDescription: "",
              tooling: "",
              techSupport: ""
            }
          ],
          parentChildComp: rfpProfile.parentChildComp || [
            { product: "", component: "", suppliers: "" }
          ],
          provideTechAtNoCost: rfpProfile.provideTechAtNoCost || "",
          provideTechSupportAtNoCost:
            rfpProfile.provideTechSupportAtNoCost || "",
          isManufacturedInCanada: rfpProfile.isManufacturedInCanada || "",
          isCuttingEdge: rfpProfile.isCuttingEdge || "",
          apmaCompanyId: this.state.currentUser.id,
          CADFiles: rfpProfile.CADFiles || [],
          rfpId: rfpProfile._id || null
        }}
        onSubmit={(formData, { setStatus, setSubmitting, resetForm }) => {
          let requestData = {
            ...formData,
            productCategories: this.state.selectedNodeKeys
          };
          setSubmitting(true);
          formService
            .saveRPFProfile(requestData)
            .then((rfp) => {
              setSubmitting(false);
              swal("RFP Saved Successfully!", "", "success");
              this.getRFPProfileById();
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
                    {apmaProfile.updatedAt ? (
                      <div className="text-right">
                        Latest Update:{" "}
                        {moment(apmaProfile.updatedAt).format(
                          "MM/DD/YYYY hh:mm a"
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>

                <h3>
                  <strong>Project Arrow Request for Proposal (RFP)</strong>
                </h3>

                <div className="mt-5">
                  <h3>
                    <strong>Purpose</strong>
                  </h3>
                  <div className="contentText">
                    <p className=" inlineBlock pb-4">
                      The Automotive Parts Manufacturers' Association (APMA)
                      invites you to provide a proposal from qualified companies
                      interested in providing their product/technology for the
                      Project Arrow zero-emission concept vehicle. In the
                      preparation of the Request for Proposal (RFP), the word
                      "vendor", "company", "organisation" and "SME" are used
                      interchangeably.
                    </p>
                  </div>
                </div>

                <div>
                  <h5>
                    <strong>
                      Index - The following are contained in this RFP.
                    </strong>
                  </h5>
                  <div className="contentText">
                    <div className=" inlineBlock pb-4">
                      <p>Section I – Project Background/Information</p>
                      <p>Section II - Timeline</p>
                      <p>Section III – Request for Proposal Form</p>
                      <p>Section IV – Selection Criteria</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <h3>
                    <strong>Section I – Project Background/Information</strong>
                  </h3>
                  <div className="contentText">
                    <div className=" inlineBlock pb-4">
                      <h6>
                        <strong>Project Background</strong>
                      </h6>
                      <p>
                        The Automotive Parts Manufacturers' Association (APMA)
                        of Canada launched the first, original, full-build
                        zero-emission concept vehicle named Project Arrow. An
                        all-Canadian effort, it will be designed, engineered and
                        built by our world-class automotive supply sector and
                        post-secondary institutions. Project Arrow will serve as
                        a lighthouse, showcasing Canada's world-class automotive
                        supply sector's capability as the North American market
                        enters a new automotive era. Furthermore, the project
                        will serve as a powerful instrument for federal and
                        provincial gap analysis and program roll-out strategies
                        over the next several years.
                      </p>
                      <p>
                        From 2020 to 2022, Project Arrow will be rolled out in
                        four phases:
                      </p>
                      <div className="pl-5">
                        <ul>
                          <li>
                            Phase 1 – Design Competition &amp; Selection -
                            COMPLETED
                          </li>
                          <li>Phase 2 – Engineering &amp; Build – 2020-2022</li>
                          <li>
                            Phase 3 – Virtual Concept Unveiling – completion Q1
                            2021
                          </li>
                          <li>
                            Phase 4 – Concept Car Release and Tour – 2022-2023
                          </li>
                        </ul>
                      </div>
                      <p>
                        Project Arrow Supports and Strengthens Canadian
                        Automotive sector
                      </p>
                      <div className="pl-5">
                        <ul>
                          <li>
                            Increase electric vehicle development capacity
                          </li>
                          <li>
                            Support future-thinking Industry-focused R&amp;D led
                            by academic institutions
                          </li>
                          <li>
                            Ensure that the supporting EV supply chain is
                            present and growing.{" "}
                          </li>
                          <li>
                            Paves the way for new OEM North American final EV
                            assembly mandates in Canada
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <h3>
                    <strong>Information</strong>
                  </h3>
                  <div className="contentText">
                    <div className=" inlineBlock pb-4">
                      <p>
                        Project Arrow looks to incorporate Canadian-built parts,
                        systems and technologies into one zero-emission vehicle
                        platform. Products and technologies that are
                        commercially ready or meet the Technology Readiness
                        Level (TRL) 7+ are being shortlisted. The project
                        objective is to help advance the complete Canadian
                        automotive manufacturing supply chain.
                      </p>
                      <p>
                        Contact Information for the APMA Project Arrow team is
                        as follows:
                      </p>
                      <div className="pl-5">
                        <ul>
                          <li>
                            Media Enquiries:{" "}
                            <a href="mailto:fvolpe@apma.ca">Flavio Volpe</a>
                            {"  "}- President, APMA
                          </li>

                          <li>
                            Technology Evaluation:{" "}
                            <a href="mailto:cdhillon@apma.ca">Colin Dhillon</a>{" "}
                            - CTO, APMA
                          </li>

                          <li>
                            Partnerships:{" "}
                            <a href="mailto:wali@apma.ca">Warren Ali</a> - SVP
                            of Innovation, APMA
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <h3>
                    <strong>Section II – Timeline</strong>
                  </h3>
                  <div className="contentText">
                    <div className=" inlineBlock pb-4">
                      <p>
                        To complete the project, we have set the following
                        timetable. This timeline is subject to change.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="contentText">
                    <div className=" inlineBlock pb-4">
                      <table className="table3">
                        <thead></thead>

                        <tbody>
                          <tr>
                            <td>Milestone</td>
                            <td>Date</td>
                          </tr>
                          <tr>
                            <td>Request for Proposal Sent Out</td>
                            <td>January 11, 2021</td>
                          </tr>
                          <tr>
                            <td>Completed RFP form Sent In</td>
                            <td>March 01, 2021</td>
                          </tr>
                          <tr>
                            <td>Deadline for Proposals (Phase 1)</td>
                            <td>March 01, 2021</td>
                          </tr>
                          <tr>
                            <td>Deadline for Proposal (Phase 2)</td>
                            <td>June 01, 2021</td>
                          </tr>
                          <tr>
                            <td>Project Start Date</td>
                            <td>Q1 2021</td>
                          </tr>
                          <tr>
                            <td>Project Completion Date</td>
                            <td>Q4 2022</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <h3>
                    <strong>
                      Section III - Request for Proposal (RFP) form
                    </strong>
                  </h3>
                  <div className="contentText">
                    <div className=" inlineBlock pb-4">
                      <strong>Company Profile &amp; Contact Information</strong>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="contentText">
                    <div className=" inlineBlock pb-4">
                      <table className="paleBlueRows">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Milestone</th>
                            <th>Details</th>
                          </tr>
                        </thead>

                        <tbody>
                          <tr>
                            <td>1</td>
                            <td>Full Legal Name: </td>
                            <td>
                              <Field
                                type="text"
                                name="fullLegalName"
                                className="text-box"
                                readOnly={true}
                              ></Field>
                            </td>
                          </tr>
                          <tr>
                            <td>2</td>
                            <td>Company Address:</td>
                            <td>
                              {" "}
                              <Field
                                type="text"
                                name="companyAddress"
                                className="text-box"
                                readOnly={true}
                              ></Field>
                            </td>
                          </tr>
                          <tr>
                            <td>3</td>
                            <td>Business website:</td>
                            <td>
                              {" "}
                              <Field
                                type="text"
                                name="businessWebsite"
                                className="text-box"
                                readOnly={true}
                              ></Field>
                            </td>
                          </tr>
                          <tr>
                            <td>4</td>
                            <td>Contact person:</td>
                            <td>
                              {" "}
                              <Field
                                type="text"
                                name="contactPerson"
                                className="text-box"
                                readOnly={true}
                              ></Field>
                            </td>
                          </tr>
                          <tr>
                            <td>5</td>
                            <td>Position:</td>
                            <td>
                              {" "}
                              <Field
                                type="text"
                                name="position"
                                className="text-box"
                                readOnly={true}
                              ></Field>
                            </td>
                          </tr>
                          <tr>
                            <td>6</td>
                            <td>Phone number:</td>
                            <td>
                              {" "}
                              <Field
                                type="text"
                                name="phoneNumber"
                                className="text-box"
                                readOnly={true}
                              ></Field>
                            </td>
                          </tr>
                          <tr>
                            <td>7</td>
                            <td>Mobile number:</td>
                            <td>
                              {" "}
                              <Field
                                type="text"
                                name="mobileNumber"
                                className="text-box"
                                readOnly={true}
                              ></Field>
                            </td>
                          </tr>
                          <tr>
                            <td>8</td>
                            <td>Email address:</td>
                            <td>
                              {" "}
                              <Field
                                type="email"
                                name="profileEmail"
                                className="text-box"
                                readOnly={true}
                              ></Field>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <h3>
                    <strong>
                      Project Arrow CAD Surface files (Exterior/Interior).
                      Download STP files for a better understanding of
                      design/eng. opportunities.
                    </strong>
                  </h3>
                  <div className="contentText">
                    <div className=" inlineBlock pb-4">
                      Project Arrow CAD surface files (Exterior/Interior) are
                      download able here. Use these CAD STP files to understand
                      the different parts/components/systems within the vehicle
                      environment. <br />
                      <i>
                        They do not include the BiW/BiB, Drivetrain/EV
                        Skateboard, CAV Technology or Internal Systems.
                      </i>
                    </div>
                    <button
                      className="btn btn-primary"
                      onClick={() => this.setState({ cadModel: true })}
                    >
                      Download CAD Files
                    </button>
                  </div>
                </div>

                <div className="mt-5">
                  <h3>
                    <strong>Product/Technology Category</strong>
                  </h3>
                  <div className="contentText">
                    <div className=" inlineBlock pb-4">
                      <p>
                        There are hundreds of parts/systems/components on a
                        vehicle. Please use the 'select category' button to
                        drill down to the specific part/system/component that
                        your Company will provide. If you are supplying more
                        than one, please repeat the process.
                      </p>
                      {editMode && (
                        <button
                          className="btn btn-primary mt-3"
                          onClick={() => this.setState({ categoryModal: true })}
                        >
                          Select Category
                        </button>
                      )}
                    </div>
                  </div>
                  {this.renderTreeCategory()}
                </div>

                <div className="mt-5">
                  <h3>
                    <strong>
                      Parent/Child – Components and Systems required{" "}
                    </strong>
                  </h3>
                  <div className="contentText">
                    <div className=" inlineBlock pb-4">
                      <p>
                        For your product/technology offering to function, what
                        other components/systems are required? Please describe
                        both components and systems and known suppliers of this
                        technology.
                      </p>

                      <FieldArray name="parentChildComp">
                        {({ insert, remove, push }) => (
                          <table className="paleBlueRows rfp-table">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Product/Component (Parent)</th>
                                <th>Component/System (Child)</th>
                                <th>Supplier(s)</th>
                                {editMode && <th className="bg-white"></th>}
                              </tr>
                            </thead>

                            <tbody>
                              {values.parentChildComp.length > 0 &&
                                values.parentChildComp.map((friend, index) => (
                                  <tr key={index + "-parentChildComp"}>
                                    <td>{index + 1}</td>
                                    <td>
                                      {" "}
                                      <Field
                                        name={`parentChildComp.${index}.product`}
                                        className="form-control"
                                        component={CustomTextField}
                                        isEdit={editMode}
                                      />
                                    </td>

                                    <td>
                                      {" "}
                                      <Field
                                        name={`parentChildComp.${index}.component`}
                                        className="form-control"
                                        component={CustomTextField}
                                        isEdit={editMode}
                                      />
                                    </td>
                                    <td>
                                      {" "}
                                      <Field
                                        name={`parentChildComp.${index}.suppliers`}
                                        className="form-control"
                                        component={CustomTextField}
                                        isEdit={editMode}
                                      />
                                    </td>
                                    {editMode && (
                                      <td className="bg-white">
                                        <button
                                          type="button"
                                          className="btn btn-danger btn-sm"
                                          onClick={() => remove(index)}
                                        >
                                          X
                                        </button>
                                      </td>
                                    )}
                                  </tr>
                                ))}
                              {editMode && (
                                <tr className="back-none">
                                  <td></td>
                                  <td colSpan="4">
                                    <button
                                      type="button"
                                      className="btn btn-primary"
                                      onClick={() =>
                                        push({
                                          product: "",
                                          component: "",
                                          suppliers: ""
                                        })
                                      }
                                    >
                                      + Add
                                    </button>
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        )}
                      </FieldArray>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <h3>
                    <strong>Overview of Your Solution</strong>
                  </h3>
                  <div className="contentText">
                    <div className="inlineBlock pb-4">
                      <p>
                        Please provide an overview of your solution. For
                        example, describe the technical aspects of the product
                        and/or elements of the service offering.
                      </p>

                      {/* <Editor
                        style={{
                          height: "120px"
                        }}
                        value={values.ourSolution}
                        onTextChange={(e) =>
                          setFieldValue("ourSolution", e.htmlValue)
                        }
                      /> */}

                      <Field
                        name="ourSolution"
                        component={CustomEditor}
                        isEdit={editMode}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <h3>
                    <strong>Computer-Aided Design (CAD) files </strong>
                  </h3>
                  <div className="contentText">
                    <div className=" inlineBlock pb-4">
                      <p>
                        CAD files must be provided of your
                        product/technology/assembly once the APMA team has
                        confirmed your participation on Project Arrow. The
                        objective is to follow best practises and build the
                        zero-emission vehicle in CAD before assembling all
                        parts, components and systems. CAD files to be sent in
                        both native file format and STEP file format.
                      </p>
                      <p>All CAD files should be uploaded by March 01, 2021</p>{" "}
                      <CustomDropZone
                        isEdit={editMode}
                        fileList={values.CADFiles}
                        onChange={(files) => setFieldValue("CADFiles", files)}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <h3>
                    <strong>Valuation</strong>
                  </h3>
                  <div className="contentText">
                    <div className=" inlineBlock pb-4">
                      <p>
                        Please provide a valuation of all products and
                        technologies provided for the Project Arrow
                        zero-emission concept vehicle build. It should include
                        all tooling and manufacturing associated costs and
                        technical/engineering support for your
                        product/technology to be integrated within the vehicle.
                      </p>

                      <FieldArray name="valuation">
                        {({ insert, remove, push }) => (
                          <table className="paleBlueRows rfp-table">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Product/Technology Description</th>
                                <th>Tooling/Manufacturing ($)</th>
                                <th>Tech/Eng. Support ($)</th>
                                {editMode && <th className="bg-white"></th>}
                              </tr>
                            </thead>

                            <tbody>
                              {values.valuation.length > 0 &&
                                values.valuation.map((friend, index) => (
                                  <tr key={index + "-valuation"}>
                                    <td>{index + 1}</td>
                                    <td>
                                      {" "}
                                      <Field
                                        name={`valuation.${index}.productDescription`}
                                        className="form-control"
                                        component={CustomTextField}
                                        isEdit={editMode}
                                      />
                                    </td>

                                    <td>
                                      {" "}
                                      <Field
                                        name={`valuation.${index}.tooling`}
                                        className="form-control"
                                        component={CustomTextField}
                                        isEdit={editMode}
                                      />
                                    </td>
                                    <td>
                                      {" "}
                                      <Field
                                        name={`valuation.${index}.techSupport`}
                                        className="form-control"
                                        component={CustomTextField}
                                        isEdit={editMode}
                                      />
                                    </td>
                                    {editMode && (
                                      <td className="bg-white">
                                        <button
                                          type="button"
                                          className="btn btn-danger btn-sm"
                                          onClick={() => remove(index)}
                                        >
                                          X
                                        </button>
                                      </td>
                                    )}
                                  </tr>
                                ))}
                              {editMode && (
                                <tr className="back-none">
                                  <td></td>
                                  <td colSpan="4">
                                    <button
                                      type="button"
                                      className="btn btn-primary"
                                      onClick={() =>
                                        push({
                                          productDescription: "",
                                          tooling: "",
                                          techSupport: ""
                                        })
                                      }
                                    >
                                      + Add
                                    </button>
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        )}
                      </FieldArray>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <h3>
                    <strong>Safety</strong>
                  </h3>
                  <div className="contentText">
                    <div className=" inlineBlock pb-4">
                      <p>
                        Describe any risks associated with your
                        product/technology solution regarding handling/care and
                        installation/integration into a vehicle. Please provide
                        all safety information with your product/technology
                        package when shipping.
                      </p>

                      {/* <Editor
                        style={{
                          height: "120px"
                        }}
                        value={values.safety}
                        onTextChange={(e) =>
                          setFieldValue("safety", e.htmlValue)
                        }
                      /> */}

                      <FieldArray name="safety">
                        {({ insert, remove, push }) => (
                          <table className="paleBlueRows paleBlueRows1  rfp-table">
                            <tbody>
                              {values.safety.length > 0 &&
                                values.safety.map((friend, index) => (
                                  <tr key={index + "-safety"}>
                                    <td>{index + 1}</td>
                                    <td>
                                      {" "}
                                      <Field
                                        name={`safety.${index}.discription`}
                                        className="form-control"
                                        component={CustomTextField}
                                        isEdit={editMode}
                                      />
                                    </td>
                                    {editMode && (
                                      <td>
                                        <button
                                          type="button"
                                          className="btn btn-danger btn-sm"
                                          onClick={() => remove(index)}
                                        >
                                          X
                                        </button>
                                      </td>
                                    )}
                                  </tr>
                                ))}
                              {editMode && (
                                <tr className="back-none">
                                  <td></td>
                                  <td colSpan="1">
                                    <button
                                      type="button"
                                      className="btn btn-primary"
                                      onClick={() =>
                                        push({
                                          discription: ""
                                        })
                                      }
                                    >
                                      + Add
                                    </button>
                                  </td>
                                  <td></td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        )}
                      </FieldArray>

                      <p>
                        Please provide all safety information with your
                        product/technology package when shipping.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <h3>
                    <strong>Intellectual Property (IP) protection</strong>
                  </h3>
                  <div className="contentText">
                    <div className="inlineBlock pb-4 ">
                      <table className="GeneratedTable">
                        <tbody>
                          <tr>
                            <td>
                              {" "}
                              <strong>Intellectual Property:</strong> Is your
                              product/technology protected?{" "}
                            </td>
                            {editMode ? (
                              <td>
                                <div className="ml-4 form-check-inline ">
                                  <label className="form-check-label">
                                    <Field
                                      type="radio"
                                      value="Yes"
                                      name="intellectualProperty"
                                      className="form-check-input"
                                    ></Field>
                                    Yes
                                  </label>
                                </div>
                                <div className="form-check-inline">
                                  <label className="form-check-label">
                                    <Field
                                      type="radio"
                                      value="No"
                                      className="ml-2"
                                      name="intellectualProperty"
                                      className="form-check-input"
                                    ></Field>
                                    No
                                  </label>
                                </div>
                              </td>
                            ) : (
                              <td>
                                <b>{initialValues.intellectualProperty}</b>
                              </td>
                            )}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p>
                      If you answer NO, please file for any applicable patents
                      and intellectual property on the product/technology before
                      releasing to the APMA and its partners.
                    </p>
                  </div>
                </div>
                <hr className="hr-line hr-border-color"></hr>
                <div className="mt-5">
                  <h3>
                    <strong>Section IV – Selection Criteria</strong>
                  </h3>
                  <div className="contentText">
                    <div className=" inlineBlock pb-4">
                      All product and technology offerings will be considered
                      based upon the details provided in the RFP form and
                      supporting documents/files. Consideration will be given to
                      each application and its Company. The following criteria
                      will be the primary tools used in the selection process:{" "}
                    </div>
                    <div className="pl-5">
                      <p>
                        (1) Completed RFP form submission by stated deadlines
                      </p>
                      <p>
                        (2) The perceived effectiveness of the proposed solution
                        in supporting the build of the zero-emission concept
                        vehicle
                      </p>
                      <p>
                        (3) The ability of the company to provide both
                        product/technology and engineering support for
                        product/technology integration
                      </p>
                      <p>
                        (4) Companies that can execute on automotive ramp up
                        capacity
                      </p>
                      <p>
                        (5) Companies that can provide their technology in both
                        virtual and physical formats.
                      </p>
                    </div>
                    <p>
                      The APMA may suspend or discontinue proposals at any time
                      without notice or obligation to the company that submitted
                      the proposal.
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <h3>
                    <strong>Eligibility and Evaluation Criteria</strong>
                  </h3>
                  <div className="contentText">
                    <div className=" inlineBlock pb-4">
                      To be considered a partner on the Project Arrow vehicle,
                      applicants must have office/manufacturing presence in
                      Canada*.{" "}
                    </div>

                    <p>The success partners will commit to the following:</p>

                    <table className="table2">
                      <tbody>
                        <tr>
                          <td>
                            <strong>#</strong>
                          </td>
                          <td>
                            <strong>Description</strong>
                          </td>
                          <td className="text-center">
                            <strong>Response</strong>
                          </td>
                        </tr>
                        <tr>
                          <td>1</td>
                          <td>
                            Provide product/technology at no cost to the project
                          </td>
                          {editMode ? (
                            <td className="text-center">
                              <div className="form-check-inline">
                                <label className="form-check-label">
                                  <Field
                                    type="radio"
                                    value="Yes"
                                    name="provideTechAtNoCost"
                                    className="form-check-input"
                                  ></Field>
                                  Yes
                                </label>
                              </div>
                              <div className="form-check-inline">
                                <label className="form-check-label">
                                  <Field
                                    type="radio"
                                    value="No"
                                    className="ml-2"
                                    name="provideTechAtNoCost"
                                    className="form-check-input"
                                  ></Field>
                                  No
                                </label>
                              </div>
                            </td>
                          ) : (
                            <td className="text-center">
                              <b>{initialValues.provideTechAtNoCost}</b>
                            </td>
                          )}
                        </tr>
                        <tr>
                          <td>2</td>
                          <td>
                            Provide technology/integration support at no cost to
                            the project
                          </td>
                          {editMode ? (
                            <td className="text-center">
                              <div className="form-check-inline">
                                <label className="form-check-label">
                                  <Field
                                    type="radio"
                                    value="Yes"
                                    name="provideTechSupportAtNoCost"
                                    className="form-check-input"
                                  ></Field>
                                  Yes
                                </label>
                              </div>
                              <div className="form-check-inline">
                                <label className="form-check-label">
                                  <Field
                                    type="radio"
                                    value="No"
                                    className="ml-2"
                                    name="provideTechSupportAtNoCost"
                                    className="form-check-input"
                                  ></Field>
                                  No
                                </label>
                              </div>
                            </td>
                          ) : (
                            <td className="text-center">
                              <b>{initialValues.provideTechSupportAtNoCost}</b>
                            </td>
                          )}
                        </tr>
                        <tr>
                          <td>3</td>
                          <td>
                            Are the Products, Components, and Assemblies
                            Manufactured in Canada?
                          </td>
                          {editMode ? (
                            <td className="text-center">
                              <div className="form-check-inline">
                                <label className="form-check-label">
                                  <Field
                                    type="radio"
                                    value="Yes"
                                    name="isManufacturedInCanada"
                                    className="form-check-input"
                                  ></Field>
                                  Yes
                                </label>
                              </div>
                              <div className="form-check-inline">
                                <label className="form-check-label">
                                  <Field
                                    type="radio"
                                    value="No"
                                    className="ml-2"
                                    name="isManufacturedInCanada"
                                    className="form-check-input"
                                  ></Field>
                                  No
                                </label>
                              </div>
                            </td>
                          ) : (
                            <td className="text-center">
                              <b>{initialValues.isManufacturedInCanada}</b>
                            </td>
                          )}
                        </tr>
                        <tr>
                          <td>4</td>
                          <td>
                            Is the Product/Technology cutting-edge, and will it
                            promote Canada’s automotive capabilities?
                          </td>
                          {editMode ? (
                            <td className="text-center">
                              <div className="form-check-inline">
                                <label className="form-check-label">
                                  <Field
                                    type="radio"
                                    value="Yes"
                                    name="isCuttingEdge"
                                    className="form-check-input"
                                  ></Field>
                                  Yes
                                </label>
                              </div>
                              <div className="form-check-inline">
                                <label className="form-check-label">
                                  <Field
                                    type="radio"
                                    value="No"
                                    className="ml-2"
                                    name="isCuttingEdge"
                                    className="form-check-input"
                                  ></Field>
                                  No
                                </label>
                              </div>
                            </td>
                          ) : (
                            <td className="text-center">
                              <b>{initialValues.isCuttingEdge}</b>
                            </td>
                          )}
                        </tr>
                      </tbody>
                    </table>
                    <p className="mt-2">
                      <em>
                        *If a particular part/system/component/assembly is not
                        available within Canada, then the APMA source it from
                        another jurisdiction
                      </em>
                    </p>
                    <div className="inlineBlock pb-4">
                      The APMA will evaluate all product and technology
                      proposals submitted and rely upon the Project Arrow Design
                      and Engineering (D&amp;E) team to make the final decision.
                      Where there is a dispute or multiple companies with
                      similar products/technologies, the APMA's Advisory
                      Committee will provide guidance to the D&amp;E team.
                    </div>
                  </div>
                </div>
                <hr className="hr-line hr-border-color"></hr>

                <div>
                  <h3>
                    <strong>Section V – Terms and Conditions</strong>
                  </h3>
                  <div className="contentText">
                    <div className="pl-5">
                      <p>
                        (1){" "}
                        <strong>
                          <u>
                            <i>Warranties of APMA.</i>
                          </u>
                        </strong>{" "}
                        <em>
                          This RFP is only an invitation for proposal, and no
                          contractual obligation on behalf of the APMA
                          whatsoever shall arise from the RFP process unless and
                          until a formal contract is signed between the APMA and
                          the Company. This RFP does not commit the APMA to pay
                          any cost incurred in the preparation or submission of
                          any proposal or to procure or contract for any
                          services.
                        </em>
                      </p>
                      <p>
                        (2){" "}
                        <strong>
                          <u>
                            <i>RFP Management.</i>
                          </u>
                        </strong>{" "}
                        <em>
                          The APMA reserves the right to accept or reject any
                          and all proposals, to revise the RFP, to request one
                          or more re-submissions or clarification from one or
                          more Companies, or to cancel the process in part or
                          whole. No Company/Vendor is obligated to respond to or
                          to continue to respond to the RFP after the submission
                          and closing date. The APMA will, at its discretion,
                          award the contract to the responsible vendor
                          submitting the best proposal that complies with the
                          RFP. The APMA may, at its sole discretion, reject any
                          or all proposals received or waive minor defects,
                          irregularities, or informalities therein.
                        </em>
                      </p>
                      <p>
                        (3){" "}
                        <strong>
                          <u>
                            <i>Conflict of Interest.</i>
                          </u>
                        </strong>{" "}
                        <em>
                          The Company/Vendor shall not engage in any
                          communication that would constitute or create a
                          Conflict of Interest.
                        </em>
                      </p>
                      <p>
                        (4){" "}
                        <strong>
                          <u>
                            <i>Conflict of Interest.</i>
                          </u>
                        </strong>{" "}
                        <em>
                          The APMA and the Company/Vendor shall execute a mutual
                          non-disclosure agreement. This RFP is both
                          confidential and proprietary to APMA, and APMA
                          reserves the right to recall the RFP in its entirety
                          or in part. Company/Vendor cannot and agree that they
                          will not duplicate, distribute or otherwise
                          disseminate or make available this document or the
                          information contained in it without the express
                          written consent of APMA. Company/Vendor shall not
                          include or reference this RFP in any publicity without
                          prior written approval from the client, which, if
                          granted, shall be granted by the individual named
                          above. Company/Vendor must accept all of the terms and
                          condition without exception. All responses to the RFP
                          will become the property of APMA and will not be
                          returned.
                        </em>
                      </p>
                      <p>
                        (5){" "}
                        <strong>
                          <u>
                            <i>Contract Negotiations.</i>
                          </u>
                        </strong>{" "}
                        <em>
                          At the completion of the selection process, the APMA
                          will enter into negotiations with the selected
                          Company/Vendor. The Company/Vendor should also be
                          aware that the following documents would be included
                          as attachments to the final contract:
                        </em>
                      </p>
                      <div className="pl-5">
                        <ul>
                          <li>
                            <em>Any modifications to the proposal.</em>
                          </li>
                          <li>
                            <em>
                              An implementation Plan identifying the tasks to be
                              completed with milestones, the assigned
                              responsibilities, and the scheduled completion
                              dates.
                            </em>
                          </li>
                          <li>
                            <em>Proof of sufficient liability insurance</em>
                          </li>
                          <li>
                            <em>
                              Any other documents deemed necessary by the APMA
                            </em>
                          </li>
                        </ul>
                      </div>
                      <p>
                        {" "}
                        (6){" "}
                        <strong>
                          <u>
                            <i>Governing Law. </i>
                          </u>
                        </strong>{" "}
                        <em>
                          This RFP is to be construed according to and will be
                          governed by the laws of the Province of Ontario and
                          Canada.
                        </em>
                      </p>
                      <p>
                        (7){" "}
                        <strong>
                          <u>
                            <i>Due Authority.</i>
                          </u>
                        </strong>{" "}
                        <em>
                          Company/Vendor has full authority to execute and
                          deliver this RFP and will not violate any other
                          agreement to which Company/Vendor is or becomes a
                          party, nor any law, court order or decree to which
                          Company/Vendor is subject.
                        </em>
                      </p>
                      <p>
                        (8){" "}
                        <strong>
                          <u>
                            <i>No Untrue Statements.</i>
                          </u>
                        </strong>{" "}
                        <em>
                          Company/Vendor has not provided any untrue or
                          misleading statement of a material fact in connection
                          with this RFP or omitted any material fact which APMA
                          may reasonably rely on in making its decision.
                        </em>
                      </p>
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
              <Dialog
                header="Product/Technology Category"
                visible={this.state.categoryModal}
                style={{ width: "50vw" }}
                onHide={this.closeCategoryModal}
                contentClassName="assign-badge-modal-content"
              >
                <Tree
                  value={productCategories}
                  selectionMode="checkbox"
                  selectionKeys={this.state.selectedNodeKeys}
                  onSelectionChange={(e) => {
                    this.setState({ selectedNodeKeys: e.value });
                  }}
                />
              </Dialog>

              <Dialog
                header="By clicking here and proceeding to the RFP From you acknowledge the following:  "
                visible={this.state.cadModel}
                style={{ width: "50vw" }}
                onHide={this.closeCadModal}
              >
                <ul>
                  <li>
                    That you executed the Non-disclosure Agreement (NDA) in the
                    portal.
                  </li>
                  <li>
                    That you have the authority to bind the organization that
                    you represent.
                  </li>
                  <li>
                    That you agree to be bound by the terms, conditions and
                    recitals therein.
                  </li>
                  <li>
                    That you will not disclose any of the confidential
                    information subject to the NDA and pertaining to Project
                    Arrow.
                  </li>
                </ul>
                <label className="form-check-label pl-4">
                  <input
                    type="checkbox"
                    name="cadchecked"
                    checked={this.state.cadConditonCheck}
                    onChange={this.handleCadConditionChecked}
                  ></input>{" "}
                  I Agree
                </label>

                <div className="text-right">
                  {" "}
                  <button
                    className="btn btn-primary mt-2"
                    onClick={this.getCadfiles}
                    disabled={!this.state.cadConditonCheck}
                  >
                    Download CAD Files
                  </button>
                </div>
              </Dialog>
            </form>
          );
        }}
      </Formik>
    );
  }
}
