import React, { Component } from "react";
import { connect } from "react-redux";
import Header from "../layout/components/Header";
import queryString from "query-string";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faDirections,
  faDesktop,
  faClipboard,
} from "@fortawesome/free-solid-svg-icons";
import GoogleMapReact from "google-map-react";
import { MapMarker } from "../components/MapMarker";
import { companyService } from "../_services";
import {
  getClickableLink,
  concateAddress,
  formatAddressForGoogle,
  sortCompaniesAlpabatecially,
} from "../_helpers/_helperFunctions";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { Col, Row } from "react-bootstrap";
import FooterForHome from "../layout/components/FooterForHome";
import { setSearchTerm } from "../redux-store/action";

function mapStateToProps(state) {
  return {
    searchTerm: state.searchTerm,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setSearchTerm: (data) => {
      dispatch(setSearchTerm(data));
    },
  };
}
const companyMarkerList = [
  {
    lat: 42.2679371,
    lng: -83.0119475,
    text: "A & A Insurance Brokers Ltd",
  },
  {
    lat: 42.306922,
    lng: -82.9739764,
    text: "F&j Collision Windsor Ltd",
  },
  {
    lat: 42.310119,
    lng: -83.0243899,
    text: "F&j Collision Windsor Ltd",
  },
  {
    lat: 42.3123708,
    lng: -83.0710053,
    text: "Windsor Essex Community Health Centre",
  },
];

const mapOptions = {
  center: {
    lat: 42.317432,
    lng: -83.026772,
  },
  zoom: 10,
};
class SearchPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sector: "",
      location: "",
      searchTerm: "",
      activeCompanies: [],
      togglePhoneNumberModal: false,
      activeCompanyKey: "",
      isLoading: true,
    };
  }

  componentDidMount() {
    window.scroll(0, 0);
    this.setState({ isLoading: true });
    console.log("this.props.location.search: ", this.props.location.search);
    const queryParams = queryString.parse(this.props.location.search);
    const params = {
      sector: queryParams.sector,
      location: queryParams.location,
    };

    if (queryParams.sector || queryParams.location) {
      if (queryParams.sector && queryParams.location) {
        this.setState({
          sector: queryParams.sector,
          location: queryParams.location,
        });

        this.getCompanyBySectorAndLocation(params);
        return;
      }

      if (queryParams.sector) {
        this.getCompanyBySectorForHomePage(queryParams.sector);
        return;
      }

      if (queryParams.location) {
        this.getListOfCompaniesByCity(queryParams.location);
        return;
      }
    } else {
      this.setState({ activeCompanies: [], searchTerm: "" }, () => {
        if (this.props.searchTerm) {
          const SearchParam = {
            globalSearch: this.props.searchTerm,
          };
          this.setState({ searchTerm: SearchParam.globalSearch });
          this.companySearch(SearchParam);
        } else {
          const SearchParam = {
            globalSearch: queryParams.search,
          };
          this.setState({ searchTerm: queryParams.search });
          this.companySearch(SearchParam);
        }
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.searchTerm !== this.props.searchTerm) {
      let SearchParam = {
        globalSearch: this.props.searchTerm,
      };

      this.companySearch(SearchParam);
    }
  }

  getCompanyBySectorAndLocation = (params) => {
    this.setState(
      {
        sector: params.sector,
        location: params.location,
      },
      () => {
        companyService
          .getPublicCompanyByLocationAndSector(params)
          .then((data) => {
            if (data) {
              this.setState({
                activeCompanies: sortCompaniesAlpabatecially(data.Data),
                isLoading: false,
              });
            }
          });
      }
    );
  };

  companySearch = (SearchParam) => {
    this.setState({ sector: null, location: null, isLoading: true }, () => {
      companyService.companySearch(SearchParam).then((data) => {
        if (data) {
          this.setState({
            activeCompanies: sortCompaniesAlpabatecially(data.Data),
            isLoading: false,
          });
        }
      });
    });
  };

  getListOfCompaniesByCity = (city) => {
    this.setState(
      {
        location: city,
        sector: null,
      },
      () => {
        companyService.getListOfCompaniesByCity(city).then((data) => {
          if (data) {
            this.setState({
              activeCompanies: sortCompaniesAlpabatecially(data.Data),
              isLoading: false,
            });
          }
        });
      }
    );
  };

  getCompanyBySectorForHomePage = (sector) => {
    this.setState(
      {
        sector: sector,
        location: null,
      },
      () => {
        companyService.getCompanyBySectorForHomePage(sector).then((data) => {
          if (data) {
            this.setState({
              activeCompanies: sortCompaniesAlpabatecially(data.Data),
              isLoading: false,
            });
          }
        });
      }
    );
  };

  copyToClipBoard = (number) => {
    this.toast.show({
      severity: "success",
      summary: `${number}`,
      detail: "Copied To Clipboard",
    });
    navigator.clipboard.writeText(number);
  };

  handleClick = (key) => {
    this.props.history.push(
      `/company-details/${key || "f-j-collision-windsor"}`
    );
  };

  openPhoneNumberModal = (key) => {
    this.setState({ togglePhoneNumberModal: true, activeCompanyKey: key });
  };

  closePhoneNumberModal = () => {
    this.setState({ togglePhoneNumberModal: false });
  };

  handleWebsiteClick = (url) => {
    window.open(url);
  };

  handleDirectionsClick = (address) => {
    let formattedAddress = formatAddressForGoogle(address);
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${formattedAddress}&travelmode=driving`
    );
  };

  render() {
    const { searchTerm } = this.props;
    const { activeCompanies, activeCompanyKey, sector, location } = this.state;

    let filteredCompaniesLocation = activeCompanies.filter((companies) => {
      return companies?.location?.coordinates.length;
    });

    return (
      <>
        <Header history={this.props.history} />
        <Toast ref={(el) => (this.toast = el)} position="top-right"></Toast>
        {/* <div className="container"> */}
        {this.state.isLoading ? (
          <>
            {" "}
            <div
              className="w-100 d-flex justify-content-center pb-4"
              style={{ paddingTop: "100px" }}
            >
              <div className="spinner-border" role="status">
                <span className="visually-hidden"></span>
              </div>
            </div>
          </>
        ) : (
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-1"></div>
              <div className="col-11" style={{ marginTop: "9vh" }}>
                {activeCompanies.length > 0 ? (
                  <>
                    {searchTerm && location === null && sector === null && (
                      <p className="mt-3 " style={{ fontSize: "1.5rem" }}>
                        <span>{searchTerm || "Searched"}</span> (
                        {activeCompanies.length})
                      </p>
                    )}
                    {sector !== null && location !== null && (
                      <p className="mt-3" style={{ fontSize: "1.5rem" }}>
                        <span>{sector || "sector"}</span> located in{" "}
                        <span>{location || "location"}</span> (
                        {activeCompanies.length})
                      </p>
                    )}
                    {sector !== null && location == null && (
                      <p className="mt-3" style={{ fontSize: "1.5rem" }}>
                        <span>{sector || "sector"}</span>(
                        {activeCompanies.length})
                      </p>
                    )}

                    {sector === null && location !== null && (
                      <p className="mt-3" style={{ fontSize: "1.5rem" }}>
                        <span>{location || "location"}</span>(
                        {activeCompanies.length})
                      </p>
                    )}
                  </>
                ) : null}
              </div>
              <div className="col-md-12">
                <div className="card">
                  {activeCompanies.length > 0 ? (
                    <div className="companylistdiv">
                      {Object.keys(activeCompanies).map((key, index) => {
                        return (
                          <div key={index}>
                            <div className="listitmes">
                              <div
                                className="imgwraper"
                                onClick={(e) =>
                                  this.handleClick(activeCompanies[key]._id)
                                }
                              >
                                <img
                                  src={
                                    activeCompanies[key].companyLogo ||
                                    "/assets/images/weedc_120X120.png"
                                  }
                                  className="img-fluid"
                                  style={
                                    activeCompanies.companyLogo
                                      ? {
                                          backgroundColor:
                                            activeCompanies.companyLogo,
                                        }
                                      : null
                                  }
                                />
                              </div>
                              <div className="list-body">
                                <div className="row">
                                  <div className="col-12">
                                    <h5
                                      className="cursor-pointer"
                                      onClick={(e) =>
                                        this.handleClick(
                                          activeCompanies[key]._id
                                        )
                                      }
                                    >
                                      {
                                        activeCompanies[key]?.demographics
                                          ?.companyTitle
                                      }
                                    </h5>
                                  </div>
                                  <div
                                    className="col-12"
                                    onClick={(e) =>
                                      this.handleClick(activeCompanies[key]._id)
                                    }
                                  >
                                    <span>
                                      {" "}
                                      {concateAddress(
                                        activeCompanies[key]?.demographics
                                      )}
                                    </span>
                                  </div>
                                  <div
                                    className="col-12"
                                    onClick={(e) =>
                                      this.handleClick(activeCompanies[key]._id)
                                    }
                                  >
                                    <p>
                                      {
                                        activeCompanies[key]?.demographics
                                          ?.description
                                      }
                                    </p>
                                  </div>

                                  <div className="col-12">
                                    {activeCompanies[key]?.contactDetails
                                      ?.phoneNumber ||
                                    activeCompanies[key]?.contactDetails
                                      ?.alternatePhoneNumber ||
                                    activeCompanies[key]?.contactDetails
                                      ?.fax ? (
                                      <button
                                        className="btn btn-weedc search-list-box-btn mr-2"
                                        onClick={() => {
                                          this.openPhoneNumberModal(key);
                                        }}
                                      >
                                        <FontAwesomeIcon icon={faPhone} /> Phone
                                        Number
                                      </button>
                                    ) : null}

                                    <button
                                      className="btn btn-weedc search-list-box-btn mr-2"
                                      onClick={(e) => {
                                        this.handleDirectionsClick(
                                          concateAddress(
                                            activeCompanies[key]?.demographics
                                          )
                                        );
                                      }}
                                    >
                                      <FontAwesomeIcon icon={faDirections} />{" "}
                                      Directions
                                    </button>
                                    {activeCompanies[key]?.contactDetails
                                      ?.website ? (
                                      <button
                                        className="btn btn-weedc search-list-box-btn mr-2"
                                        onClick={(e) =>
                                          this.handleWebsiteClick(
                                            getClickableLink(
                                              activeCompanies[key]
                                                ?.contactDetails?.website
                                            )
                                          )
                                        }
                                      >
                                        <FontAwesomeIcon icon={faDesktop} />{" "}
                                        Website
                                      </button>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                              <div
                                className="col-md-2"
                                onClick={(e) =>
                                  this.handleClick(activeCompanies[key]._id)
                                }
                              ></div>
                            </div>

                            {/* <GoogleMapReact
                              bootstrapURLKeys={{
                                key: "AIzaSyD6GGik6mcxsZbKw60nof5NwYubIleeSYE",
                              }}
                              defaultCenter={{
                                lat:
                                  activeCompanies[key]?.location
                                    ?.coordinates[0],
                                lng:
                                  activeCompanies[key]?.location
                                    ?.coordinates[1],
                              }}
                              defaultZoom={mapOptions.zoom}
                            >
                              <MapMarker
                                key={index}
                                lat={
                                  activeCompanies[key]?.location?.coordinates[0]
                                }
                                lng={
                                  activeCompanies[key]?.location?.coordinates[1]
                                }
                                text={
                                  activeCompanies[key]?.demographics
                                    ?.companyTitle
                                }
                                address={
                                  activeCompanies[key]?.demographics?.address
                                }
                              />
                            </GoogleMapReact> */}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <h1>No Data Found</h1>
                  )}
                </div>
              </div>
              {/* <div className="col-md-4">
              <div className="mt-3">
                <div
                  className="mt-3"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#87ceeb",
                    height: "200px",
                    width: "100%"
                  }}
                >
                  {" "}
                </div>
              </div>
            </div> */}

              <Dialog
                header="Contact Details"
                visible={this.state.togglePhoneNumberModal}
                style={{ width: "35vw" }}
                onHide={this.closePhoneNumberModal}
              >
                <div className="company-info-details">
                  {activeCompanies[activeCompanyKey]?.contactDetails
                    ?.phoneNumber ? (
                    <>
                      <div className="company-info-box p-2">
                        <p>
                          <strong>Phone Number:</strong>
                          {
                            activeCompanies[activeCompanyKey]?.contactDetails
                              ?.phoneNumber
                          }
                        </p>
                      </div>
                      <div className="company-info-box p-2 text-right ml-3">
                        <div>
                          <FontAwesomeIcon
                            icon={faClipboard}
                            size="lg"
                            onClick={() =>
                              this.copyToClipBoard(
                                activeCompanies[activeCompanyKey]
                                  ?.contactDetails?.phoneNumber
                              )
                            }
                          />
                        </div>
                      </div>
                    </>
                  ) : null}

                  {activeCompanies[activeCompanyKey]?.contactDetails
                    ?.alternatePhoneNumber ? (
                    <>
                      <div className="company-info-box p-2">
                        <p>
                          <strong>Alternate Number:</strong>
                          {
                            activeCompanies[activeCompanyKey]?.contactDetails
                              ?.alternatePhoneNumber
                          }
                        </p>
                      </div>
                      <div className="company-info-box p-2 text-right ml-3">
                        <FontAwesomeIcon
                          icon={faClipboard}
                          size="lg"
                          onClick={() =>
                            this.copyToClipBoard(
                              activeCompanies[activeCompanyKey]?.contactDetails
                                ?.alternatePhoneNumber
                            )
                          }
                        />
                      </div>
                    </>
                  ) : null}

                  {activeCompanies[activeCompanyKey]?.contactDetails?.fax ? (
                    <>
                      <div className="company-info-box p-2">
                        <p>
                          <strong>Fax Number:</strong>
                          {
                            activeCompanies[activeCompanyKey]?.contactDetails
                              ?.fax
                          }
                        </p>
                      </div>
                      <div className="company-info-box p-2 text-right ml-3">
                        <FontAwesomeIcon
                          icon={faClipboard}
                          size="lg"
                          onClick={() =>
                            this.copyToClipBoard(
                              activeCompanies[activeCompanyKey]?.contactDetails
                                ?.fax
                            )
                          }
                        />
                      </div>
                    </>
                  ) : null}

                  {activeCompanies[activeCompanyKey]?.contactDetails
                    ?.executiveTelephone ? (
                    <>
                      <div className="company-info-box p-2">
                        <p>
                          <strong>Executive Telephone :</strong>
                          {
                            activeCompanies[activeCompanyKey]?.contactDetails
                              ?.executiveTelephone
                          }
                        </p>
                      </div>
                      <div className="company-info-box p-2 text-right ml-3">
                        <FontAwesomeIcon
                          icon={faClipboard}
                          size="lg"
                          onClick={() =>
                            this.copyToClipBoard(
                              activeCompanies[activeCompanyKey]?.contactDetails
                                ?.executiveTelephone
                            )
                          }
                        />
                      </div>
                    </>
                  ) : null}

                  {activeCompanies[activeCompanyKey]?.contactDetails
                    ?.salesTelephone ? (
                    <>
                      <div className="company-info-box p-2">
                        <p>
                          <strong>Sales Telephone :</strong>
                          {
                            activeCompanies[activeCompanyKey]?.contactDetails
                              ?.salesTelephone
                          }
                        </p>
                      </div>
                      <div className="company-info-box p-2 text-right ml-3">
                        <FontAwesomeIcon
                          icon={faClipboard}
                          size="lg"
                          onClick={() =>
                            this.copyToClipBoard(
                              activeCompanies[activeCompanyKey]?.contactDetails
                                ?.salesTelephone
                            )
                          }
                        />
                      </div>
                    </>
                  ) : null}
                </div>
              </Dialog>
            </div>
          </div>
        )}

        <FooterForHome />
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
