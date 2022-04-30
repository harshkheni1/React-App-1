import React, { Component } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import Header from "../layout/components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import queryString from "query-string";
import { companyService } from "../_services/company.service";
import {
  faPhone,
  faDirections,
  faDesktop,
  faClipboard
} from "@fortawesome/free-solid-svg-icons";
import {
  getClickableLink,
  concateAddress,
  formatAddressForGoogle,
  sortCompanies,
  updateCityWithCount,
  updateSectorWithCount
} from "../_helpers/_helperFunctions";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { sectorService } from "../_services/sector.service";
import { IMAGE_OBJECT, SECTORS_NAME_CHANGE } from "../../src/_helpers/common";
import FooterForHome from "../layout/components/FooterForHome";
import GoogleMapReact from "google-map-react";
import { MapMarker } from "../components/MapMarker";

const mapOptions = {
  center: {
    lat: 42.317432,
    lng: -83.026772
  },
  zoom: 10
};
export default class CompanyListing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeIndex: 0,
      activeCompanies: [],
      browseBySectorList: [],
      listOfCompanies: [],
      togglePhoneNumberModal: false,
      activeCompanyKey: "",
      listOfSectors: [],
      browseByCityList: [],
      companyByRegion: [],
      listOfAllCompanies: [],
      listOfCity: [
        { _id: "Amherstburg" },
        { _id: "Essex" },
        { _id: "Kingsville" },
        { _id: "Lakeshore" },
        { _id: "LaSalle" },
        { _id: "Leamington" },
        { _id: "Tecumseh" },
        { _id: "Windsor" }
      ],
      cityOrSectorTitle: "",
      count: 0,
      finalArrayForSectors: [],
      isLoading: true,
      particularCompanyLocation: {},
      mapModel: false,
      municipalityLoading: true
    };
  }

  componentDidMount() {
    const str = this.props.location.search;
    const whichSectorToShow = parseInt(str.substring(str.indexOf("?") + 1));
    this.setState({ activeIndex: whichSectorToShow || 0 });

    const queryParams = queryString.parse(this.props.location.search);

    let { city, sector } = queryParams;
    if (queryParams?.city) {
      this.getBrowseByCityList(false);
      this.getListOfCompaniesByCity(city);
      this.setState({
        cityOrSectorTitle: city
      });
    } else if (queryParams?.sector) {
      this.getBrowseBySectorList(false);
      this.getListOfCompaniesBySector(sector);
      this.setState({
        cityOrSectorTitle: sector
      });
    } else {
      this.getBrowseBySectorList();
      this.getBrowseByCityList();
      this.getAllActivecompanies();
      this.getAllSector();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      const str = this.props.location.search;
      const whichSectorToShow = parseInt(str.substring(str.indexOf("?") + 1));
      this.setState({ activeIndex: whichSectorToShow || 0 });
      window.scrollTo(0, 0);
    }
  }

  componentWillUnmount() {
    document.body.classList.remove("Municipalities-BackgroundImg");
  }
  getAllActivecompanies = () => {
    companyService.getAllActiveCompanies().then((data) => {
      if (data) {
        this.setState({
          listOfCompanies: sortCompanies(data.Data),
          listOfAllCompanies: data.Data,
          isLoading: false
        });
      }
    });
  };

  getBrowseBySectorList = (loading) => {
    this.setState({ isLoading: loading ? loading : true });
    companyService.browseBySectorList().then((data) => {
      if (data) {
        if (data)
          this.setState({ browseBySectorList: data.Data, isLoading: false });
      }
    });
  };

  getListOfCompaniesBySector = (sector) => {
    this.setState({ isLoading: true });
    companyService.getListOfCompaniesBySector(sector).then((data) => {
      if (data) {
        this.setState({
          listOfCompanies: sortCompanies(data.Data),
          isLoading: false
        });
      }
    });
  };

  getBrowseByCityList = (loading) => {
    this.setState({ isLoading: loading ? loading : true });
    companyService.browseByCityList().then((data) => {
      if (data) {
        this.setState(
          {
            browseByCityList: data.Data
          },
          () => {
            this.setState({ municipalityLoading: false });
          }
        );
      }
    });
  };

  getListOfCompaniesByCity = (city) => {
    this.setState({ isLoading: true });
    companyService.getListOfCompaniesByCity(city).then((data) => {
      if (data) {
        this.setState({
          listOfCompanies: sortCompanies(data.Data),
          isLoading: false
        });
      }
    });
  };

  copyToClipBoard = (number) => {
    this.toast.show({
      severity: "success",
      summary: `${number}`,
      detail: "Copied To Clipboard"
    });
    navigator.clipboard.writeText(number);
  };

  openPhoneNumberModal = (key) => {
    this.setState({ togglePhoneNumberModal: true, activeCompanyKey: key });
  };

  closePhoneNumberModal = () => {
    this.setState({ togglePhoneNumberModal: false });
  };

  closeMapModel = () => {
    this.setState({ mapModel: false, particularCompanyLocation: {} });
  };

  handleClick = (key) => {
    this.props.history.push(
      `/company-details/${key || "f-j-collision-windsor"}`
    );
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

  getAllSector = () => {
    sectorService.getAllSectorsPublic().then((data) => {
      this.setState({
        listOfSectors: data.Data
      });
    });
  };

  render() {
    const {
      browseBySectorList,
      listOfCompanies,
      activeCompanyKey,
      listOfSectors,
      browseByCityList,
      listOfCity,
      isLoading,
      municipalityLoading
    } = this.state;

    // for Sector and their count
    let updatedSectorsWithCounts = updateSectorWithCount(
      browseBySectorList,
      listOfSectors
    );

    //for City and their count
    let updatedCityWithCounts = updateCityWithCount(
      listOfCity,
      browseByCityList
    );

    return (
      <>
        <Header history={this.props.history} />
        <Toast ref={(el) => (this.toast = el)} position="top-right"></Toast>
        <div>
          <TabView
            activeIndex={this.state.activeIndex}
            onTabChange={(e) => {
              this.setState({
                activeIndex: e.index,
                listOfCompanies: this.state.listOfAllCompanies
              });
            }}
          >
            <TabPanel header="Municipalities">
              <div
                className="d-flex align-items-center"
                style={{
                  height: "750px"
                }}
              >
                {/* <div className="">
                      <img
                        src={window.location.origin + "/assets/images/dashBoardMap.jpg"}
                        alt=""
                        width="100%"
                        height="100%"
                      />
                    </div> */}
                <div className="container">
                  <div className="d-flex flex-column">
                    {municipalityLoading ? (
                      <>
                        <div className="w-100 d-flex justify-content-center pb-4">
                          <div class="spinner-border" role="status">
                            <span class="visually-hidden"></span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="">
                        {updatedCityWithCounts.map((city, index) => {
                          return (
                            <div className="">
                              <a
                                style={{
                                  fontSize: "1.5rem",
                                  fontFamily: "Open sans"
                                }}
                                className="text-dark text-decoration-none"
                                href={`?0&city=${city._id}#card-board`}
                                onClick={() => {
                                  this.getListOfCompaniesByCity(city._id);
                                  this.setState({
                                    cityOrSectorTitle: city._id
                                  });
                                }}
                              >
                                {city._id}{" "}
                                <span className="">{city.count}</span>
                              </a>
                              {/* </div> */}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabPanel>
            <TabPanel header="Sectors" style={{ display: "none" }}>
              <div className="sectortabs">
                <div className="container">
                  <div className="row">
                    {updatedSectorsWithCounts.map((sector, index) => {
                      if (index <= 2) {
                        return (
                          <div className="col-md-3 " key={index}>
                            <a
                              style={{
                                textDecoration: "none",
                                fontFamily: "Open sans"
                              }}
                              href={`?1&sector=${sector._id}#card-board`}
                              onClick={() => {
                                this.getListOfCompaniesBySector(sector._id);
                                this.setState({
                                  cityOrSectorTitle: sector._id
                                });
                              }}
                            >
                              <img
                                className="SectorImage"
                                src={
                                  IMAGE_OBJECT[sector._id.trim()] ||
                                  "/assets/images/weedc_new_logo.svg"
                                }
                                width="140"
                                height="140"
                              />
                              <div className="sectorTitleText">
                                {SECTORS_NAME_CHANGE[sector._id] || sector._id}(
                                {sector.count})
                              </div>
                            </a>
                          </div>
                        );
                      }
                      if (index >= 3) {
                        return (
                          <div className="col-md-3" key={index}>
                            <a
                              style={{
                                textDecoration: "none",
                                fontFamily: "Open sans"
                              }}
                              href={`?1&sector=${sector._id}#card-board`}
                              // href="#card-board"
                              onClick={() => {
                                this.getListOfCompaniesBySector(sector._id);
                                this.setState({
                                  cityOrSectorTitle: sector._id
                                });
                              }}
                            >
                              <img
                                className="SectorImage"
                                src={
                                  IMAGE_OBJECT[sector._id.trim()] ||
                                  "/assets/images/weedc_new_logo.svg"
                                }
                                width="140"
                                height="140"
                              />
                              <div className="sectorTitleText">
                                {SECTORS_NAME_CHANGE[sector._id] || sector._id}(
                                {sector.count})
                              </div>
                            </a>
                          </div>
                        );
                      }
                    })}
                  </div>
                </div>
              </div>
            </TabPanel>
          </TabView>
        </div>

        <div className="container">
          <div className="row " id="card-board">
            <div className="col-lg-12 col-md-12 col-sm-12">
              <div className="">
                {isLoading ? (
                  <>
                    <div className="w-100 d-flex justify-content-center pb-4">
                      <div class="spinner-border" role="status">
                        <span class="visually-hidden"></span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="company-lists mobileResponsiveClick">
                    <div className="card mb-5 ">
                      {listOfCompanies.length ? (
                        <div className="companylistdiv">
                          {Object.keys(listOfCompanies).map((key, index) => {
                            return (
                              <div className="listitmes" key={index}>
                                <div
                                  className="imgwraper"
                                  onClick={(e) =>
                                    this.handleClick(listOfCompanies[key]._id)
                                  }
                                >
                                  <img
                                    src={
                                      listOfCompanies[key].companyLogo ||
                                      "/assets/images/weedc_120X120.png"
                                    }
                                    className="img-fluid"
                                    style={
                                      listOfCompanies.companyLogo
                                        ? {
                                            backgroundColor:
                                              listOfCompanies.companyLogo
                                          }
                                        : null
                                    }
                                  />
                                </div>
                                <div className="list-body">
                                  <div className="row ">
                                    <div
                                      className="col-12"
                                      onClick={(e) =>
                                        this.handleClick(
                                          listOfCompanies[key]._id
                                        )
                                      }
                                    >
                                      <h5>
                                        {
                                          listOfCompanies[key]?.demographics
                                            ?.companyTitle
                                        }
                                      </h5>
                                    </div>
                                    <div
                                      className="col-12"
                                      onClick={(e) =>
                                        this.handleClick(
                                          listOfCompanies[key]._id
                                        )
                                      }
                                    >
                                      <span>
                                        {" "}
                                        {concateAddress(
                                          listOfCompanies[key]?.demographics
                                        )}
                                      </span>
                                    </div>
                                    <div
                                      className="col-12"
                                      onClick={(e) =>
                                        this.handleClick(
                                          listOfCompanies[key]._id
                                        )
                                      }
                                    >
                                      <p>
                                        {
                                          listOfCompanies[key]?.demographics
                                            ?.description
                                        }
                                      </p>
                                    </div>

                                    <div className="col-12">
                                      {listOfCompanies[key]?.contactDetails
                                        ?.phoneNumber ||
                                      listOfCompanies[key]?.contactDetails
                                        ?.alternatePhoneNumber ||
                                      listOfCompanies?.contactDetails?.fax ? (
                                        <button
                                          className="btn btn-weedc search-list-box-btn mr-2"
                                          onClick={() => {
                                            this.openPhoneNumberModal(key);
                                          }}
                                        >
                                          <FontAwesomeIcon icon={faPhone} />{" "}
                                          Phone Number
                                        </button>
                                      ) : null}

                                      <button
                                        className="btn btn-weedc search-list-box-btn mr-2"
                                        onClick={(e) => {
                                          this.handleDirectionsClick(
                                            concateAddress(
                                              listOfCompanies[key]?.demographics
                                            )
                                          );
                                        }}
                                      >
                                        <FontAwesomeIcon icon={faDirections} />{" "}
                                        Directions
                                      </button>
                                      {listOfCompanies[key]?.contactDetails
                                        ?.website ? (
                                        <button
                                          className="btn btn-weedc search-list-box-btn mr-2"
                                          onClick={(e) =>
                                            this.handleWebsiteClick(
                                              getClickableLink(
                                                listOfCompanies[key]
                                                  ?.contactDetails?.website
                                              )
                                            )
                                          }
                                        >
                                          <FontAwesomeIcon icon={faDesktop} />{" "}
                                          Website
                                        </button>
                                      ) : null}

                                      {/* {listOfCompanies[key]?.location ? (
                                      <button
                                        className="btn btn-weedc search-list-box-btn mr-2"
                                        onClick={(e) => {
                                          this.setState({
                                            particularCompanyLocation:
                                              listOfCompanies[key]?.location,
                                            mapModel: true,
                                          });
                                        }}
                                      >
                                        <FontAwesomeIcon icon={faDesktop} /> See
                                        on maps
                                      </button>
                                    ) : null} */}
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4">
                                  {/* <GoogleMapReact
                              bootstrapURLKeys={{
                                key: "AIzaSyD6GGik6mcxsZbKw60nof5NwYubIleeSYE",
                              }}
                              defaultCenter={{
                                lat:
                                  listOfCompanies[key]?.location
                                    ?.coordinates[0],
                                lng:
                                  listOfCompanies[key]?.location
                                    ?.coordinates[1],
                              }}
                              defaultZoom={mapOptions.zoom}
                            >
                              <MapMarker
                                key={index}
                                lat={
                                  listOfCompanies[key]?.location?.coordinates[0]
                                }
                                lng={
                                  listOfCompanies[key]?.location?.coordinates[1]
                                }
                                text={
                                  listOfCompanies[key]?.demographics
                                    ?.companyTitle
                                }
                                address={
                                  listOfCompanies[key]?.demographics?.address
                                }
                              />
                            </GoogleMapReact> */}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <h2>
                          No Companies Available For
                          {this.state.cityOrSectorTitle}
                        </h2>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <Dialog
              className="phoneNumberDialog"
              header="Contact Details"
              visible={this.state.togglePhoneNumberModal}
              onHide={this.closePhoneNumberModal}
            >
              <div className="company-info-details">
                {listOfCompanies[activeCompanyKey]?.contactDetails
                  ?.phoneNumber ? (
                  <>
                    <div className="max-width p-2">
                      <p className="display-inline">
                        <strong>Phone Number :</strong>
                        {
                          listOfCompanies[activeCompanyKey]?.contactDetails
                            ?.phoneNumber
                        }
                      </p>
                      <FontAwesomeIcon
                        className="float-right"
                        icon={faClipboard}
                        size="lg"
                        onClick={() =>
                          this.copyToClipBoard(
                            listOfCompanies[activeCompanyKey]?.contactDetails
                              ?.phoneNumber
                          )
                        }
                      />
                    </div>
                  </>
                ) : null}

                {listOfCompanies[activeCompanyKey]?.contactDetails
                  ?.alternatePhoneNumber ? (
                  <>
                    <div className="max-width p-2">
                      <p className="display-inline">
                        <strong>Alternate Number :</strong>
                        {
                          listOfCompanies[activeCompanyKey]?.contactDetails
                            ?.alternatePhoneNumber
                        }
                      </p>
                      <FontAwesomeIcon
                        className="float-right"
                        icon={faClipboard}
                        size="lg"
                        onClick={() =>
                          this.copyToClipBoard(
                            listOfCompanies[activeCompanyKey]?.contactDetails
                              ?.alternatePhoneNumber
                          )
                        }
                      />
                    </div>
                  </>
                ) : null}

                {listOfCompanies[activeCompanyKey]?.contactDetails?.fax ? (
                  <>
                    <div className="max-width p-2">
                      <p className="display-inline">
                        <strong>Fax :</strong>
                        {listOfCompanies[activeCompanyKey]?.contactDetails?.fax}
                      </p>
                      <FontAwesomeIcon
                        className="float-right"
                        icon={faClipboard}
                        size="lg"
                        onClick={() =>
                          this.copyToClipBoard(
                            listOfCompanies[activeCompanyKey]?.contactDetails
                              ?.fax
                          )
                        }
                      />
                    </div>
                  </>
                ) : null}
              </div>
            </Dialog>

            {Object.keys(this?.state?.particularCompanyLocation).length && (
              <Dialog
                className="phoneNumberDialog "
                header="Maps"
                visible={this.state.mapModel}
                onHide={this.closeMapModel}
              >
                {this?.state?.particularCompanyLocation && (
                  <div
                    className="company-info-details"
                    style={{ height: "50vh" }}
                  >
                    <GoogleMapReact
                      bootstrapURLKeys={{
                        key: "AIzaSyD6GGik6mcxsZbKw60nof5NwYubIleeSYE"
                      }}
                      defaultCenter={{
                        lat: listOfCompanies[activeCompanyKey]?.location
                          ?.coordinates[0],

                        lng: listOfCompanies[activeCompanyKey]?.location
                          ?.coordinates[1]
                      }}
                      defaultZoom={mapOptions.zoom}
                    >
                      <MapMarker
                        lat={
                          listOfCompanies[activeCompanyKey]?.location
                            ?.coordinates[0]
                        }
                        lng={
                          listOfCompanies[activeCompanyKey]?.location
                            ?.coordinates[1]
                        }
                        text={
                          listOfCompanies[activeCompanyKey]?.demographics
                            ?.companyTitle
                        }
                        address={
                          listOfCompanies[activeCompanyKey]?.demographics
                            ?.address
                        }
                      />
                    </GoogleMapReact>
                  </div>
                )}
              </Dialog>
            )}
          </div>
        </div>
        <FooterForHome />
      </>
    );
  }
}
