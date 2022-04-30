import React, { Component } from "react";
import Header from "../layout/components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import GoogleMapReact from "google-map-react";
import {
  getClickableLink,
  concateAddress,
  isObjectEmpty,
  formatAddressForGoogle,
} from "../_helpers/_helperFunctions";
import { MapMarker } from "../components/MapMarker";
import { BreadCrumb } from "primereact/breadcrumb";
import { companyService } from "../_services/company.service";
import ResourceGallery from "../components/ResourceGallery";
import ResourceViewer from "../components/ResourceViewer";
import {
  faPhone,
  faDirections,
  faDesktop,
  faClipboard,
} from "@fortawesome/free-solid-svg-icons";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { formService } from "../_services";
import FooterForHome from "../layout/components/FooterForHome";

export default class CompanyDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      companyInfo: {},
      keywords: ["Automobile", "Repair", "Cars", "Manufactoring", "Suspension"],
      togglePhoneNumberModal: false,
      companyDataLoading: true,
      selectedFile: {},
      resourceFiles: [],
      resourceViewer: false,
    };
  }

  componentDidMount() {
    this.getCompanyById();
    this.getCompanyResourceFiles();
    window.scroll(0, 0);
  }

  getCompanyById = () => {
    this.props.match.params.id &&
      companyService
        .getPublicCompanyById(this.props.match.params.id)
        .then((data) => {
          if (data) {
            this.setState({
              companyInfo: data.Data,
              companyDataLoading: false,
            });
          }
        });
  };

  getCompanyResourceFiles = () => {
    this.props.match.params.id &&
      companyService
        .getFilesForSpecificCompany(this.props.match.params.id)
        .then((data) => {
          if (data.Data) {
            this.setState({
              resourceFiles: data.Data,
            });
          }
        });
  };

  handleSelectedFile = (file, fileType) => {
    if (fileType === "others") {
      this.openFileinNewTab(file);
    } else {
      this.setState({ selectedFile: file, resourceViewer: true });
    }
  };

  handleResourceViewer = () => {
    this.setState((state) => {
      return { resourceViewer: !state.resourceViewer };
    });
  };

  openFileinNewTab = async (file) => {
    let loadedFile = await formService.getObjectFromS3NoAuth(file?.key);
    window.open(loadedFile, "_blank");
  };

  handleWebsiteClick = (url) => {
    window.open(url);
  };

  handleClick = () => {
    this.props.history.push("/company-details");
  };

  openPhoneNumberModal = () => {
    this.setState({ togglePhoneNumberModal: true });
  };

  closePhoneNumberModal = () => {
    this.setState({ togglePhoneNumberModal: false });
  };

  copyToClipBoard = (number) => {
    this.toast.show({
      severity: "success",
      summary: `${number}`,
      detail: "Copied To Clipboard",
    });
    navigator.clipboard.writeText(number);
  };

  generatedRandomColors = () => {
    let color = `#${Math.floor(100000 + Math.random() * 900000)}`;
    return color;
  };

  handleDirectionsClick = (address) => {
    let formattedAddress = formatAddressForGoogle(address);
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${formattedAddress}&travelmode=driving`
    );
  };

  render() {
    const { companyInfo } = this.state;
    const mapOptions = {
      center: {
        lat: companyInfo?.location?.coordinates[0],
        lng: companyInfo?.location?.coordinates[1],
      },
      zoom: 11,
    };

    const items = [
      {
        label:
          companyInfo?.demographics?.companyTitle ||
          "F&J Collision Windsor Ltd",
      },
    ];
    const home = { icon: "pi pi-home", url: "/" };
    return (
      <>
        <Header history={this.props.history} />
        <Toast ref={(el) => (this.toast = el)} position="top-right"></Toast>
        <div className="container">
          <BreadCrumb model={items} home={home} className="mt-2" />
          <div className="card mt-3">
            <div className="row">
              <div className="col-md-2">
                <img
                  src={
                    companyInfo.companyLogo ||
                    "/assets/images/weedc_120X120.png"
                  }
                  className="img-thumbnail"
                  style={
                    companyInfo.companyLogo
                      ? { backgroundColor: companyInfo.companyLogo }
                      : null
                  }
                  width="200px"
                  height="200px"
                />
              </div>
              <div className="col-md-10">
                <div className="row">
                  <div className="col-12">
                    <span className="company-title">
                      {companyInfo?.demographics?.companyTitle ||
                        "F&j Collision Windsor Ltd"}
                    </span>
                    {companyInfo.badges &&
                      companyInfo.badges.map((keyword, index) => {
                        return (
                          <span
                            className="p-tag p-tag-secondary ml-1"
                            style={{
                              backgroundColor: this.generatedRandomColors(),
                            }}
                            key={index}
                          >
                            {keyword}
                          </span>
                        );
                      })}
                  </div>

                  <div className="col-12">
                    <p className="pt-2">
                      {concateAddress(companyInfo?.demographics)}
                    </p>
                  </div>
                  <div className="col-12">
                    {companyInfo?.contactDetails?.phoneNumber ||
                    companyInfo?.contactDetails?.alternatePhoneNumber ||
                    companyInfo?.contactDetails?.fax ? (
                      <button
                        className="btn btn-weedc search-list-box-btn mr-2"
                        onClick={this.openPhoneNumberModal}
                      >
                        <FontAwesomeIcon icon={faPhone} /> Phone Number
                      </button>
                    ) : null}

                    <button
                      className="btn btn-weedc search-list-box-btn mr-2"
                      onClick={(e) => {
                        this.handleDirectionsClick(
                          concateAddress(companyInfo?.demographics)
                        );
                      }}
                    >
                      <FontAwesomeIcon icon={faDirections} /> Directions
                    </button>
                    {companyInfo?.contactDetails?.website ? (
                      <button
                        className="btn btn-weedc search-list-box-btn mr-2"
                        onClick={(e) =>
                          this.handleWebsiteClick(
                            getClickableLink(
                              companyInfo?.contactDetails?.website
                            )
                          )
                        }
                      >
                        <FontAwesomeIcon icon={faDesktop} /> Website
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="mt-3">
                  <ResourceGallery
                    list={this.state.resourceFiles}
                    onSelectFile={this.handleSelectedFile}
                  />
                </div>
              </div>
              <div className="col-md-8">
                <div className="mt-3 company-details-box">
                  {companyInfo?.demographics?.description ? (
                    <h1>Details &amp; Description</h1>
                  ) : null}

                  {companyInfo?.demographics?.description ? (
                    <p>{companyInfo?.demographics?.description}</p>
                  ) : null}

                  {companyInfo?.demographics?.parentName ||
                  companyInfo?.demographics?.HQAddress ||
                  companyInfo?.demographics?.HQCity ||
                  companyInfo?.demographics?.HQCountry ||
                  companyInfo?.demographics?.sector.length ? (
                    <h1 className="titleBga">
                      <i className="pi pi-chevron-right "></i> Company Overview
                    </h1>
                  ) : null}

                  <div className="row m-0">
                    <div
                      className="company-info-details px-3 border-b-l-r"
                      id="collapse1"
                    >
                      {companyInfo?.demographics?.sector?.length &&
                      companyInfo?.demographics?.sector ? (
                        <div className="company-info-box">
                          <h4 className="py-2">Sector</h4>
                          <div className="mb-3">
                            {companyInfo?.demographics?.sector.map(
                              (keyword, index) => {
                                return (
                                  <span
                                    data-toggle="tooltip"
                                    title={keyword}
                                    className="badge badge-secondary keyword-badges word-wrapping mb-1 mr-2 "
                                    key={index}
                                  >
                                    {keyword}
                                  </span>
                                );
                              }
                            )}
                          </div>
                        </div>
                      ) : null}

                      {companyInfo?.demographics?.parentName ? (
                        <div className="company-info-box">
                          <h4 className="py-2">Parent company name</h4>
                          <p>{companyInfo?.demographics?.parentName}</p>
                        </div>
                      ) : null}

                      {companyInfo?.demographics?.address ? (
                        <div className="company-info-box">
                          <h4 className="py-2">Address</h4>
                          <p>{companyInfo?.demographics?.address}</p>
                        </div>
                      ) : null}
                      {companyInfo?.demographics?.address1 ? (
                        <div className="company-info-box">
                          <h4 className="py-2">Address 1</h4>
                          <p>{companyInfo?.demographics?.address1}</p>
                        </div>
                      ) : null}
                      {companyInfo?.demographics?.city ? (
                        <div className="company-info-box">
                          <h4 className="py-2">City</h4>
                          <p>{companyInfo?.demographics?.city}</p>
                        </div>
                      ) : null}
                      {companyInfo?.demographics?.municipality.length > 0 &&
                      companyInfo?.demographics?.municipality ? (
                        <div className="company-info-box">
                          <h4 className="py-2">Municipality</h4>
                          <div className="mb-3">
                            {companyInfo?.demographics?.municipality.map(
                              (keyword, index) => {
                                return (
                                  <span
                                    className="badge badge-secondary keyword-badges mb-1 mr-2"
                                    key={index}
                                  >
                                    {keyword}
                                  </span>
                                );
                              }
                            )}
                          </div>
                        </div>
                      ) : null}

                      {companyInfo?.demographics?.province ? (
                        <div className="company-info-box">
                          <h4 className="py-2">Province</h4>
                          <p>{companyInfo?.demographics?.province}</p>
                        </div>
                      ) : null}

                      {companyInfo?.demographics?.country.length &&
                      companyInfo?.demographics?.country ? (
                        <div className="company-info-box">
                          <h4 className="py-2">Country</h4>
                          <div className="mb-3">
                            {companyInfo?.demographics?.country.map(
                              (keyword, index) => {
                                return (
                                  <span
                                    className="badge badge-secondary keyword-badges mb-1 mr-2"
                                    key={index}
                                  >
                                    {keyword}
                                  </span>
                                );
                              }
                            )}
                          </div>
                        </div>
                      ) : null}

                      {companyInfo?.demographics?.postalCode ? (
                        <div className="company-info-box">
                          <h4 className="py-2">Postal Code</h4>
                          <p>{companyInfo?.demographics?.postalCode}</p>
                        </div>
                      ) : null}

                      {companyInfo?.demographics?.headQuarterOrBranch.length >
                        0 && companyInfo?.demographics?.headQuarterOrBranch ? (
                        <div className="company-info-box">
                          <h4 className="py-2">Headquarters or Branch</h4>
                          <p>
                            {companyInfo?.demographics?.headQuarterOrBranch[0]}
                          </p>
                        </div>
                      ) : null}

                      {companyInfo?.demographics?.HQAddress ? (
                        <div className="company-info-box">
                          <h4 className="py-2">Headquarter Address</h4>
                          <p>{companyInfo?.demographics?.HQAddress}</p>
                        </div>
                      ) : null}

                      {companyInfo?.demographics?.HQCity ? (
                        <div className="company-info-box">
                          <h4 className="py-2">Headquarters – City</h4>
                          <p>{companyInfo?.demographics?.HQCity}</p>
                        </div>
                      ) : null}

                      {companyInfo?.demographics?.HQCountry.length > 0 ? (
                        <div className="company-info-box">
                          <h4 className="py-2">Headquarters – Country</h4>
                          <div className="mb-3">
                            {companyInfo?.demographics?.HQCountry.map(
                              (keyword, index) => {
                                return (
                                  <span
                                    className="badge badge-secondary keyword-badges mb-1 mr-2"
                                    key={index}
                                  >
                                    {keyword}
                                  </span>
                                );
                              }
                            )}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {isObjectEmpty(companyInfo.aboutResources) ? null : (
                    <h1 className="titleBga">
                      <i className="pi pi-chevron-right"></i> Details and
                      Capabilities
                    </h1>
                  )}

                  <div className="row m-0">
                    <div className="company-info-details px-3 border-b-l-r">
                      {companyInfo?.aboutResources?.employeesAtCurrentLocation
                        .length > 0 &&
                      companyInfo?.aboutResources
                        ?.employeesAtCurrentLocation ? (
                        <div className="company-info-box">
                          <h4 className="py-2">
                            Employees at current location
                          </h4>
                          <div className="mb-3">
                            {companyInfo?.aboutResources?.employeesAtCurrentLocation.map(
                              (keyword, index) => {
                                return (
                                  <span
                                    className="badge badge-secondary keyword-badges mb-1 mr-2"
                                    key={index}
                                  >
                                    {keyword}
                                  </span>
                                );
                              }
                            )}
                          </div>
                        </div>
                      ) : null}

                      {/* {companyInfo?.aboutResources
                        ?.employeeAtCurrentLocationText ? (
                        <div className="company-info-box">
                          
                          <h4 className="py-2">Employees Count Text</h4>
                          <div className="mb-3">
                            <p>
                              {
                                companyInfo?.aboutResources
                                  ?.employeeAtCurrentLocationText
                              }
                            </p>
                          </div>
                        </div>
                      ) : null} */}

                      {companyInfo?.aboutResources?.industriesSupplied.length &&
                      companyInfo?.aboutResources?.industriesSupplied ? (
                        <div className="company-info-box">
                          <h4 className="py-2">Industries supplied</h4>
                          <div className="mb-3">
                            {companyInfo?.aboutResources?.industriesSupplied.map(
                              (keyword, index) => {
                                return (
                                  <span
                                    className="badge badge-secondary keyword-badges word-wrapping1 mb-1 mr-3"
                                    key={index}
                                  >
                                    {console.log(keyword)}
                                    {keyword}
                                  </span>
                                );
                              }
                            )}
                          </div>
                        </div>
                      ) : null}

                      {companyInfo?.aboutResources?.industriesSuppliedText ? (
                        <div className="company-info-box">
                          <h4 className="py-2">Industires supplied (Others)</h4>
                          <div className="mb-3">
                            <p>
                              {
                                companyInfo?.aboutResources
                                  ?.industriesSuppliedText
                              }
                            </p>
                          </div>
                        </div>
                      ) : null}

                      {companyInfo?.aboutResources?.materialCapabilites
                        .length &&
                      companyInfo?.aboutResources?.materialCapabilites ? (
                        <div className="company-info-box">
                          <h4 className="py-2">Material capabilites</h4>
                          <div className="mb-3">
                            {companyInfo?.aboutResources?.materialCapabilites.map(
                              (keyword, index) => {
                                return (
                                  <span
                                    className="badge badge-secondary keyword-badges word-wrapping1 mb-1 mr-3"
                                    key={index}
                                  >
                                    {keyword}
                                  </span>
                                );
                              }
                            )}
                          </div>
                        </div>
                      ) : null}
                      {companyInfo?.aboutResources?.materialsCapabilitesText ? (
                        <div className="company-info-box">
                          <h4 className="py-2">
                            Materials capabilites (Others)
                          </h4>
                          <div className="mb-3">
                            <p>
                              {
                                companyInfo?.aboutResources
                                  ?.materialsCapabilitesText
                              }
                            </p>
                          </div>
                        </div>
                      ) : null}
                      {companyInfo?.aboutResources?.primary2Digit.length > 0 ? (
                        <div className="company-info-box">
                          <h4 className="py-2"> Primary NAICS 2 Digit </h4>
                          <div className="mb-3">
                            <p>
                              {companyInfo?.aboutResources?.primary2Digit[0]}
                            </p>
                          </div>
                        </div>
                      ) : null}

                      {companyInfo?.aboutResources?.primary3Digit.length > 0 ? (
                        <div className="company-info-box">
                          <h4 className="py-2"> Primary NAICS 3 Digit</h4>
                          <div className="mb-3">
                            <p>
                              {companyInfo?.aboutResources?.primary3Digit[0]}
                            </p>
                          </div>
                        </div>
                      ) : null}
                      {companyInfo?.aboutResources?.primary4Digit.length > 0 ? (
                        <div className="company-info-box">
                          <h4 className="py-2"> Primary NAICS 4 Digit</h4>
                          <div className="mb-3">
                            <p>
                              {companyInfo?.aboutResources?.primary4Digit[0]}
                            </p>
                          </div>
                        </div>
                      ) : null}
                      {companyInfo?.aboutResources?.primary5Digit.length > 0 ? (
                        <div className="company-info-box">
                          <h4 className="py-2">Primary NAICS 5 Digit </h4>
                          <div className="mb-3">
                            <p>
                              {companyInfo?.aboutResources?.primary5Digit[0]}
                            </p>
                          </div>
                        </div>
                      ) : null}
                      {companyInfo?.aboutResources?.primary6Digit.length > 0 ? (
                        <div className="company-info-box">
                          <h4 className="py-2"> Primary NAICS 6 Digit</h4>
                          <div className="mb-3">
                            <p>
                              {companyInfo?.aboutResources?.primary6Digit[0]}
                            </p>
                          </div>
                        </div>
                      ) : null}

                      {companyInfo?.aboutResources?.secondary2Digit.length >
                      0 ? (
                        <div className="company-info-box">
                          <h4 className="py-2">Secondary NAICS 2 Digit</h4>
                          <div className="mb-3">
                            <p>
                              {companyInfo?.aboutResources?.secondary2Digit[0]}
                            </p>
                          </div>
                        </div>
                      ) : null}
                      {companyInfo?.aboutResources?.secondary3Digit.length >
                      0 ? (
                        <div className="company-info-box">
                          <h4 className="py-2">Secondary NAICS 3 Digit</h4>
                          <div className="mb-3">
                            <p>
                              {companyInfo?.aboutResources?.secondary3Digit[0]}
                            </p>
                          </div>
                        </div>
                      ) : null}
                      {companyInfo?.aboutResources?.secondary4Digit.length >
                      0 ? (
                        <div className="company-info-box">
                          <h4 className="py-2">Secondary NAICS 4 Digit</h4>
                          <div className="mb-3">
                            <p>
                              {companyInfo?.aboutResources?.secondary4Digit[0]}
                            </p>
                          </div>
                        </div>
                      ) : null}
                      {companyInfo?.aboutResources?.secondary5Digit.length >
                      0 ? (
                        <div className="company-info-box">
                          <h4 className="py-2">Secondary NAICS 5 Digit</h4>
                          <div className="mb-3">
                            <p>
                              {companyInfo?.aboutResources?.secondary5Digit[0]}
                            </p>
                          </div>
                        </div>
                      ) : null}
                      {companyInfo?.aboutResources?.secondary6Digit.length >
                      0 ? (
                        <div className="company-info-box">
                          <h4 className="py-2">Secondary NAICS 6 Digit</h4>
                          <div className="mb-3">
                            <p>
                              {companyInfo?.aboutResources?.secondary6Digit[0]}
                            </p>
                          </div>
                        </div>
                      ) : null}

                      {companyInfo?.aboutResources?.certification.length &&
                      companyInfo?.aboutResources?.certification ? (
                        <div className="company-info-box">
                          <h4 className="py-2">Certification</h4>
                          <div className="mb-3">
                            <p>{companyInfo?.aboutResources?.certification}</p>
                          </div>
                        </div>
                      ) : null}

                      {companyInfo?.aboutResources?.certificationText ? (
                        <div className="company-info-box">
                          <h4 className="py-2">Certification text</h4>
                          <div className="mb-3">
                            <p>
                              {companyInfo?.aboutResources?.certificationText}
                            </p>
                          </div>
                        </div>
                      ) : null}
                      {companyInfo?.aboutResources?.businessLeadership.length &&
                      companyInfo?.aboutResources?.businessLeadership ? (
                        <div className="company-info-box">
                          <h4 className="py-2">Business leadership</h4>
                          <div className="mb-3">
                            {companyInfo?.aboutResources?.businessLeadership.map(
                              (keyword, index) => {
                                return (
                                  <span
                                    className="badge badge-secondary keyword-badges mb-1 mr-2"
                                    key={index}
                                  >
                                    {keyword}
                                  </span>
                                );
                              }
                            )}
                          </div>
                        </div>
                      ) : null}
                      {companyInfo?.aboutResources?.businessLeadershipText ? (
                        <div className="company-info-box">
                          <h4 className="py-2">Business leadership text</h4>
                          <div className="mb-3">
                            <p>
                              {
                                companyInfo?.aboutResources
                                  ?.businessLeadershipText
                              }
                            </p>
                          </div>
                        </div>
                      ) : null}

                      {companyInfo?.aboutResources?.disasterRecovery ? (
                        <div className="company-info-box">
                          <h4 className="py-2">Disaster recovery</h4>
                          <div className="mb-3">
                            <p>
                              {companyInfo?.aboutResources?.disasterRecovery}
                            </p>
                          </div>
                        </div>
                      ) : null}

                      {companyInfo?.aboutResources?.governmentSupplier.length &&
                      companyInfo?.aboutResources?.governmentSupplier ? (
                        <div className="company-info-box">
                          <h4 className="py-2">
                            Has been government supplier?
                          </h4>
                          <div className="mb-3">
                            {companyInfo?.aboutResources?.governmentSupplier.map(
                              (keyword, index) => {
                                return (
                                  <span
                                    className="badge badge-secondary keyword-badges mb-1 mr-2"
                                    key={index}
                                  >
                                    {keyword}
                                  </span>
                                );
                              }
                            )}
                          </div>
                        </div>
                      ) : null}

                      {companyInfo?.aboutResources?.exportMarkets.length &&
                      companyInfo?.aboutResources?.exportMarkets ? (
                        <div className="company-info-box">
                          <h4 className="py-2">Export markets</h4>
                          <div className="mb-3">
                            {companyInfo?.aboutResources?.exportMarkets.map(
                              (keyword, index) => {
                                return (
                                  <span
                                    className="badge badge-secondary keyword-badges mb-1 mr-2"
                                    key={index}
                                  >
                                    {keyword}
                                  </span>
                                );
                              }
                            )}
                          </div>
                        </div>
                      ) : null}

                      {companyInfo?.aboutResources?.industriesAffliation
                        .length &&
                      companyInfo?.aboutResources?.industriesAffliation ? (
                        <div className="company-info-box">
                          <h4 className="py-2">Industry associations</h4>
                          <div className="mb-3">
                            {companyInfo?.aboutResources?.industriesAffliation.map(
                              (keyword, index) => {
                                return (
                                  <span
                                    className="badge badge-secondary keyword-badges mb-1 mr-2"
                                    key={index}
                                  >
                                    {keyword}
                                  </span>
                                );
                              }
                            )}
                          </div>
                        </div>
                      ) : null}

                      {companyInfo?.aboutResources?.facilitySize ? (
                        <div className="company-info-box">
                          <h4 className="py-2">Facility size (Square feet)</h4>
                          <div className="mb-3">
                            <p>{companyInfo?.aboutResources?.facilitySize}</p>
                          </div>
                        </div>
                      ) : null}

                      {companyInfo?.aboutResources?.establishmentYear ? (
                        <div className="company-info-box">
                          <h4 className="py-2">Year of establishment</h4>
                          <div className="mb-3">
                            <p>
                              {companyInfo?.aboutResources?.establishmentYear}
                            </p>
                          </div>
                        </div>
                      ) : null}

                      {companyInfo?.aboutResources?.industriesAffliationText ? (
                        <div className="company-info-box">
                          <h4 className="py-2">Industries affiliation text</h4>
                          <div className="mb-3">
                            <p>
                              {
                                companyInfo?.aboutResources
                                  ?.industriesAffliationText
                              }
                            </p>
                          </div>
                        </div>
                      ) : null}

                      {companyInfo?.aboutResources?.industriesAffliationText ? (
                        <div className="company-info-box">
                          <h4 className="py-2">Industries affiliation text</h4>
                          <div className="mb-3">
                            <p>
                              {
                                companyInfo?.aboutResources
                                  ?.industriesAffliationText
                              }
                            </p>
                          </div>
                        </div>
                      ) : null}
                      {companyInfo?.aboutResources?.userName ? (
                        <div className="company-info-box">
                          <h4 className="py-2">User name</h4>
                          <div className="mb-3">
                            <p>{companyInfo?.aboutResources?.userName}</p>
                          </div>
                        </div>
                      ) : null}

                      {companyInfo?.aboutResources?.userEmail ? (
                        <div className="company-info-box">
                          <h4 className="py-2">User email</h4>
                          <div className="mb-3">
                            <p>{companyInfo?.aboutResources?.userEmail}</p>
                          </div>
                        </div>
                      ) : null}

                      {companyInfo?.aboutResources?.idustries ? (
                        <div className="company-info-box">
                          <h4 className="py-2">Idustries</h4>
                          <div className="mb-3">
                            <p>{companyInfo?.aboutResources?.idustries}</p>
                          </div>
                        </div>
                      ) : null}

                      {companyInfo?.aboutResources?.liabilityInsurance ? (
                        <div className="company-info-box">
                          <h4 className="py-2">Liability insurance</h4>
                          <div className="mb-3">
                            <p>
                              {companyInfo?.aboutResources?.liabilityInsurance}
                            </p>
                          </div>
                        </div>
                      ) : null}

                      {companyInfo?.aboutResources?.materials ? (
                        <div className="company-info-box">
                          <h4 className="py-2">Materials</h4>
                          <div className="mb-3">
                            <p>{companyInfo?.aboutResources?.materials}</p>
                          </div>
                        </div>
                      ) : null}

                      {companyInfo?.aboutResources?.capability ? (
                        <div className="company-info-box">
                          <h4 className="py-2">Capability</h4>
                          <div className="mb-3">
                            <p>{companyInfo?.aboutResources?.capability}</p>
                          </div>
                        </div>
                      ) : null}

                      {companyInfo?.aboutResources?.maketingChannels ? (
                        <div className="company-info-box">
                          <h4 className="py-2">Marketing channels</h4>
                          <div className="mb-3">
                            <p>
                              {companyInfo?.aboutResources?.maketingChannels}
                            </p>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {isObjectEmpty(companyInfo.contactDetails) ? null : (
                    <h1 className="titleBga">
                      <i className="pi pi-chevron-right"></i> Contact Details
                    </h1>
                  )}

                  <div className="row m-0">
                    <div className="company-info-details px-3 border-b-l-r">
                      {companyInfo?.contactDetails?.phoneNumber ? (
                        <div className="company-info-box">
                          <h4 className="py-2">Phone number</h4>
                          <div className="mb-3">
                            <p>{companyInfo?.contactDetails?.phoneNumber}</p>
                          </div>
                        </div>
                      ) : null}

                      {companyInfo?.contactDetails?.fax ? (
                        <div className="company-info-box">
                          <h4 className="py-2">Fax number</h4>
                          <div className="mb-3">
                            <p>{companyInfo?.contactDetails?.fax}</p>
                          </div>
                        </div>
                      ) : null}

                      {companyInfo?.contactDetails?.email ? (
                        <div className="company-info-box">
                          <h4 className="py-2">Email</h4>
                          <div className="mb-3">
                            <p>{companyInfo?.contactDetails?.email}</p>
                          </div>
                        </div>
                      ) : null}

                      {companyInfo?.contactDetails?.website ? (
                        <div className="company-info-box">
                          <h4 className="py-2">Website</h4>
                          <div className="mb-3">
                            <p>{companyInfo?.contactDetails?.website}</p>
                          </div>
                        </div>
                      ) : null}

                      {companyInfo?.contactDetails?.executiveName ? (
                        <div className="company-info-box">
                          <h4 className="py-2">Executive name</h4>
                          <div className="mb-3">
                            <p>{companyInfo?.contactDetails?.executiveName}</p>
                          </div>
                        </div>
                      ) : null}

                      {companyInfo?.contactDetails?.executiveTitle ? (
                        <div className="company-info-box">
                          <h4 className="py-2">Executive title</h4>
                          <div className="mb-3">
                            <p>{companyInfo?.contactDetails?.executiveTitle}</p>
                          </div>
                        </div>
                      ) : null}

                      {companyInfo?.contactDetails?.executiveEmail ? (
                        <div className="company-info-box">
                          <h4 className="py-2">Executive email</h4>
                          <div className="mb-3">
                            <p>{companyInfo?.contactDetails?.executiveEmail}</p>
                          </div>
                        </div>
                      ) : null}

                      {companyInfo?.contactDetails?.executiveTelephone ? (
                        <div className="company-info-box">
                          <h4 className="py-2">Executive telephone</h4>
                          <div className="mb-3">
                            <p>
                              {companyInfo?.contactDetails?.executiveTelephone}
                            </p>
                          </div>
                        </div>
                      ) : null}

                      {companyInfo?.contactDetails?.salesName ? (
                        <div className="company-info-box">
                          <h4 className="py-2">Sales name</h4>
                          <div className="mb-3">
                            <p>{companyInfo?.contactDetails?.salesName}</p>
                          </div>
                        </div>
                      ) : null}

                      {companyInfo?.contactDetails?.salesTitle ? (
                        <div className="company-info-box">
                          <h4 className="py-2">Sales title</h4>
                          <div className="mb-3">
                            <p>{companyInfo?.contactDetails?.salesTitle}</p>
                          </div>
                        </div>
                      ) : null}

                      {companyInfo?.contactDetails?.salesEmail ? (
                        <div className="company-info-box">
                          <h4 className="py-2">Sales email</h4>
                          <div className="mb-3">
                            <p>{companyInfo?.contactDetails?.salesEmail}</p>
                          </div>
                        </div>
                      ) : null}
                      {companyInfo?.contactDetails?.salesTelephone ? (
                        <div className="company-info-box">
                          <h4 className="py-2">Sales telephone</h4>
                          <div className="mb-3">
                            <p>{companyInfo?.contactDetails?.salesTelephone}</p>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                {!this.state.companyDataLoading ? (
                  <div className="mt-3">
                    <div
                      className="mt-3"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#87ceeb",
                        height: "250px",
                        width: "100%",
                      }}
                    >
                      <GoogleMapReact
                        bootstrapURLKeys={{
                          key: "AIzaSyD6GGik6mcxsZbKw60nof5NwYubIleeSYE",
                        }}
                        defaultCenter={mapOptions.center}
                        defaultZoom={mapOptions.zoom}
                      >
                        <MapMarker
                          lat={companyInfo?.location?.coordinates[0]}
                          lng={companyInfo?.location?.coordinates[1]}
                          text={companyInfo?.demographics?.companyTitle}
                          address={companyInfo?.demographics?.address}
                        />
                      </GoogleMapReact>
                    </div>
                  </div>
                ) : null}

                {companyInfo?.aboutResources?.isHiring ? (
                  <div className="hiring-alert mt-3 text-center p-5">
                    <h1>We're Hiring</h1>

                    <a
                      target="_blank"
                      href={getClickableLink(
                        companyInfo?.aboutResources?.hiringLink
                      )}
                      className="btn btn-weedc"
                    >
                      Apply Now
                    </a>
                  </div>
                ) : null}
              </div>

              <div className="col-md-12">
                <div className="mt-2 text-center">
                  {companyInfo?.contactDetails?.facebook ? (
                    <a
                      target="_blank"
                      href={getClickableLink(
                        companyInfo?.contactDetails?.facebook
                      )}
                    >
                      <img
                        src="/assets/icons/facebook.png"
                        className="social-icons"
                      />
                    </a>
                  ) : null}

                  {companyInfo?.contactDetails?.instagram ? (
                    <a
                      target="_blank"
                      href={getClickableLink(
                        companyInfo?.contactDetails?.instagram
                      )}
                    >
                      <img
                        src="/assets/icons/instagram.png"
                        className="social-icons"
                      />
                    </a>
                  ) : null}

                  {companyInfo?.contactDetails?.linkedin ? (
                    <a
                      target="_blank"
                      href={getClickableLink(
                        companyInfo?.contactDetails?.linkedin
                      )}
                    >
                      <img
                        src="/assets/icons/linkedin.png"
                        className="social-icons"
                      />
                    </a>
                  ) : null}

                  {companyInfo?.contactDetails?.twitter ? (
                    <a
                      target="_blank"
                      href={getClickableLink(
                        companyInfo?.contactDetails?.twitter
                      )}
                    >
                      <img
                        src="/assets/icons/twitter.png"
                        className="social-icons"
                      />
                    </a>
                  ) : null}

                  {companyInfo?.contactDetails?.youtubeChannelPath ? (
                    <a
                      target="_blank"
                      href={getClickableLink(
                        companyInfo?.contactDetails?.youtubeChannelPath
                      )}
                    >
                      <img
                        src="/assets/icons/youtube.png"
                        className="social-icons-youtube"
                      />
                    </a>
                  ) : null}
                </div>
              </div>
              <Dialog
                className="phoneNumberDialog"
                header="Contact Details"
                visible={this.state.togglePhoneNumberModal}
                onHide={this.closePhoneNumberModal}
              >
                <div className="company-info-details">
                  {companyInfo?.contactDetails?.phoneNumber ? (
                    <>
                      <div className="max-width p-2">
                        <p className="display-inline">
                          <strong>Phone number :</strong>
                          {companyInfo?.contactDetails?.phoneNumber}
                        </p>
                        <FontAwesomeIcon
                          className="float-right"
                          icon={faClipboard}
                          size="lg"
                          onClick={() =>
                            this.copyToClipBoard(
                              companyInfo?.contactDetails?.phoneNumber
                            )
                          }
                        />
                      </div>
                    </>
                  ) : null}

                  {companyInfo?.contactDetails?.fax ? (
                    <>
                      <div className="max-width p-2">
                        <p className="display-inline">
                          <strong>Fax :</strong>
                          {companyInfo?.contactDetails?.fax}
                        </p>
                        <FontAwesomeIcon
                          className="float-right"
                          icon={faClipboard}
                          size="lg"
                          onClick={() =>
                            this.copyToClipBoard(
                              companyInfo?.contactDetails?.fax
                            )
                          }
                        />
                      </div>
                    </>
                  ) : null}

                  {companyInfo?.contactDetails?.executiveTelephone ? (
                    <>
                      <div className="max-width p-2">
                        <p className="display-inline">
                          <strong>Executive telephone :</strong>
                          {companyInfo?.contactDetails?.executiveTelephone}
                        </p>
                        <FontAwesomeIcon
                          className="float-right"
                          icon={faClipboard}
                          size="lg"
                          onClick={() =>
                            this.copyToClipBoard(
                              companyInfo?.contactDetails?.executiveTelephone
                            )
                          }
                        />
                      </div>
                    </>
                  ) : null}

                  {companyInfo?.contactDetails?.salesTelephone ? (
                    <>
                      <div className="max-width p-2">
                        <p className="display-inline">
                          <strong>Sales telephone :</strong>
                          {companyInfo?.contactDetails?.salesTelephone}
                        </p>
                        <FontAwesomeIcon
                          className="float-right"
                          icon={faClipboard}
                          size="lg"
                          onClick={() =>
                            this.copyToClipBoard(
                              companyInfo?.contactDetails?.salesTelephone
                            )
                          }
                        />
                      </div>
                    </>
                  ) : null}
                </div>
              </Dialog>

              <ResourceViewer
                file={this.state.selectedFile}
                isOpen={this.state.resourceViewer}
                toggle={this.handleResourceViewer}
              />
            </div>
          </div>
        </div>
        <FooterForHome />
      </>
    );
  }
}
