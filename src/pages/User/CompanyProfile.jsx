import React, { Component } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { InputMask } from "primereact/inputmask";
import { ProgressBar } from "primereact/progressbar";
import { Accordion, AccordionTab } from "primereact/accordion";
import {
  companyService,
  authenticationService,
  sectorService,
  naicsService,
} from "../../_services";
import { serviceKeywordService } from "../../_services/servicesKeywords.service";
import Select from "react-select";
import {
  sectorOptions,
  getSectorPreselectedOptions,
  getOptionForSingleSelect,
  DOCS_FILES,
} from "../../_helpers";
import {
  isFormCompleted,
  countProfileCompletionStateByField,
} from "../../_helpers/_helperFunctions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import axios from "axios";
import config from "../../config";
import swal from "sweetalert";
import { Dialog } from "primereact/dialog";
import { CustomModal } from "../../components/CustomModal";
import ReactPlayer from "react-player";
import {
  Progress,
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import {
  removeAllDotsButLast,
  getFileExtension,
} from "../../_helpers/_helperFunctions";
import slugify from "slugify";
import VideoThumbnail from "react-video-thumbnail";
import { FileIcon, defaultStyles } from "react-file-icon";
import {
  AUDIO_FILES,
  VIDEO_FILES,
  DOCS_AND_IMAGES,
  IMAGE_TYPES,
} from "../../_helpers";
import {
  countries,
  city,
  employeesAtCurrentLocation,
  companiesSector,
  industriesSupplied,
  certification,
  businessLeadership,
  governmentSupplier,
  exportMarkets,
  industriesAffliation,
  revenue,
  activeNonActive,
  materialCapabilites,
  headQuarterBranch,
} from "../../_helpers/companyProfileDropDownData";

const SECTION_LIST = [
  "demographics",
  "contactDetails",
  "aboutResources",
  "aboutBusinesses",
  "aboutOpportunities",
];

const CompanyLogo = (props) => {
  return (
    <img
      src={props.logo ? props.logo : "/assets/images/weedc_120X120.png"}
      className="company-profile-logo-bg"
      alt="logo"
    />
  );
};
export default class CompanyProfile extends Component {
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
      videoModal: false,
      sectorData: [],
      servicesKeywordsData: [],
      pendingRequestData: {},
      serviceKeyword: [],
      resourceSectionUpdatedAt: "",
      companiesSectorArray: [],
      industriesSuppliedArray: [],
      businessLeadershipArray: [],
      materialCapabilitesArray: [],
      catId: "",
      NAICS1: [],
      NAICS2: [],
      NAICS3: [],
      NAICS4: [],
      NAICS5: [],
      docsViewModal: false,
      docFile: "",
    };

    //  this.sectorOptions = sectorOptions;
  }

  componentDidMount() {
    this.getCompanyById();
    this.getFilesByCompanyId();
    this.getAllSectors();
    this.getAllServiceKeyword();
    this.getCompanyPendingProfileReq();
    this.getNaicsChildFromParent();
  }

  getAllSectors = () => {
    sectorService.getAllSectors().then((data) => {
      if (data) {
        this.setState({ sectorData: data.Data });
      }
    });
  };

  getAllServiceKeyword = () => {
    serviceKeywordService.getAllServiceKeyword().then((data) => {
      if (data) {
        this.setState({ servicesKeywordsData: data.Data });
      }
    });
  };

  getCompanyPendingProfileReq = () => {
    companyService
      .getCompanyPendingProfileReq(this.state.currentUser.id)
      .then((data) => {
        let pendingRequests = data.Data;
        let pendingRequestData = {};
        SECTION_LIST.forEach((section) => {
          pendingRequests.forEach((item) => {
            if (section === item.section) {
              pendingRequestData[section] = item.sectionData;
            }
          });
        });

        this.setState({ pendingRequestData });
      });
  };

  getNaicsChildFromParent = (catId) => {
    naicsService
      .getNaicsChildFromParent({ catId: catId || this.state.catId })
      .then((data) => {
        let name = data?.Data[0].type.replace(/ /g, "");
        if (name === "NAICS1") {
          let NAICS1 = [];
          data.Data.map((item) => {
            NAICS1.push({ value: item.catId, label: item.category });
          });
          this.setState({ NAICS1 });
        }
        if (name === "NAICS2") {
          let NAICS2 = [];
          data.Data.map((item) => {
            NAICS2.push({ value: item.catId, label: item.category });
          });
          this.setState({ NAICS2 });
        }
        if (name === "NAICS3") {
          let NAICS3 = [];
          data.Data.map((item) => {
            NAICS3.push({ value: item.catId, label: item.category });
          });
          this.setState({ NAICS3 });
        }
        if (name === "NAICS4") {
          let NAICS4 = [];
          data.Data.map((item) => {
            NAICS4.push({ value: item.catId, label: item.category });
          });
          this.setState({ NAICS4 });
        }
        if (name === "NAICS5") {
          let NAICS5 = [];
          data.Data.map((item) => {
            NAICS5.push({ value: item.catId, label: item.category });
          });
          this.setState({ NAICS5 });
        }
      });
  };

  toggleAudio = () => {
    this.setState({
      audioModal: !this.state.audioModal,
    });
  };

  toggleVideo = () => {
    this.setState({
      videoModal: !this.state.videoModal,
    });
  };

  toogleDocsView = () => {
    this.setState({
      docsViewModal: !this.state.docsViewModal,
    });
  };

  togglefileViewer = () => {
    this.setState((state) => {
      return { fileViewer: !state.fileViewer };
    });
  };

  getCompanyById = () => {
    companyService.getCompanyById(this.state.currentUser.id).then((data) => {
      if (data && data.Status) {
        let isDemographicsComplete = isFormCompleted(
          data.Data.demographics,
          10,
          "demographics"
        );

        let demographicsFieldPercentage = countProfileCompletionStateByField(
          data.Data.demographics,
          10,
          "demographics"
        );

        let isContactDetailsComplete = isFormCompleted(
          data.Data.contactDetails,
          11,
          "contactDetails"
        );

        let contactDetailsFieldPercentage = countProfileCompletionStateByField(
          data.Data.contactDetails,
          11,
          "contactDetails"
        );

        let isAboutResourcesComplete = isFormCompleted(
          data.Data.aboutResources,
          10,
          "aboutResources"
        );
        let aboutResourcesFieldPercentage = countProfileCompletionStateByField(
          data.Data.aboutResources,
          11,
          "aboutResources"
        );

        let isAboutBusinessesComplete = isFormCompleted(
          data.Data.aboutBusinesses,
          14,
          "aboutBusinesses"
        );
        let isAboutOpportunitiesComplete = isFormCompleted(
          data.Data.aboutOpportunities,
          8,
          "aboutOpportunities"
        );
        let profileCompletionArray = [
          isDemographicsComplete,
          isContactDetailsComplete,
          isAboutResourcesComplete,
          isAboutBusinessesComplete,
          isAboutOpportunitiesComplete,
        ];
        let profileStatusPercent = 0;
        profileCompletionArray.forEach((section) => {
          if (section) {
            profileStatusPercent += 33.3;
          }
        });
        this.setState({
          companyData: data.Data,
          profileLogo: data.Data.companyLogo,
          isDemographicsComplete,
          isContactDetailsComplete,
          isAboutResourcesComplete,
          isAboutBusinessesComplete,
          isAboutOpportunitiesComplete,
          profileCompletionPercent:
            (demographicsFieldPercentage +
              contactDetailsFieldPercentage +
              aboutResourcesFieldPercentage) *
            1.6949,
          serviceKeyword: data.Data.serviceKeywords.map((keyword) => {
            return { value: keyword, label: keyword };
          }),
          resourceSectionUpdatedAt: data.Data.resourceSectionUpdatedAt,
          industriesSuppliedArray:
            data.Data.aboutResources.industriesSupplied !== null &&
            data.Data.aboutResources.industriesSupplied.map((item) => {
              if (item === "Other") return { value: item, label: item };
            }),
          businessLeadershipArray:
            data.Data.aboutResources.businessLeadership !== null &&
            data.Data.aboutResources.businessLeadership.map((item) => {
              if (item === "Other") return { value: item, label: item };
            }),
          materialCapabilitesArray:
            data.Data.aboutResources.materialCapabilites !== null &&
            data.Data.aboutResources.materialCapabilites.map((item) => {
              if (item === "Other") return { value: item, label: item };
            }),
        });
      }
    });
  };

  getFilesByCompanyId = () => {
    companyService
      .getFilesByCompanyId(this.state.currentUser.id)
      .then((data) => {
        if (data && data.Status) {
          this.setState({
            companyFiles: data.Data,
          });
        }
      });
  };

  saveServices = (e) => {
    let requestData = {
      currentUserId: this.state.currentUser.id,
      serviceKeywords: e !== null ? e.map((label) => label.value) : [],
    };

    companyService.saveServiceKeyword(requestData).then((data) => {
      if (data) {
        // this.getCompanyById();
      }
    });
    this.setState({ serviceKeyword: e });
  };

  getThumbnail = (file) => {
    let fileExtension = file.originalname.split(".");

    if (VIDEO_FILES.includes(fileExtension[1])) {
      return <VideoThumbnail videoUrl={file.location} />;
    } else if (IMAGE_TYPES.includes(fileExtension[1].toLowerCase())) {
      return (
        <CardImg
          width="100%"
          src={file.location}
          alt={file.title ? file.title : file.originalname}
          className="cursor-pointer cardRatio"
          onClick={() => {
            this.getFileFromKey(
              file.key,
              file.title || file.originalname,
              file._id
            );
          }}
        />
      );
    } else {
      return (
        <FileIcon
          extension={fileExtension[1]}
          {...defaultStyles[fileExtension[1]]}
        />
      );
    }
  };

  getFileFromKey(key, filename) {
    let requestBody = { key };
    companyService.getSignedLinkFromKey(requestBody).then((data) => {
      let fileExtension = getFileExtension(key);
      console.log("fileExtension: ", fileExtension);
      if (AUDIO_FILES.includes(fileExtension)) {
        this.setState({
          mediaUrl: data.Data.url,
          filename: filename,
        });
        this.toggleAudio();
      } else if (VIDEO_FILES.includes(fileExtension)) {
        this.setState({
          mediaUrl: data.Data.url,
          filename: filename,
        });
        this.toggleVideo();
      } else if (DOCS_AND_IMAGES.includes(fileExtension)) {
        this.setState({
          mediaUrl: data.Data.url,
          filename: filename,
          fileType: getFileExtension(key),
          selectedFileType: "file",
        });

        this.togglefileViewer();
      } else {
        window.open(data.Data.url, "_blank");
      }
    });
  }

  openFileUploadModal = () => {
    this.setState({ fileUploadModal: true });
  };

  closeFileUploadModal = () => {
    this.setState({ fileUploadModal: false });
  };

  customHeader = (headerTitle, demographics = {}, isComplete) => {
    return (
      <div style={{ color: "#212529" }}>
        {headerTitle} -{" "}
        {demographics.updatedAt
          ? moment(demographics.updatedAt).format("MM/DD/YYYY hh:mm a")
          : null}{" "}
        <FontAwesomeIcon
          icon={faCheckCircle}
          style={{ color: isComplete ? "#4cbb17" : "#ffa500" }}
        />
      </div>
    );
  };

  customHeaderForFiles = (headerTitle) => {
    return (
      <div style={{ color: "#212529" }}>
        {headerTitle} -{" "}
        {moment(this.state.resourceSectionUpdatedAt).format(
          "MM/DD/YYYY hh:mm a"
        )}
      </div>
    );
  };

  changeProfilepic(event) {
    // dataDispatch({ type: 'photoLoader', payload: true })
    // console.log(event.target.files)
    let selectedProfile = event.target.files;
    // console.log('the file object', selectedProfile[0])
    // setProfilepic(event.target.files)

    axios
      .post(
        `${config.apiUrl}/api/v1/companies/profile-image`,
        {
          fileName: "company-logos/" + selectedProfile[0].name.toLowerCase(),
          fileType: selectedProfile[0].type,
        },
        {
          headers: {
            Authorization: `Bearer ${this.state.currentUser.token}`,
            isenc: localStorage.getItem("isenc")
              ? parseInt(localStorage.getItem("isenc"))
              : 0,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        var returnData = response.data.Data;
        var signedRequest = returnData.signedRequest;
        var url = returnData.url;
        // this.setState({ url: url });
        // console.log("Recieved a signed request " + signedRequest);
        // Put the fileType in the headers for the upload
        var options = {
          headers: {
            "Content-Type": selectedProfile[0].type,
          },
        };
        axios
          .put(signedRequest, selectedProfile[0], options)
          .then((result) => {
            // console.log("Response from s3", result);
          })
          .catch((error) => {
            alert("ERROR " + JSON.stringify(error));
          });
        companyService
          .updateLogo(this.state.currentUser.id, {
            logoUrl: url,
          })
          .then((r) => {
            this.setState({
              success: true,
              imageLoading: false,
              profileLogo: url,
            });
            //this.getCompanyById();
            authenticationService.refreshApmaProfileImage(url);
          });
      })
      .catch((error) => {
        alert(JSON.stringify(error));
      });
  }

  deleteFile(fileId) {
    swal({
      title: "Are you sure!",
      text: "You want to delete this file?",
      buttons: ["No", "Yes"],
      icon: "warning",
      dangerMode: true,
    }).then((result) => {
      if (result) {
        let requestBody = {
          fileId: fileId,
          companyId: this.state.currentUser.id,
          currentUserId: this.state.currentUser.id,
        };
        companyService
          .deleteResourceFile(requestBody)
          .then((data) => {
            this.setState({
              resourceSectionUpdatedAt: new Date().getTime(),
            });
            swal("File deleted successfully", "", "success");
            this.getFilesByCompanyId();
          })
          .catch((error) => {
            console.log("error: ", error);
          });
      }
    });
  }

  render() {
    const {
      companyData,
      isDemographicsComplete,
      isContactDetailsComplete,
      isAboutResourcesComplete,
      isAboutBusinessesComplete,
      isAboutOpportunitiesComplete,
      url,
      companyFiles,
      sectorData,
      servicesKeywordsData,
      pendingRequestData,
      serviceKeyword,
      NAICS1,
      NAICS2,
      NAICS3,
      NAICS4,
      NAICS5,
    } = this.state;
    const {
      demographics,
      contactDetails,
      aboutResources,
      aboutBusinesses,
      aboutOpportunities,
      serviceKeywords,
    } = companyData;

    let sector = [];
    sectorData.map((key) => {
      sector.push({
        value: key.sectorName,
        label: key.sectorName,
      });
    });

    let servicesKeywords = [];
    if (servicesKeywordsData.length) {
      servicesKeywordsData.map((key) => {
        servicesKeywords.push({
          value: key.serviceKeyword,
          label: key.serviceKeyword,
        });
      });
    }

    return (
      <div className="p-grid">
        <div className="p-col-12">
          <div className="card">
            <div className="row">
              <div className="col-md-3 text-center">
                <div className="mb-2">
                  <span>Company Logo</span>
                </div>
                <CompanyLogo logo={this.state.profileLogo} />
                <div className="mt-2">
                  <label className="custom-logo-upload">
                    <input
                      type="file"
                      onChange={(e) => {
                        // dataDispatch({ type: 'photoLoader', payload: true })

                        this.changeProfilepic(e);
                      }}
                    />
                    Change Logo
                  </label>
                </div>
              </div>
              <div className="col-md-9">
                <div className="row">
                  <div className="col-12">
                    <div className="mt-3">
                      <span>Profile completion status:</span>
                      <ProgressBar
                        value={Math.ceil(this.state.profileCompletionPercent)}
                      />
                    </div>
                  </div>
                  {/* <div className="col-12">
                    <div className="mt-3">
                      <label>Services/Keywords:</label>

                      <Select
                        isMulti
                        value={this.state.serviceKeyword}
                        options={servicesKeywords}
                        onChange={(e) => {
                          this.saveServices(e);
                        }}
                      />
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-col-12">
          <Accordion
            style={{ backgroundColor: "#dbebf8 !important" }}
            activeIndex={this.state.activeIndex}
            onTabChange={(e) => this.setState({ activeIndex: e.index })}
          >
            <AccordionTab
              headerStyle={{ color: "#dbebf8 !important" }}
              header={this.customHeader(
                "Company Overview",
                demographics,
                isDemographicsComplete
              )}
            >
              <Formik
                enableReinitialize={true}
                initialValues={{
                  companyTitle:
                    pendingRequestData.demographics?.companyTitle ||
                    demographics?.companyTitle ||
                    "",
                  sector: pendingRequestData.demographics
                    ? getSectorPreselectedOptions(
                        pendingRequestData.demographics.sector
                      )
                    : demographics
                    ? getSectorPreselectedOptions(demographics.sector)
                    : [],
                  parentName:
                    pendingRequestData.demographics?.parentName ||
                    demographics?.parentName ||
                    "",
                  description:
                    pendingRequestData.demographics?.description ||
                    demographics?.description ||
                    "",
                  address:
                    pendingRequestData.demographics?.address ||
                    demographics?.address ||
                    "",
                  address1:
                    pendingRequestData.demographics?.address1 ||
                    demographics?.address1 ||
                    "",

                  municipality: pendingRequestData.demographics
                    ? getSectorPreselectedOptions(
                        pendingRequestData.demographics.municipality
                      )
                    : demographics
                    ? getSectorPreselectedOptions(demographics.municipality)
                    : [],

                  city:
                    pendingRequestData.demographics?.city ||
                    demographics?.city ||
                    "",
                  province:
                    pendingRequestData.demographics?.province ||
                    demographics?.province ||
                    "",
                  country: pendingRequestData.demographics
                    ? getSectorPreselectedOptions(
                        pendingRequestData.demographics.country
                      )
                    : demographics
                    ? getSectorPreselectedOptions(demographics.country)
                    : [],
                  postalCode:
                    pendingRequestData.demographics?.postalCode ||
                    demographics?.postalCode ||
                    "",
                  headQuarterOrBranch: pendingRequestData.demographics
                    ? getOptionForSingleSelect(
                        pendingRequestData.demographics.headQuarterOrBranch
                      )
                    : demographics
                    ? getOptionForSingleSelect(demographics.headQuarterOrBranch)
                    : "",

                  // HQAddress:
                  //   pendingRequestData.demographics?.HQAddress ||
                  //   demographics?.HQAddress ||
                  //   "",
                  HQCountry: pendingRequestData.demographics
                    ? getSectorPreselectedOptions(
                        pendingRequestData.demographics.HQCountry
                      )
                    : demographics
                    ? getSectorPreselectedOptions(demographics.HQCountry)
                    : [],
                  HQCity:
                    pendingRequestData.demographics?.HQCity ||
                    demographics?.HQCity ||
                    "",
                }}
                onSubmit={(formData, { setStatus, setSubmitting }) => {
                  let requestData = {
                    section: "demographics",
                    sectionData: {
                      ...formData,
                      sector:
                        formData.sector !== null
                          ? formData.sector.map((item) => item.value)
                          : null,
                      municipality:
                        formData.municipality !== null
                          ? formData.municipality.map((item) => item.value)
                          : null,
                      HQCountry:
                        formData.HQCountry !== null
                          ? formData.HQCountry.map((item) => item.value)
                          : null,
                      headQuarterOrBranch:
                        formData.headQuarterOrBranch !== null
                          ? [formData.headQuarterOrBranch.value]
                          : [],

                      country:
                        formData.country !== null
                          ? formData.country.map((item) => item.value)
                          : null,
                    },
                    companyId: companyData._id,
                    companyTitle: demographics.companyTitle,
                    //industry: companyData.industry,
                    email: companyData.email,
                  };

                  setSubmitting(true);
                  companyService
                    .createProfileChangeRequest(requestData)
                    .then((data) => {
                      setSubmitting(false);
                      swal("Your request has been submitted", "", "success");
                      this.getCompanyPendingProfileReq();
                      this.setState({ activeIndex: 1 });
                    })
                    .catch((error) => {
                      setSubmitting(false);

                      swal(error, "", "error");
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
                }) => (
                  <Form>
                    <div className="row">
                      <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">Sector</label>
                        <Select
                          options={sector}
                          value={values.sector}
                          onChange={(v) => setFieldValue("sector", v)}
                          isMulti
                        />
                        <ErrorMessage
                          name="sector"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">Company name</label>
                        <Field
                          name="companyTitle"
                          type="text"
                          placeholder="Company Title"
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
                    </div>

                    <div className="row">
                      <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">
                          Parent company name
                        </label>
                        <Field
                          name="parentName"
                          type="text"
                          placeholder="Parent Title"
                          className={
                            "form-control" +
                            (errors.parentName && touched.parentName
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="parentName"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">Description</label>
                        <Field
                          name="description"
                          type="text"
                          placeholder="Description"
                          component="textarea"
                          className={
                            "form-control" +
                            (errors.description && touched.description
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="description"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                    </div>

                    <div className="form-group required">
                      <label className="control-label">Address</label>
                      <Field
                        name="address"
                        type="text"
                        placeholder="Street address"
                        className={
                          "form-control" +
                          (errors.address && touched.address
                            ? " is-invalid"
                            : "")
                        }
                      />
                      <ErrorMessage
                        name="address"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>

                    {/* This is new Added Address Field */}
                    <div className="form-group required">
                      {/* <label className="control-label">Address</label> */}
                      <Field
                        name="address1"
                        type="text"
                        placeholder="Street address line 2"
                        className={
                          "form-control" +
                          (errors.address1 && touched.address1
                            ? " is-invalid"
                            : "")
                        }
                      />
                      <ErrorMessage
                        name="address1"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>

                    <div className="row">
                      <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">City</label>
                        <Field
                          name="city"
                          type="text"
                          placeholder="City"
                          className={
                            "form-control" +
                            (errors.city && touched.city ? " is-invalid" : "")
                          }
                        />
                        <ErrorMessage
                          name="city"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>

                      <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">Municipality</label>
                        <Select
                          options={city}
                          value={values.municipality}
                          onChange={(v) => setFieldValue("municipality", v)}
                          isMulti
                        />
                        <ErrorMessage
                          name="region"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">Province</label>
                        <Field
                          name="province"
                          type="text"
                          placeholder="Province"
                          className={
                            "form-control" +
                            (errors.province && touched.province
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="employeeCount"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">Country</label>

                        <Select
                          options={countries}
                          value={values.country}
                          onChange={(v) => setFieldValue("country", v)}
                          isMulti
                        />

                        <ErrorMessage
                          name="country"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">Postal code</label>
                        <Field
                          name="postalCode"
                          type="text"
                          placeholder="Postal Code"
                          className={
                            "form-control" +
                            (errors.postalCode && touched.postalCode
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="postalCode"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">
                          Headquarters or Branch
                        </label>
                        <Select
                          options={headQuarterBranch}
                          value={values.headQuarterOrBranch}
                          onChange={(v) =>
                            setFieldValue("headQuarterOrBranch", v)
                          }
                        />
                        <ErrorMessage
                          name="headQuarterOrBranch"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                    </div>

                    {/* <div className="form-group required">
                      <label className="control-label">
                        Headquarter Address
                      </label>
                      <Field
                        name="HQAddress"
                        type="text"
                        placeholder="Headquarter Address"
                        className={
                          "form-control" +
                          (errors.HQAddress && touched.HQAddress
                            ? " is-invalid"
                            : "")
                        }
                      />
                      <ErrorMessage
                        name="HQAddress"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div> */}

                    <div className="row">
                      <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">
                          Headquarters – City
                        </label>
                        <Field
                          name="HQCity"
                          type="text"
                          placeholder="Headquarters City"
                          className={
                            "form-control" +
                            (errors.HQCity && touched.HQCity
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="HQCity"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>

                      <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">
                          Headquarters – Country
                        </label>
                        <Select
                          options={countries}
                          value={values.HQCountry}
                          onChange={(v) => setFieldValue("HQCountry", v)}
                          isMulti
                        />
                        <ErrorMessage
                          name="region"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="offset-md-3 col-md-6">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="btn btn-primary btn-lg btn-block text-uppercase"
                        >
                          Save &amp; Next
                          {isSubmitting && (
                            <span>
                              {" "}
                              <i className="pi pi-spin pi-spinner"></i>
                            </span>
                          )}
                        </button>
                      </div>
                      {pendingRequestData.demographics ? (
                        <div className="col-md-3">
                          <div className="pending-req-box bg-warning text-center px-3 py-2">
                            Change Request Pending
                          </div>
                        </div>
                      ) : null}
                    </div>

                    {status && (
                      <div className={"alert alert-danger mt-2"}>{status}</div>
                    )}
                  </Form>
                )}
              />
            </AccordionTab>
            <AccordionTab
              header={this.customHeader(
                "Contact Details",
                contactDetails,
                isContactDetailsComplete
              )}
            >
              <Formik
                initialValues={{
                  email:
                    pendingRequestData.contactDetails?.email ||
                    contactDetails?.email ||
                    "",
                  phoneNumber:
                    pendingRequestData.contactDetails?.phoneNumber ||
                    contactDetails?.phoneNumber ||
                    "",
                  // phone2:
                  //   pendingRequestData.contactDetails?.phone2 ||
                  //   contactDetails?.phone2 ||
                  //   "",
                  fax:
                    pendingRequestData.contactDetails?.fax ||
                    contactDetails?.fax ||
                    "",
                  // alternatePhoneNumber:
                  //   pendingRequestData.contactDetails?.alternatePhoneNumber ||
                  //   contactDetails?.alternatePhoneNumber ||
                  //   "",
                  website:
                    pendingRequestData.contactDetails?.website ||
                    contactDetails?.website ||
                    "",
                  facebook:
                    pendingRequestData.contactDetails?.facebook ||
                    contactDetails?.facebook ||
                    "",
                  twitter:
                    pendingRequestData.contactDetails?.twitter ||
                    contactDetails?.twitter ||
                    "",
                  linkedin:
                    pendingRequestData.contactDetails?.linkedin ||
                    contactDetails?.linkedin ||
                    "",
                  instagram:
                    pendingRequestData.contactDetails?.instagram ||
                    contactDetails?.instagram ||
                    "",
                  youtubeChannelPath:
                    pendingRequestData.contactDetails?.youtubeChannelPath ||
                    contactDetails?.youtubeChannelPath ||
                    "",
                  executiveName:
                    pendingRequestData.contactDetails?.executiveName ||
                    contactDetails?.executiveName ||
                    "",
                  executiveTitle:
                    pendingRequestData.contactDetails?.executiveTitle ||
                    contactDetails?.executiveTitle ||
                    "",
                  executiveEmail:
                    pendingRequestData.contactDetails?.executiveEmail ||
                    contactDetails?.executiveEmail ||
                    "",
                  executiveTelephone:
                    pendingRequestData.contactDetails?.executiveTelephone ||
                    contactDetails?.executiveTelephone ||
                    "",
                  salesName:
                    pendingRequestData.contactDetails?.salesName ||
                    contactDetails?.salesName ||
                    "",
                  salesTitle:
                    pendingRequestData.contactDetails?.salesTitle ||
                    contactDetails?.salesTitle ||
                    "",
                  salesEmail:
                    pendingRequestData.contactDetails?.salesEmail ||
                    contactDetails?.salesEmail ||
                    "",
                  salesTelephone:
                    pendingRequestData.contactDetails?.salesTelephone ||
                    contactDetails?.salesTelephone ||
                    "",
                }}
                validationSchema={Yup.object().shape({
                  email: Yup.string().email(),
                  phoneNumber: Yup.string()
                    .min(14, "Phone Number should contain minimum of 10 digits")
                    .max(
                      14,
                      "Phone Number should contain maximum of 10 digits"
                    ),
                  // alternatePhoneNumber: Yup.string()
                  //   .min(
                  //     14,
                  //     "Alternate Phone Number should contain minimum of 10 digits"
                  //   )
                  //   .max(
                  //     14,
                  //     "Alternate Phone Number should contain maximum of 10 digits"
                  //   ),
                  // phone2: Yup.string()
                  //   .min(14, "Phone 2 should contain minimum of 10 digits")
                  //   .max(14, "Phone 2 should contain maximum of 10 digits"),
                  fax: Yup.string()
                    .min(14, "Fax Number should contain minimum of 10 digits")
                    .max(14, "Fax Number should contain maximum of 10 digits"),
                  salesEmail: Yup.string().email("Invalid Email Address"),
                  executiveEmail: Yup.string().email("Invalid Email Address"),
                  // phoneNumber: Yup.string().matches(/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/, 'Phone number is not valid'),
                })}
                onSubmit={(formData, { setStatus, setSubmitting }) => {
                  let requestData = {
                    section: "contactDetails",
                    sectionData: {
                      ...formData,
                    },
                    companyId: companyData._id,
                    companyTitle: demographics.companyTitle,
                    industry: companyData.industry,
                    email: companyData.email,
                  };
                  setSubmitting(true);
                  companyService
                    .createProfileChangeRequest(requestData)
                    .then((data) => {
                      setSubmitting(false);
                      swal("Your request has been submitted", "", "success");
                      this.getCompanyPendingProfileReq();
                      this.setState({ activeIndex: 2 });
                      //this.getCompanyById();
                    })
                    .catch((error) => {
                      setSubmitting(false);
                      swal(error, "", "error");
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
                }) => (
                  <Form>
                    <div className="row">
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
                          onChange={(e) =>
                            setFieldValue("phoneNumber", e.value)
                          }
                        ></InputMask>
                        <ErrorMessage
                          name="phoneNumber"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">Fax number</label>
                        <InputMask
                          mask="(999) 999-9999"
                          value={values.fax}
                          className={
                            "form-control" +
                            (errors.fax && touched.fax ? " is-invalid" : "")
                          }
                          onChange={(e) => setFieldValue("fax", e.value)}
                        ></InputMask>
                        <ErrorMessage
                          name="fax"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      {/* <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">
                          Alternate Phone Number
                        </label>
                        <InputMask
                          mask="(999) 999-9999"
                          value={values.alternatePhoneNumber}
                          className={
                            "form-control" +
                            (errors.alternatePhoneNumber &&
                            touched.alternatePhoneNumber
                              ? " is-invalid"
                              : "")
                          }
                          onChange={(e) =>
                            setFieldValue("alternatePhoneNumber", e.value)
                          }
                        ></InputMask>
                        <ErrorMessage
                          name="alternatePhoneNumber"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div> */}
                    </div>
                    {/* <div className="row">
                      <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">Phone 2</label>
                        <InputMask
                          mask="(999) 999-9999"
                          value={values.phone2}
                          className={
                            "form-control" +
                            (errors.phone2 && touched.phone2
                              ? " is-invalid"
                              : "")
                          }
                          onChange={(e) => setFieldValue("phone2", e.value)}
                        ></InputMask>
                        <ErrorMessage
                          name="phone2"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                    </div> */}
                    <div className="row">
                      <div className="col-sm-6 col-xs-12 form-group required">
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
                      <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">Website</label>
                        <Field
                          name="website"
                          type="text"
                          placeholder="Website"
                          className={
                            "form-control" +
                            (errors.website && touched.website
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="website"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">Facebook</label>
                        <Field
                          name="facebook"
                          type="text"
                          placeholder="Facebook"
                          className={
                            "form-control" +
                            (errors.facebook && touched.facebook
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="facebook"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">Twitter</label>
                        <Field
                          name="twitter"
                          type="text"
                          placeholder="Twitter"
                          className={
                            "form-control" +
                            (errors.twitter && touched.twitter
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="twitter"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">LinkedIn</label>
                        <Field
                          name="linkedin"
                          type="text"
                          placeholder="LinkedIn"
                          className={
                            "form-control" +
                            (errors.linkedin && touched.linkedin
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="linkedin"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">Instagram</label>
                        <Field
                          name="instagram"
                          type="text"
                          placeholder="Instagram"
                          className={
                            "form-control" +
                            (errors.instagram && touched.instagram
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="instagram"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-sm-12 col-xs-12 form-group required">
                        <label className="control-label">
                          YouTube channel path
                        </label>
                        <Field
                          name="youtubeChannelPath"
                          type="text"
                          placeholder="YouTube Channel Path"
                          className={
                            "form-control" +
                            (errors.youtubeChannelPath &&
                            touched.youtubeChannelPath
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="youtubeChannelPath"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">
                          Executive contact name
                        </label>
                        <Field
                          name="executiveName"
                          type="text"
                          placeholder="Executive Contact Name"
                          className={
                            "form-control" +
                            (errors.executiveName && touched.executiveName
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="executiveName"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">
                          Executive contact title
                        </label>
                        <Field
                          name="executiveTitle"
                          type="text"
                          placeholder=" Executive Contact Title"
                          className={
                            "form-control" +
                            (errors.executiveTitle && touched.executiveTitle
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="executiveTitle"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">
                          Executive contact email
                        </label>
                        <Field
                          name="executiveEmail"
                          type="text"
                          placeholder="Executive Contact E-Mail"
                          className={
                            "form-control" +
                            (errors.executiveEmail && touched.executiveEmail
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="executiveEmail"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">
                          Executive contact telephone
                        </label>
                        <InputMask
                          mask="(999) 999-9999"
                          name="executiveTelephone"
                          type="text"
                          value={values.executiveTelephone}
                          placeholder=" Executive Contact Telephone"
                          className={
                            "form-control" +
                            (errors.executiveTelephone &&
                            touched.executiveTelephone
                              ? " is-invalid"
                              : "")
                          }
                          onChange={(e) =>
                            setFieldValue("executiveTelephone", e.value)
                          }
                        />
                        <ErrorMessage
                          name="executiveTelephone"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">
                          Sales contact name
                        </label>
                        <Field
                          name="salesName"
                          type="text"
                          placeholder="Sales Contact Name"
                          className={
                            "form-control" +
                            (errors.salesName && touched.salesName
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="salesName"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">
                          Sales contact title
                        </label>
                        <Field
                          name="salesTitle"
                          type="text"
                          placeholder="Sales Contact Title"
                          className={
                            "form-control" +
                            (errors.salesTitle && touched.salesTitle
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="salesTitle"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">
                          Sales contact email
                        </label>
                        <Field
                          name="salesEmail"
                          type="text"
                          placeholder="Sales Contact E-mail"
                          className={
                            "form-control" +
                            (errors.salesEmail && touched.salesEmail
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="salesEmail"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">
                          Sales contact telephone
                        </label>
                        <InputMask
                          mask="(999) 999-9999"
                          name="salesTelephone"
                          type="text"
                          value={values.salesTelephone}
                          placeholder=" Sales Contact Telephone"
                          className={
                            "form-control" +
                            (errors.salesTelephone && touched.salesTelephone
                              ? " is-invalid"
                              : "")
                          }
                          onChange={(e) =>
                            setFieldValue("salesTelephone", e.value)
                          }
                        />
                        <ErrorMessage
                          name="salesTelephone"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="offset-md-3 col-md-6 col-xs-12">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="btn btn-primary btn-lg btn-block text-uppercase"
                        >
                          Save &amp; Next
                          {isSubmitting && (
                            <span>
                              {" "}
                              <i className="pi pi-spin pi-spinner"></i>
                            </span>
                          )}
                        </button>
                      </div>
                      {pendingRequestData.contactDetails ? (
                        <div className="col-md-3">
                          <div className="pending-req-box bg-warning text-center px-3 py-2">
                            Change Request Pending
                          </div>
                        </div>
                      ) : null}
                    </div>

                    {status && (
                      <div className={"alert alert-danger mt-2"}>{status}</div>
                    )}
                  </Form>
                )}
              />
            </AccordionTab>
            <AccordionTab
              header={this.customHeader(
                "Details and Capabilities",
                aboutResources,
                isAboutResourcesComplete
              )}
            >
              <Formik
                initialValues={{
                  employeesAtCurrentLocation: pendingRequestData.aboutResources
                    ? getOptionForSingleSelect(
                        pendingRequestData.aboutResources
                          .employeesAtCurrentLocation
                      )
                    : aboutResources
                    ? getOptionForSingleSelect(
                        aboutResources.employeesAtCurrentLocation
                      )
                    : [],

                  employeeAtCurrentLocationText:
                    pendingRequestData.aboutResources
                      ?.employeeAtCurrentLocationText ||
                    aboutResources?.employeeAtCurrentLocationText ||
                    "",

                  industriesSupplied: pendingRequestData.aboutResources
                    ? getSectorPreselectedOptions(
                        pendingRequestData.aboutResources.industriesSupplied
                      )
                    : aboutResources
                    ? getSectorPreselectedOptions(
                        aboutResources.industriesSupplied
                      )
                    : [],
                  industriesSuppliedText:
                    pendingRequestData.aboutResources?.industriesSuppliedText ||
                    aboutResources?.industriesSuppliedText ||
                    "",
                  materialCapabilites: pendingRequestData.aboutResources
                    ? getSectorPreselectedOptions(
                        pendingRequestData.aboutResources.materialCapabilites
                      )
                    : aboutResources
                    ? getSectorPreselectedOptions(
                        aboutResources.materialCapabilites
                      )
                    : [],
                  materialsCapabilitesText:
                    pendingRequestData.aboutResources
                      ?.materialsCapabilitesText ||
                    aboutResources?.materialsCapabilitesText ||
                    "",

                  primary2Digit: pendingRequestData.aboutResources
                    ? getOptionForSingleSelect(
                        pendingRequestData.aboutResources.primary2Digit
                      )
                    : aboutResources
                    ? getOptionForSingleSelect(aboutResources.primary2Digit)
                    : [],
                  primary3Digit: pendingRequestData.aboutResources
                    ? getOptionForSingleSelect(
                        pendingRequestData.aboutResources.primary3Digit
                      )
                    : aboutResources
                    ? getOptionForSingleSelect(aboutResources.primary3Digit)
                    : [],
                  primary4Digit: pendingRequestData.aboutResources
                    ? getOptionForSingleSelect(
                        pendingRequestData.aboutResources.primary4Digit
                      )
                    : aboutResources
                    ? getOptionForSingleSelect(aboutResources.primary4Digit)
                    : [],
                  primary5Digit: pendingRequestData.aboutResources
                    ? getOptionForSingleSelect(
                        pendingRequestData.aboutResources.primary5Digit
                      )
                    : aboutResources
                    ? getOptionForSingleSelect(aboutResources.primary5Digit)
                    : [],
                  primary6Digit: pendingRequestData.aboutResources
                    ? getOptionForSingleSelect(
                        pendingRequestData.aboutResources.primary6Digit
                      )
                    : aboutResources
                    ? getOptionForSingleSelect(aboutResources.primary6Digit)
                    : [],
                  secondary2Digit: pendingRequestData.aboutResources
                    ? getOptionForSingleSelect(
                        pendingRequestData.aboutResources.secondary2Digit
                      )
                    : aboutResources
                    ? getOptionForSingleSelect(aboutResources.secondary2Digit)
                    : [],
                  secondary3Digit: pendingRequestData.aboutResources
                    ? getOptionForSingleSelect(
                        pendingRequestData.aboutResources.secondary3Digit
                      )
                    : aboutResources
                    ? getOptionForSingleSelect(aboutResources.secondary3Digit)
                    : [],
                  secondary4Digit: pendingRequestData.aboutResources
                    ? getOptionForSingleSelect(
                        pendingRequestData.aboutResources.secondary4Digit
                      )
                    : aboutResources
                    ? getOptionForSingleSelect(aboutResources.secondary4Digit)
                    : [],
                  secondary5Digit: pendingRequestData.aboutResources
                    ? getOptionForSingleSelect(
                        pendingRequestData.aboutResources.secondary5Digit
                      )
                    : aboutResources
                    ? getOptionForSingleSelect(aboutResources.secondary5Digit)
                    : [],
                  secondary6Digit: pendingRequestData.aboutResources
                    ? getOptionForSingleSelect(
                        pendingRequestData.aboutResources.secondary6Digit
                      )
                    : aboutResources
                    ? getOptionForSingleSelect(aboutResources.secondary6Digit)
                    : [],
                  certification: pendingRequestData.aboutResources
                    ? getOptionForSingleSelect(
                        pendingRequestData.aboutResources.certification
                      )
                    : aboutResources
                    ? getOptionForSingleSelect(aboutResources.certification)
                    : [],

                  certificationText:
                    pendingRequestData.aboutResources?.certificationText ||
                    aboutResources?.certificationText ||
                    "",
                  businessLeadership: pendingRequestData.aboutResources
                    ? getSectorPreselectedOptions(
                        pendingRequestData.aboutResources.businessLeadership
                      )
                    : aboutResources
                    ? getSectorPreselectedOptions(
                        aboutResources.businessLeadership
                      )
                    : [],

                  businessLeadershipText:
                    pendingRequestData.aboutResources?.businessLeadershipText ||
                    aboutResources?.businessLeadershipText ||
                    "",

                  disasterRecovery:
                    pendingRequestData.aboutResources?.disasterRecovery ||
                    aboutResources?.disasterRecovery ||
                    "",
                  governmentSupplier: pendingRequestData.aboutResources
                    ? getSectorPreselectedOptions(
                        pendingRequestData.aboutResources.governmentSupplier
                      )
                    : aboutResources
                    ? getSectorPreselectedOptions(
                        aboutResources.governmentSupplier
                      )
                    : [],
                  exportMarkets: pendingRequestData.aboutResources
                    ? getSectorPreselectedOptions(
                        pendingRequestData.aboutResources.exportMarkets
                      )
                    : aboutResources
                    ? getSectorPreselectedOptions(aboutResources.exportMarkets)
                    : [],
                  industriesAffliation: pendingRequestData.aboutResources
                    ? getOptionForSingleSelect(
                        pendingRequestData.aboutResources.industriesAffliation
                      )
                    : aboutResources
                    ? getOptionForSingleSelect(
                        aboutResources.industriesAffliation
                      )
                    : [],
                  industriesAffliationText:
                    pendingRequestData.aboutResources
                      ?.industriesAffliationText ||
                    aboutResources?.industriesAffliationText ||
                    "",
                  revenue: pendingRequestData.aboutResources
                    ? getOptionForSingleSelect(
                        pendingRequestData.aboutResources.revenue
                      )
                    : aboutResources
                    ? getOptionForSingleSelect(aboutResources.revenue)
                    : [],
                  revenueInText:
                    pendingRequestData.aboutResources?.revenueInText ||
                    aboutResources?.revenueInText ||
                    "",
                  facilitySize:
                    pendingRequestData.aboutResources?.facilitySize ||
                    aboutResources?.facilitySize ||
                    "",
                  establishmentYear:
                    pendingRequestData.aboutResources?.establishmentYear ||
                    aboutResources?.establishmentYear ||
                    "",
                  // city: pendingRequestData.aboutResources
                  //   ? getSectorPreselectedOptions(
                  //       pendingRequestData.aboutResources.city
                  //     )
                  //   : aboutResources
                  //   ? getSectorPreselectedOptions(aboutResources.city)
                  //   : [],
                  isActive: pendingRequestData.aboutResources
                    ? getOptionForSingleSelect(
                        pendingRequestData.aboutResources.isActive
                      )
                    : aboutResources
                    ? getOptionForSingleSelect(aboutResources.isActive)
                    : [],

                  userName:
                    pendingRequestData.aboutResources?.userName ||
                    aboutResources?.userName ||
                    "",
                  userEmail:
                    pendingRequestData.aboutResources?.userEmail ||
                    aboutResources?.userEmail ||
                    "",
                  // modifiedBy:
                  //   pendingRequestData.aboutResources?.modifiedBy ||
                  //   aboutResources?.modifiedBy ||
                  //   "",
                  // modifiedDate:
                  //   pendingRequestData.aboutResources?.modifiedDate ||
                  //   aboutResources?.modifiedDate ||
                  //   "",
                  // createdBy:
                  //   pendingRequestData.aboutResources?.createdBy ||
                  //   aboutResources?.createdBy ||
                  //   "",
                  // createdDate:
                  //   pendingRequestData.aboutResources?.createdDate ||
                  //   aboutResources?.createdDate ||
                  //   "",
                  // lastVerifiedDate:
                  //   pendingRequestData.aboutResources?.lastVerifiedDate ||
                  //   aboutResources?.lastVerifiedDate ||
                  //   "",
                  // lastVerifyEmailSent:
                  //   pendingRequestData.aboutResources?.lastVerifyEmailSent ||
                  //   aboutResources?.lastVerifyEmailSent ||
                  //   "",

                  isHiring:
                    pendingRequestData.aboutResources?.isHiring ||
                    aboutResources?.isHiring ||
                    false,
                  hiringLink:
                    pendingRequestData.aboutResources?.hiringLink ||
                    aboutResources?.hiringLink ||
                    "",
                  // liabilityInsurance:
                  //   pendingRequestData.aboutResources?.liabilityInsurance ||
                  //   aboutResources?.liabilityInsurance ||
                  //   "",
                  // companies:
                  //   pendingRequestData.aboutResources?.companies ||
                  //   aboutResources?.companies ||
                  //   "",
                  // industries:
                  //   pendingRequestData.aboutResources?.industries ||
                  //   aboutResources?.industries ||
                  //   "",
                  // categories: pendingRequestData.aboutResources
                  //   ? getSectorPreselectedOptions(
                  //       pendingRequestData.aboutResources.categories
                  //     )
                  //   : aboutResources
                  //   ? getSectorPreselectedOptions(aboutResources.categories)
                  //   : [],

                  // capability:
                  //   pendingRequestData.aboutResources?.capability ||
                  //   aboutResources?.capability ||
                  //   ""
                }}
                validationSchema={Yup.object().shape({
                  // NAICS: Yup.string().max(5, "Only Upto 5 digits"),
                  // NAICS1: Yup.string().max(5, "Only Upto 5 digits"),
                  userEmail: Yup.string().email("Invalid Email Address"),
                })}
                onSubmit={(formData, { setStatus, setSubmitting }) => {
                  console.log("formData: ", formData);
                  let requestData = {
                    section: "aboutResources",
                    sectionData: {
                      ...formData,
                      // categories:
                      //   formData.categories !== null
                      //     ? formData.categories.map((item) => item.value)
                      //     : null,

                      industriesSupplied:
                        formData.industriesSupplied !== null
                          ? formData.industriesSupplied.map(
                              (item) => item.value
                            )
                          : null,
                      businessLeadership:
                        formData.businessLeadership !== null
                          ? formData.businessLeadership.map(
                              (item) => item.value
                            )
                          : null,
                      governmentSupplier:
                        formData.governmentSupplier !== null
                          ? formData.governmentSupplier.map(
                              (item) => item.value
                            )
                          : null,
                      exportMarkets:
                        formData.exportMarkets !== null
                          ? formData.exportMarkets.map((item) => item.value)
                          : null,
                      employeesAtCurrentLocation:
                        formData.employeesAtCurrentLocation !== null
                          ? [formData.employeesAtCurrentLocation.value]
                          : [],
                      certification:
                        formData.certification !== null
                          ? [formData.certification.value]
                          : [],
                      industriesAffliation:
                        formData.industriesAffliation !== null
                          ? [formData.industriesAffliation.value]
                          : [],
                      materialCapabilites:
                        formData.materialCapabilites !== null
                          ? formData.materialCapabilites.map(
                              (item) => item.value
                            )
                          : null,
                      isActive:
                        formData.isActive !== null
                          ? [formData.isActive.value]
                          : [],
                      revenue:
                        formData.revenue !== null
                          ? [formData.revenue.value]
                          : [],
                      primary2Digit:
                        formData.primary2Digit !== null
                          ? [formData.primary2Digit.label]
                          : [],
                      primary3Digit: formData.primary3Digit
                        ? [formData.primary3Digit.label]
                        : [],
                      primary4Digit: formData.primary4Digit
                        ? [formData.primary4Digit.label]
                        : [],
                      primary5Digit: formData.primary5Digit
                        ? [formData.primary5Digit.label]
                        : [],
                      primary6Digit: formData.primary6Digit
                        ? [formData.primary6Digit.label]
                        : [],
                      secondary2Digit: formData.secondary2Digit
                        ? [formData.secondary2Digit.label]
                        : [],
                      secondary3Digit: formData.secondary3Digit
                        ? [formData.secondary3Digit.label]
                        : [],
                      secondary4Digit: formData.secondary4Digit
                        ? [formData.secondary4Digit.label]
                        : [],
                      secondary5Digit: formData.secondary5Digit
                        ? [formData.secondary5Digit.label]
                        : [],
                      secondary6Digit: formData.secondary6Digit
                        ? [formData.secondary6Digit.label]
                        : [],
                    },
                    companyId: companyData._id,
                    companyTitle: demographics.companyTitle,
                    industry: companyData.industry,
                    email: companyData.email,
                  };

                  console.log("requestData: ", requestData);
                  setSubmitting(true);
                  companyService
                    .createProfileChangeRequest(requestData)
                    .then((data) => {
                      setSubmitting(false);
                      swal("Your request has been submitted", "", "success");
                      this.getCompanyPendingProfileReq();
                      this.setState({ activeIndex: 3 });
                      //this.getCompanyById();
                    })
                    .catch((error) => {
                      setSubmitting(false);
                      console.log(error);
                      swal(error, "", "error");
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
                }) => (
                  <Form>
                    <div className="row">
                      <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">
                          Employees at this location
                        </label>
                        <Select
                          options={employeesAtCurrentLocation}
                          value={values.employeesAtCurrentLocation}
                          onChange={(v) => {
                            setFieldValue("employeesAtCurrentLocation", v);
                          }}
                        />
                        <ErrorMessage
                          name="categories"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">
                          Employees at this location
                        </label>
                        <Field
                          name="employeeAtCurrentLocationText"
                          type="text"
                          placeholder="Not visible on public profile"
                          className={
                            "form-control" +
                            (errors.employeeAtCurrentLocationText &&
                            touched.employeeAtCurrentLocationText
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="employeeAtCurrentLocationText"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>

                      {/* <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">
                          Liability Insurance
                        </label>
                        <Field
                          name="liabilityInsurance"
                          type="text"
                          placeholder="Liability Insurance"
                          className={
                            "form-control" +
                            (errors.liabilityInsurance &&
                            touched.liabilityInsurance
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="liabilityInsurance"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div> */}
                    </div>
                    <div className="row">
                      <div className="col-sm-12 col-xs-12 form-group required">
                        <label className="control-label">
                          Industries supplied
                        </label>
                        <Select
                          options={industriesSupplied}
                          value={values.industriesSupplied}
                          onChange={(v) => {
                            setFieldValue("industriesSupplied", v);
                            this.setState({ industriesSuppliedArray: v });
                          }}
                          isMulti
                        />
                        <ErrorMessage
                          name="industriesSupplied"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-6 col-xs-12 form-group required">
                        {this.state.companiesSectorArray?.map((sector) => {
                          if (sector?.value == "Other") {
                            return (
                              <>
                                {" "}
                                <Field
                                  name="companiesSectorText"
                                  type="text"
                                  placeholder="Sector (ie. automotive, automation, food
                              processing, etc.)"
                                  className={
                                    "form-control" +
                                    (errors.companiesSectorText &&
                                    touched.companiesSectorText
                                      ? " is-invalid"
                                      : "")
                                  }
                                />
                                <ErrorMessage
                                  name="companiesSectorText"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </>
                            );
                          }
                        })}
                      </div>

                      {this.state.industriesSuppliedArray?.map((industries) => {
                        if (industries?.value == "Other") {
                          return (
                            <div className="col-sm-6 col-xs-12 form-group required">
                              <Field
                                name="industriesSuppliedText"
                                type="text"
                                placeholder="Industries supplied (ie. automotive, agri-business,
                                  etc.)"
                                className={
                                  "form-control" +
                                  (errors.industriesSuppliedText &&
                                  touched.industriesSuppliedText
                                    ? " is-invalid"
                                    : "")
                                }
                              />
                              <ErrorMessage
                                name="industriesSuppliedText"
                                component="div"
                                className="invalid-feedback"
                              />
                            </div>
                          );
                        }
                      })}
                    </div>

                    <div className="row">
                      <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">
                          Primary NAICS 2-digit
                        </label>

                        <Select
                          options={NAICS1}
                          value={values.primary2Digit}
                          onChange={(v) => {
                            setFieldValue("primary2Digit", v);
                            setFieldValue("primary3Digit", "");
                            this.setState({
                              catId: v.value,
                              NAICS3: [],
                              NAICS4: [],
                              NAICS5: [],
                            });
                            this.getNaicsChildFromParent(v.value);

                            setFieldValue("primary4Digit", "");
                            setFieldValue("primary5Digit", "");
                            setFieldValue("primary6Digit", "");
                          }}
                        />
                        <ErrorMessage
                          name="primary2Digit"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">
                          Secondary NAICS 2-digit
                        </label>

                        <Select
                          options={NAICS1}
                          value={values.secondary2Digit}
                          onChange={(v) => {
                            setFieldValue("secondary2Digit", v);
                            setFieldValue("secondary3Digit", "");
                            this.setState({
                              catId: v.value,
                              NAICS3: [],
                              NAICS4: [],
                              NAICS5: [],
                            });
                            this.getNaicsChildFromParent(v.value);

                            setFieldValue("secondary4Digit", "");
                            setFieldValue("secondary5Digit", "");
                            setFieldValue("secondary6Digit", "");
                          }}
                        />
                        <ErrorMessage
                          name="secondary2Digit"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">3-digit</label>
                        <Select
                          options={NAICS2}
                          value={values.primary3Digit}
                          onChange={(v) => {
                            setFieldValue("primary3Digit", v);
                            this.setState({
                              catId: v.value,
                              NAICS4: [],
                              NAICS5: [],
                            });
                            this.getNaicsChildFromParent(v.value);
                            if (
                              NAICS3.length &&
                              NAICS4.length &&
                              NAICS5.length > 0
                            ) {
                              setFieldValue("primary4Digit", "");
                              setFieldValue("primary5Digit", "");
                              setFieldValue("primary6Digit", "");
                            }
                          }}
                        />
                        <ErrorMessage
                          name="primary3Digit"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      <div className="col-sm-6 col-xs-12 form-group required">
                        {" "}
                        <label className="control-label">3-digit</label>
                        <Select
                          options={NAICS2}
                          value={values.secondary3Digit}
                          onChange={(v) => {
                            setFieldValue("secondary3Digit", v);
                            this.setState({
                              catId: v.value,
                              NAICS4: [],
                              NAICS5: [],
                            });
                            this.getNaicsChildFromParent(v.value);
                            if (
                              NAICS3.length &&
                              NAICS4.length &&
                              NAICS5.length > 0
                            ) {
                              setFieldValue("secondary4Digit", "");
                              setFieldValue("secondary5Digit", "");
                              setFieldValue("secondary6Digit", "");
                            }
                          }}
                        />
                        <ErrorMessage
                          name="secondary3Digit"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">4-digit</label>

                        <Select
                          options={NAICS3}
                          value={values.primary4Digit}
                          onChange={(v) => {
                            setFieldValue("primary4Digit", v);
                            this.setState({ catId: v.value, NAICS5: [] });
                            this.getNaicsChildFromParent(v.value);
                            if (NAICS4.length && NAICS5.length > 0) {
                              setFieldValue("primary5Digit", "");
                              setFieldValue("primary6Digit", "");
                            }
                          }}
                        />
                        <ErrorMessage
                          name="primary4Digit"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">4-digit</label>
                        <Select
                          options={NAICS3}
                          value={values.secondary4Digit}
                          onChange={(v) => {
                            setFieldValue("secondary4Digit", v);
                            this.setState({ catId: v.value, NAICS5: [] });
                            this.getNaicsChildFromParent(v.value);
                            if (NAICS4.length && NAICS5.length > 0) {
                              setFieldValue("secondary5Digit", "");
                              setFieldValue("secondary6Digit", "");
                            }
                          }}
                        />
                        <ErrorMessage
                          name="secondary4Digit"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">5-digit</label>

                        <Select
                          options={NAICS4}
                          value={values.primary5Digit}
                          onChange={(v) => {
                            setFieldValue("primary5Digit", v);
                            this.setState({ catId: v.value });
                            this.getNaicsChildFromParent(v.value);
                            if (NAICS5.length > 0) {
                              setFieldValue("primary6Digit", "");
                            }
                          }}
                        />
                        <ErrorMessage
                          name="primary5Digit"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      <div className="col-sm-6 col-xs-12 form-group required">
                        {" "}
                        <label className="control-label">5-digit</label>
                        <Select
                          options={NAICS4}
                          value={values.secondary5Digit}
                          onChange={(v) => {
                            setFieldValue("secondary5Digit", v);
                            this.setState({ catId: v.value });
                            this.getNaicsChildFromParent(v.value);
                            if (NAICS5.length > 0) {
                              setFieldValue("secondary6Digit", "");
                            }
                          }}
                        />
                        <ErrorMessage
                          name="secondary5Digit"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">6-digit</label>

                        <Select
                          options={NAICS5}
                          value={values.primary6Digit}
                          onChange={(v) => {
                            setFieldValue("primary6Digit", v);
                            this.setState({ catId: v.value });
                          }}
                        />
                        <ErrorMessage
                          name="primary6Digit"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      <div className="col-sm-6 col-xs-12 form-group required">
                        {" "}
                        <label className="control-label">6-digit</label>
                        <Select
                          options={NAICS5}
                          value={values.secondary6Digit}
                          onChange={(v) => {
                            setFieldValue("secondary6Digit", v);
                            this.setState({ catId: v.value });
                          }}
                        />
                        <ErrorMessage
                          name="secondary6Digit"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">Certification</label>
                        <Select
                          options={certification}
                          value={values.certification}
                          onChange={(v) => setFieldValue("certification", v)}
                        />
                        <ErrorMessage
                          name="certification"
                          component="div"
                          className="invalid-feedback"
                        />

                        {/* <Field
                          name="certification"
                          type="text"
                          placeholder="Certification"
                          className={
                            "form-control" +
                            (errors.certification && touched.certification
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="certification"
                          component="div"
                          className="invalid-feedback"
                        /> */}
                      </div>
                      <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">
                          Business leadership
                        </label>
                        <Select
                          options={businessLeadership}
                          value={values.businessLeadership}
                          onChange={(v) => {
                            setFieldValue("businessLeadership", v);
                            this.setState({ businessLeadershipArray: v });
                          }}
                          isMulti
                        />
                        <ErrorMessage
                          name="businessLeadership"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-6 col-xs-12 form-group required">
                        {values?.certification?.value === "Other" ? (
                          <>
                            <Field
                              name="certificationText"
                              type="text"
                              placeholder="Certification Text"
                              className={
                                "form-control" +
                                (errors.certificationText &&
                                touched.certificationText
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                            <ErrorMessage
                              name="certificationText"
                              component="div"
                              className="invalid-feedback"
                            />
                          </>
                        ) : null}
                      </div>
                      <div className="col-sm-6 col-xs-12 form-group required">
                        {this.state.businessLeadershipArray !== false &&
                          this.state.businessLeadershipArray?.map(
                            (businessLeadership) => {
                              if (businessLeadership?.value == "Other") {
                                return (
                                  <>
                                    {" "}
                                    <Field
                                      name="businessLeadershipText"
                                      type="text"
                                      placeholder="Business LeaderShip"
                                      className={
                                        "form-control" +
                                        (errors.businessLeadershipText &&
                                        touched.businessLeadershipText
                                          ? " is-invalid"
                                          : "")
                                      }
                                    />
                                    <ErrorMessage
                                      name="businessLeadershipText"
                                      component="div"
                                      className="invalid-feedback"
                                    />
                                  </>
                                );
                              }
                            }
                          )}
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">
                          Able to support in disaster recovery
                        </label>
                        <Field
                          name="disasterRecovery"
                          type="text"
                          placeholder="Not visible on public profile"
                          className={
                            "form-control" +
                            (errors.disasterRecovery && touched.disasterRecovery
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="disasterRecovery"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">
                          Has been government supplier?
                        </label>
                        <Select
                          placeholder="Not visible on public profile"
                          options={governmentSupplier}
                          value={values.governmentSupplier}
                          onChange={(v) =>
                            setFieldValue("governmentSupplier", v)
                          }
                          isMulti
                        />
                        <ErrorMessage
                          name="governmentSupplier"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">Export markets</label>
                        <Select
                          options={exportMarkets}
                          value={values.exportMarkets}
                          onChange={(v) => setFieldValue("exportMarkets", v)}
                          isMulti
                        />
                        <ErrorMessage
                          name="exportMarkets"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">
                          Industry associations
                        </label>

                        <Select
                          options={industriesAffliation}
                          value={values.industriesAffliation}
                          onChange={(v) =>
                            setFieldValue("industriesAffliation", v)
                          }
                        />
                        <ErrorMessage
                          name="industriesAffliation"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-6 col-xs-12 form-group required"></div>
                      <div className="col-sm-6 col-xs-12 form-group required">
                        {values?.industriesAffliation?.value == "Other" ? (
                          <>
                            <Field
                              name="industriesAffliationText"
                              type="text"
                              placeholder="Industries Affliation"
                              className={
                                "form-control" +
                                (errors.industriesAffliationText &&
                                touched.industriesAffliationText
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                            <ErrorMessage
                              name="industriesAffliationText"
                              component="div"
                              className="invalid-feedback"
                            />
                          </>
                        ) : null}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">Revenue</label>
                        <Select
                          options={revenue}
                          value={values.revenue}
                          onChange={(v) => setFieldValue("revenue", v)}
                        />
                        <ErrorMessage
                          name="revenue"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">Revenue</label>
                        <Field
                          name="revenueInText"
                          type="text"
                          placeholder="Not visible on public profile"
                          className={
                            "form-control" +
                            (errors.revenueInText && touched.revenueInText
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="revenueInText"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">
                          Facility size (Square feet)
                        </label>
                        <Field
                          name="facilitySize"
                          type="text"
                          placeholder="Not visible on public profile"
                          className={
                            "form-control" +
                            (errors.facilitySize && touched.facilitySize
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="facilitySize"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">
                          Year of establishment
                        </label>
                        <Field
                          name="establishmentYear"
                          type="text"
                          placeholder="Year of Establishment"
                          className={
                            "form-control" +
                            (errors.establishmentYear &&
                            touched.establishmentYear
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="establishmentYear"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                    </div>
                    <div className="row">
                      {/* <div className="col-sm-6 col-xs-12 form-group required">
                          <label className="control-label">Municipality</label>
                          <Select
                            options={city}
                            value={values.city}
                            onChange={(v) => setFieldValue("city", v)}
                            isMulti
                          />
                          <ErrorMessage
                            name="region"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div> */}
                      <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">Active/Inactive</label>
                        <Select
                          placeholder="Not visible on public profile"
                          options={activeNonActive}
                          value={values.isActive}
                          onChange={(v) => setFieldValue("isActive", v)}
                        />
                        <ErrorMessage
                          name="isActive"
                          component="div"
                          className="invalid-feedback"
                        />
                        {/* <Field
                            name="isActive"
                            type="checkbox"
                            id="isActive"
                            className={
                              "form-check-input" +
                              (errors.isActive && touched.isActive
                                ? " is-invalid"
                                : "")
                            }
                          />
                          <label className="form-check-label" for="isActive">
                            Is Active
                          </label> */}

                        <ErrorMessage
                          name="isActive"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">
                          Material capabilities
                        </label>
                        <Select
                          options={materialCapabilites}
                          value={values.materialCapabilites}
                          onChange={(v) => {
                            this.setState({ materialCapabilitesArray: v });
                            setFieldValue("materialCapabilites", v);
                          }}
                          isMulti
                        />
                        <ErrorMessage
                          name="materialCapabilites"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-sm-6 col-xs-12 form-group required"></div>
                      <div className="col-sm-6 col-xs-12 form-group required">
                        {this.state.materialCapabilitesArray?.map(
                          (materialCapabilites) => {
                            if (materialCapabilites?.value == "Other") {
                              return (
                                <>
                                  {" "}
                                  <Field
                                    name="materialsCapabilitesText"
                                    type="text"
                                    placeholder="Material Capabilities"
                                    className={
                                      "form-control" +
                                      (errors.materialsCapabilitesText &&
                                      touched.materialsCapabilitesText
                                        ? " is-invalid"
                                        : "")
                                    }
                                  />
                                  <ErrorMessage
                                    name="materialsCapabilitesText"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </>
                              );
                            }
                          }
                        )}
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">User name</label>
                        <Field
                          name="userName"
                          type="text"
                          placeholder="Not visible on public profile"
                          className={
                            "form-control" +
                            (errors.userName && touched.userName
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="userName"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      <div className="col-sm-6 col-xs-12 form-group required">
                        <label className="control-label">User email</label>
                        <Field
                          name="userEmail"
                          type="text"
                          placeholder="Not visible on public profile"
                          className={
                            "form-control" +
                            (errors.userEmail && touched.userEmail
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="userEmail"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                    </div>

                    <div className="row">
                      {" "}
                      <div className="col-sm-6 col-xs-12 form-group required">
                        <div className="form-check">
                          <Field
                            name="isHiring"
                            type="checkbox"
                            id="isHiring"
                            className={
                              "form-check-input" +
                              (errors.isHiring && touched.isHiring
                                ? " is-invalid"
                                : "")
                            }
                          />
                          <label className="form-check-label" for="isHiring">
                            Is Hiring
                          </label>
                        </div>
                        {values.isHiring ? (
                          <Field
                            name="hiringLink"
                            type="text"
                            placeholder="Please provide a link"
                            className={
                              "mt-2 form-control" +
                              (errors.hiringLink && touched.hiringLink
                                ? " is-invalid"
                                : "")
                            }
                          />
                        ) : null}
                        <ErrorMessage
                          name="hiringLink"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="offset-md-3 col-md-6 col-xs-12">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="btn btn-primary btn-lg btn-block text-uppercase"
                        >
                          Save &amp; Next
                          {isSubmitting && (
                            <span>
                              {" "}
                              <i className="pi pi-spin pi-spinner"></i>
                            </span>
                          )}
                        </button>
                      </div>
                      {pendingRequestData.aboutResources ? (
                        <div className="col-md-3">
                          <div className="pending-req-box bg-warning text-center px-3 py-2">
                            Change Request Pending
                          </div>
                        </div>
                      ) : null}
                    </div>
                    {status && (
                      <div className={"alert alert-danger mt-2"}>{status}</div>
                    )}
                  </Form>
                )}
              />
            </AccordionTab>

            <AccordionTab
              header={this.customHeaderForFiles("Marketing Materials")}
            >
              <div className="row">
                <div className="col-md-12">
                  <div className="text-right">
                    <button
                      className="btn btn-success"
                      type="button"
                      onClick={this.openFileUploadModal}
                    >
                      Add Resource File
                    </button>
                  </div>
                  <hr />
                  <div className="row">
                    {companyFiles.map((file, index) => {
                      let filename = file.originalname;
                      let ext = filename.split(".");

                      return (
                        <div className="col-md-3 col-sm-6" key={index}>
                          <Card
                            className="card-padding-none"
                            onClick={() => {
                              let fileExtension = file.originalname.split(".");
                              if (
                                VIDEO_FILES.includes(fileExtension[1]) ||
                                AUDIO_FILES.includes(fileExtension[1])
                              ) {
                                this.getFileFromKey(
                                  file.key,
                                  file.title || file.originalname,
                                  file._id
                                );
                              } else if (
                                DOCS_FILES.includes(fileExtension[1])
                              ) {
                                this.setState(
                                  { docFile: file.location },
                                  () => {
                                    this.setState({ docsViewModal: true });
                                  }
                                );
                              }
                            }}
                          >
                            <div className="image-parent">
                              {this.getThumbnail(file)}
                              <div className="middle">
                                <i
                                  className="mdi mdi-pencil editIcon cursor-pointer"
                                  // onClick={() =>
                                  //   this.toggleUpdateFileModel(
                                  //     file._id,
                                  //     file.title,
                                  //     file.description,
                                  //     file.feedback,
                                  //     file.downloadOption
                                  //   )
                                  // }
                                ></i>
                                <div
                                  className="resource-file-delete-icon cursor-pointer"
                                  onClick={() => this.deleteFile(file._id)}
                                >
                                  <i className="pi pi-trash"></i>
                                </div>
                              </div>
                            </div>

                            <CardBody className="p-1 px-2 card-bg-color">
                              <CardText
                                className="cursor-pointer mb-0"
                                onClick={() => {
                                  this.getFileFromKey(
                                    file.key,
                                    file.title || file.originalname,
                                    file._id
                                  );
                                }}
                              >
                                {file.title ? file.title : file.originalname}
                              </CardText>
                              <div></div>
                            </CardBody>
                          </Card>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </AccordionTab>
          </Accordion>
          <div>
            <Formik
              enableReinitialize={true}
              initialValues={{
                isAgreed: companyData.isAgreed || false,
              }}
              validationSchema={Yup.object().shape({})}
              onSubmit={(formData, { setSubmitting }) => {
                console.log("formData: ", formData);

                let requestData = {
                  companyId: this.state.currentUser.id,
                  isAgreed: formData.isAgreed,
                  currentUserId: this.state.currentUser.id,
                };
                companyService
                  .toggleDetailsAreCorrectByCompanyId(requestData)
                  .then((data) => {
                    if (data && data.Status) {
                      console.log(data);
                    }
                  });
              }}
            >
              {({ setFieldValue, values, handleSubmit }) => {
                return (
                  <Form>
                    <div>
                      <Card className="card-padding-none">
                        <div className="row">
                          <div className="col-sm-12 col-xs-12 form-group required">
                            <div className="form-check">
                              <Field
                                name="isAgreed"
                                type="checkbox"
                                id="isAgreed"
                                //value={values.isAgreed}
                                onChange={() => {
                                  setFieldValue("isAgreed", !values.isAgreed);
                                  handleSubmit();
                                }}
                              />
                              <label
                                className="form-check-label pl-2 pt-2"
                                for="isAgreed"
                              >
                                Details are correct, no changes required
                              </label>
                            </div>

                            <ErrorMessage
                              name="isAgreed"
                              component="div"
                              className="invalid-feedback"
                            />
                          </div>
                        </div>
                      </Card>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>

          <Dialog
            header="Add Resource File "
            visible={this.state.fileUploadModal}
            style={{ width: "40vw" }}
            onHide={this.closeFileUploadModal}
          >
            <Formik
              initialValues={{
                title: "",
                description: "",
                file: null,
              }}
              validationSchema={Yup.object().shape({})}
              onSubmit={(formData, { setStatus, setSubmitting }) => {
                setSubmitting(true);
                let originalname = formData.file.name.toLowerCase();
                let fileName =
                  "companies/resources/" +
                  removeAllDotsButLast(slugify(originalname, { lower: true }));
                let fileType = formData.file.type;
                axios
                  .post(
                    `${config.apiUrl}/api/v1/companies/files/upload`,
                    {
                      fileName: fileName,
                      fileType: fileType,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${this.state.currentUser.token}`,
                        isenc: localStorage.getItem("isenc")
                          ? parseInt(localStorage.getItem("isenc"))
                          : 0,
                      },
                    }
                  )
                  .then((response) => {
                    console.log(response.data);
                    var returnData = response.data.Data;
                    var signedRequest = returnData.signedRequest;
                    var url = returnData.url;
                    console.log("------> url: ", url);
                    //this.setState({ url: url });
                    console.log("Recieved a signed request " + signedRequest);

                    // Put the fileType in the headers for the upload
                    var options = {
                      headers: {
                        "Content-Type": fileType,
                      },
                      onUploadProgress: (ev) => {
                        const progress = parseInt((ev.loaded / ev.total) * 100);
                        this.setState({
                          uploadProgress: progress,
                        });
                      },
                    };
                    axios
                      .put(signedRequest, formData.file, options)
                      .then((result) => {
                        console.log("Response from s3", result);
                        //this.setState({ pdfLink: url });
                        let requestData = {
                          fileName: fileName,
                          originalname: originalname,
                          url: url,
                          companyId: this.state.currentUser.id,
                          currentUserId: this.state.currentUser.id,
                          title: formData.title,
                          description: formData.description,
                          // feedback: this.state.feedback.toString(),
                          // downloadOption: this.state.downloadOption,
                          fileType: fileType,
                        };

                        companyService.saveFile(requestData).then((data) => {
                          if (data && data.Status) {
                            // file info save success.
                            //this.toggleAddFileModal();
                            //this.getFilesByCategoryId();
                            this.setState({
                              uploadProgress: 0,
                              resourceSectionUpdatedAt: new Date().getTime(),
                            });
                            swal("File uploaded successfully", "", "success");
                            this.closeFileUploadModal();
                            this.getFilesByCompanyId();
                          } else {
                            // file info save fail
                            swal(
                              "File cannot be uploaded please try later",
                              "",
                              "error"
                            );
                          }
                        });
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  })
                  .catch((error) => {
                    console.log(error);
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
              }) => {
                return (
                  <Form>
                    <div className="row">
                      <div className="col">
                        <Progress
                          style={{
                            height: "17px",
                            backgroundColor: "#5955a5",
                          }}
                          className="mb-2"
                          value={this.state.uploadProgress}
                        >
                          <strong>{this.state.uploadProgress} %</strong>
                        </Progress>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col form-group required">
                        <label htmlFor="file">File</label>
                        <input
                          id="file"
                          name="file"
                          type="file"
                          onChange={(event) => {
                            setFieldValue("file", event.currentTarget.files[0]);
                          }}
                          className="form-control"
                        />
                        <ErrorMessage
                          name="file"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col form-group required">
                        <label className="control-label">Title</label>
                        <Field
                          name="title"
                          type="text"
                          placeholder="Title"
                          className={
                            "form-control" +
                            (errors.title && touched.title ? " is-invalid" : "")
                          }
                        />
                        <ErrorMessage
                          name="title"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col form-group required">
                        <label className="control-label">Description</label>
                        <Field
                          name="description"
                          component="textarea"
                          placeholder="Description"
                          className={
                            "form-control" +
                            (errors.description && touched.description
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="description"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                    </div>
                    <div className="form-group text-center mb-0 m-t-20">
                      <div className="offset-md-3 col-md-6 col-xs-12">
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
                    </div>

                    {status && (
                      <div className={"alert alert-danger mt-2"}>{status}</div>
                    )}
                  </Form>
                );
              }}
            </Formik>
          </Dialog>
        </div>
        <div>
          <Modal
            isOpen={this.state.audioModal}
            centered
            toggle={this.toggleAudio}
          >
            <ModalHeader toggle={this.toggleAudio}>
              {this.state.filename}
            </ModalHeader>
            <ModalBody>
              <div className="player-wrapper">
                <ReactPlayer
                  className="react-player"
                  url={this.state.mediaUrl}
                  controls
                  width="100%"
                  height="55px"
                />
              </div>
            </ModalBody>
          </Modal>
        </div>
        <div>
          <Modal
            isOpen={this.state.videoModal}
            centered={true}
            toggle={this.toggleVideo}
            size="lg"
          >
            <ModalHeader toggle={this.toggleVideo}>
              {this.state.filename}
            </ModalHeader>
            <ModalBody className="p-0">
              <ReactPlayer
                className="react-player"
                url={this.state.mediaUrl}
                // light = {true}
                controls
                width="100%"
                height="100%"
              />
            </ModalBody>
          </Modal>
          <div>
            <CustomModal
              open={this.state.fileViewer}
              onCloseModal={this.togglefileViewer}
              fileType={this.state.fileType}
              filePath={this.state.mediaUrl}
              fileName={this.state.filename}
            />
          </div>
        </div>
        {/* Model to view PPT , PPTX , DOCS , DOCX ,  XLSX  */}
        <div>
          <Modal
            isOpen={this.state.docsViewModal}
            centered={true}
            toggle={this.toogleDocsView}
            size="lg"
          >
            <ModalHeader toggle={this.toogleDocsView}>
              {this.state.filename}
            </ModalHeader>
            <ModalBody className="p-0">
              <iframe
                src={`https://view.officeapps.live.com/op/embed.aspx?src=${this.state.docFile}`}
                width="100%"
                height="600px"
                frameBorder="0"
              />
            </ModalBody>
          </Modal>
        </div>
      </div>
    );
  }
}
