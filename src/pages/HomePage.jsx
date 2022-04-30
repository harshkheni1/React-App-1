import React, { Component, useState } from "react";
import Header from "../layout/components/Header";
import { connect } from "react-redux";
//import { UncontrolledCarousel } from "reactstrap";
import GoogleMapReact from "google-map-react";
import { MapMarker } from "../components/MapMarker";
import { Carousel } from "primereact/carousel";
import { Button } from "primereact/button";
import ShowMoreText from "react-show-more-text";
import { companiesData } from "../_helpers/companyData";
import { Link } from "react-router-dom";
import { companyService, highlightService, sectorService } from "../_services";
import { MUNICIPALITIES_DATA } from "../_helpers/common";
import { setSearchTerm } from "../redux-store/action";
import FooterForHome from "../layout/components/FooterForHome";
import Select from "react-select";
import { InputText } from "primereact/inputtext";
import { Navbar, Nav, Modal } from "react-bootstrap";
import { Dialog } from "primereact/dialog";
import moment from "moment";
// const items = [
//   {
//     src: "/assets/images/amd_building.jpg",
//     altText: "AMD",
//     caption:
//       "Advanced Micro Devices, Inc. is an American multinational semiconductor company based in Santa Clara, California, that develops computer processors and related technologies for business and consumer markets.",
//     header: "AMD",
//     key: "1"
//   },
//   {
//     src: "/assets/images/ibm_building.jpg",
//     altText: "IBM",
//     caption:
//       "International Business Machines Corporation is an American multinational technology company headquartered in Armonk, New York.",
//     header: "IBM",
//     key: "2"
//   },
//   {
//     src: "/assets/images/corporate_center.jpg",
//     altText: "Jones Deslauriers",
//     caption:
//       "Jones DesLauriers is a Navacord broker partner, one of Canada’s largest commercial insurance brokers.",
//     header: "Jones Deslauriers",
//     key: "3"
//   },
//   {
//     src: "/assets/images/banner-coopers-hawk.jpg",
//     altText: "Coopers Hawk",
//     caption: "",
//     header: "",
//     key: "4"
//   }
// ];

const companyMarkerList = [
  {
    lat: 42.2679371,
    lng: -83.0119475,
    text: "A & A Insurance Brokers Ltd"
  },
  {
    lat: 42.306922,
    lng: -82.9739764,
    text: "F&j Collision Windsor Ltd"
  },
  {
    lat: 42.310119,
    lng: -83.0243899,
    text: "F&j Collision Windsor Ltd"
  },
  {
    lat: 42.3123708,
    lng: -83.0710053,
    text: "Windsor Essex Community Health Centre"
  }
];

const mapOptions = {
  center: {
    lat: 42.2868836,
    lng: -82.9286349
  },
  zoom: 12
};

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    setSearchTerm: (data) => {
      dispatch(setSearchTerm(data));
    }
  };
}
class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sector: "",
      location: "",
      navbar: false,
      show: false,
      companies: Object.keys(companiesData).map((key) => {
        return { ...companiesData[key], key };
      }),

      companiesData: [],
      highlightsData: [],
      companiesLocation: [],
      sectorData: [],
      municipalitiesData: MUNICIPALITIES_DATA,
      globalSearch: "",
      announcementDialog: false,
      annoucementInfoForParticularInfo: []
    };

    this.responsiveOptions = [
      {
        breakpoint: "1024px",
        numVisible: 3,
        numScroll: 3
      },
      {
        breakpoint: "600px",
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: "480px",
        numVisible: 1,
        numScroll: 1
      }
    ];
  }

  componentDidMount() {
    // document.body.classList.add("Municipalities-BackgroundImg");
    this.windowFunction();
    this.featuredCompanyList();
    this.getAllHighlights();
    this.getAllActiveCompaniesLocation();
    this.getAllSectors();
  }
  changebackgroundcolor = () => {
    if (window.scrollY >= 30) {
      this.setState({ navbar: true });
    } else {
      this.setState({ navbar: false });
    }
  };
  windowFunction = () => {
    window.addEventListener("scroll", this.changebackgroundcolor);
  };

  featuredCompanyList = () => {
    companyService.featuredCompanyList().then((data) => {
      if (data) {
        this.setState({ companiesData: data.Data });
      }
    });
  };

  getAllSectors = () => {
    sectorService.getAllSectorsPublic().then((data) => {
      if (data) {
        let labelValue = [];
        data.Data.forEach((sector) => {
          labelValue.push({
            label: sector.sectorName,
            value: sector.sectorName
          });
        });
        this.setState({ sectorData: labelValue });
      }
    });
  };

  getAllHighlights = () => {
    highlightService.getAllHighlights().then((data) => {
      if (data) {
        this.setState({ highlightsData: data.Data });
      }
    });
  };

  getAllActiveCompaniesLocation = () => {
    companyService.getAllActiveCompaniesLocation().then((data) => {
      if (data) {
        this.setState({ companiesLocation: data.Data });
      }
    });
  };

  globalSearch = (e) => {
    e.preventDefault();
    this.props.setSearchTerm(this.state.globalSearch);
    this.props.history.push(`/search?search=${this.state.globalSearch}`);
  };

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSearch = (e) => {
    this.props.setSearchTerm("");
    this.props.history.push(
      `\searchbylocationandsector?sector=${this.state.sector}&location=${this.state.location}`
    );
  };

  header = (company) => {
    return (
      <img
        alt="Card"
        src={company.image}
        onError={(e) =>
          (e.target.src =
            "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
        }
      />
    );
  };

  footer = (company) => {
    return (
      <span>
        <Button label="Save" icon="pi pi-check" />
        <Button
          label="Cancel"
          icon="pi pi-times"
          className="p-button-secondary p-ml-2"
        />
      </span>
    );
  };

  productTemplate(product) {
    return (
      <div className="card">
        <div className="product-item-content">
          <div className="p-mb-3">
            <img
              src={product.image}
              onError={(e) =>
                (e.target.src =
                  "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
              }
              alt={product.name}
              className="product-item company-carousel-image"
            />
          </div>
          <div>
            <h4 className="p-mb-1">{product.name}</h4>
            <span
              className={`product-badge status-${product.inventoryStatus.toLowerCase()}`}
            >
              {product.inventoryStatus}
            </span>
            <div className="car-buttons p-mt-5">
              <Button
                icon="pi pi-search"
                className="p-button p-button-rounded p-mr-2"
              />
              <Button
                icon="pi pi-star"
                className="p-button-success p-button-rounded p-mr-2"
              />
              <Button
                icon="pi pi-cog"
                className="p-button-help p-button-rounded"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  companyTemplate(company) {
    const header = (
      <img
        alt="Card"
        src={company.image}
        onError={(e) =>
          (e.target.src =
            "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
        }
      />
    );
    const footer = (
      <span>
        <Button label="Save" icon="pi pi-check" />
        <Button
          label="Cancel"
          icon="pi pi-times"
          className="p-button-secondary ml-2"
        />
      </span>
    );
    return (
      <div className="slides">
        <div className="card card-padding-none My09Card">
          <img
            className="card-img-top card-img-height"
            src={
              company.companyLogo
                ? company.companyLogo
                : "/assets/images/weedc_120X120.png"
            }
            alt="Card image cap"
          />
          <div className="card-body border-top">
            <h5 className="card-title featured-card-height">
              {company.demographics.companyTitle}
            </h5>
            <div className="card-text featured-card-text">
              <ShowMoreText
                /* Default options */
                className="mt-2"
                lines={3}
                more="Show more"
                less="Show less"
                anchorClass=""
                expanded={false}
              >
                <p className="card-text">{company.demographics.description}</p>
              </ShowMoreText>
            </div>
          </div>
          <div>
            {" "}
            <Link
              to={`/company-details/${company._id}`}
              className="btn btn-primary btn-view-more"
            >
              View More
            </Link>
          </div>
        </div>
      </div>
    );
  }

  highlightTemplate = (company) => {
    const header = (
      <img
        alt="Card"
        src={
          company?.companies?.companyLogo
            ? company?.companies?.companyLogo
            : "/assets/images/weedc_120X120.png"
        }
        onError={(e) =>
          (e.target.src =
            "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
        }
      />
    );
    const footer = (
      <span>
        <Button label="Save" icon="pi pi-check" />
        <Button
          label="Cancel"
          icon="pi pi-times"
          className="p-button-secondary ml-2"
        />
      </span>
    );
    return (
      <div className="slides">
        <div className="card card-padding-none My09Card">
          <img
            className="card-img-top card-img-height"
            src={
              company?.companies?.companyLogo
                ? company?.companies?.companyLogo
                : "/assets/images/weedc_120X120.png"
            }
            alt="Card image cap"
          />
          <div className="card-body border-top">
            <div className="topBottomPadding">
              {company?.companies?.demographics?.companyTitle ? (
                <h1
                  data-toggle="tooltip"
                  title={company?.companies?.demographics?.companyTitle}
                  className="border-none my-2 text-center my02Head "
                >
                  <strong>
                    {" "}
                    {company?.companies?.demographics?.companyTitle?.toUpperCase()}
                  </strong>
                </h1>
              ) : (
                <h1
                  data-toggle="tooltip"
                  title={company?.companies?.demographics?.companyTitle}
                  className="border-none my-2 text-center my02Head "
                >
                  <strong></strong>
                </h1>
              )}
            </div>

            {company?.highlightType ? (
              <h2
                className="text-center border-bottom pb-2 "
                data-toggle="tooltip"
                title={company?.highlightType}
              >
                {company?.highlightType?.toUpperCase()}
              </h2>
            ) : (
              <h2
                className="text-center border-bottom pb-2 "
                data-toggle="tooltip"
                title={company?.highlightType}
              ></h2>
            )}

            <div className="text-center pt-3 pb-3">
              <button
                type="button"
                className="btn btn-primary buttonColor"
                onClick={(e) => {
                  this.setState({
                    announcementDialog: true,
                    annoucementInfoForParticularInfo: company
                  });
                }}
              >
                View More
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // highlightTemplate = (company) => {
  //   console.log("company: ", company);
  //   return (
  //     <div className="card example1 mx-2 mb-0">
  //       <div className="companyAnnoucement">
  //         <img
  //           className=""
  //           src={
  //             company?.companies?.companyLogo
  //               ? company?.companies?.companyLogo
  //               : "/assets/images/weedc_120X120.png"
  //           }
  //           alt="Card image cap"
  //         />
  //       </div>

  //       <div className="notiMainCall">
  //         {/* {company?.companies?.demographics?.companyTitle ? (
  //           <h2
  //             className="text-center border-bottom pb-2"
  //             data-toggle="tooltip"
  //             title={company?.companies?.demographics?.companyTitle}
  //           >
  //             {company?.companies?.demographics?.companyTitle}
  //           </h2>
  //         ) : null} */}
  //         <div className="topBottomPadding">
  //           {company?.companies?.demographics?.companyTitle ? (
  //             <h1
  //               data-toggle="tooltip"
  //               title={company?.companies?.demographics?.companyTitle}
  //               className="border-none my-2 text-center my02Head "
  //             >
  //               <strong>
  //                 {" "}
  //                 {company?.companies?.demographics?.companyTitle}
  //               </strong>
  //             </h1>
  //           ) : null}
  //         </div>

  //         {/* <p
  //           className="mb-0 pl-2 highlight-company-title text-center"
  //           data-toggle="tooltip"
  //           title={company.highlightType}
  //         >
  //           {company.highlightType}
  //         </p> */}

  //         {company.highlightType ? (
  //           <h2
  //             className="text-center border-bottom pb-2 "
  //             data-toggle="tooltip"
  //             title={company.highlightType}
  //           >
  //             {company.highlightType}
  //           </h2>
  //         ) : null}
  //         <div className="text-center pt-3 pb-3">
  //           <button
  //             type="button"
  //             className="btn btn-primary buttonColor"
  //             onClick={(e) => {
  //               this.setState({
  //                 announcementDialog: true,
  //                 annoucementInfoForParticularInfo: company,
  //               });
  //             }}
  //           >
  //             View More
  //           </button>
  //         </div>

  //         {/* <p
  //           className="mb-0"
  //           data-toggle="tooltip"
  //           title={company.pressContact}
  //         >
  //           {company.pressContact}
  //         </p>
  //         <p className="mb-0" data-toggle="tooltip" title={company.bodyCopy}>
  //           {company.bodyCopy}
  //         </p>
  //         <p
  //           className="mb-0"
  //           data-toggle="tooltip"
  //           title={company.pointOfContact}
  //         >
  //           {company.pointOfContact}
  //         </p>
  //         <p
  //           className="mb-0"
  //           data-toggle="tooltip"
  //           title={company.emailAddress}
  //         >
  //           {company.emailAddress}
  //         </p>
  //         <p className="mb-0" data-toggle="tooltip" title={company.phoneNumber}>
  //           {company.phoneNumber}
  //         </p> */}
  //       </div>
  //     </div>
  //   );
  // };

  render() {
    const {
      companiesLocation,
      sectorData,
      municipalitiesData,
      annoucementInfoForParticularInfo
    } = this.state;

    let filteredCompaniesLocation = companiesLocation.filter((companies) => {
      return companies?.location?.coordinates.length;
    });
    let close = () => this.setState({ show: false });

    return (
      <div className="homepage">
        <Header history={this.props.history} />
        {/* mobile header  */}
        <div className="mobile-header">
          <Navbar expand="lg">
            <Navbar.Brand>
              <img src="/assets/images/weedc_new_logo.svg" />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <div className="mobilnavhome">
                <form onSubmit={this.globalSearch}>
                  <InputText
                    type="search"
                    placeholder="What are you looking for?"
                    className="mobile-search"
                    onChange={(e) => {
                      this.setState({
                        globalSearch: e.target.value
                      });
                    }}
                  />
                </form>
                <a
                  className="text-decoration-none"
                  href="/listings?0"
                  onClick={() => {
                    this.props.history.push("/listings?0");
                  }}
                >
                  <span>Browse by Municipalities</span>
                </a>
                <a
                  className="text-decoration-none"
                  href="/listings?1"
                  onClick={() => {
                    this.props.history.push("/listings?1");
                  }}
                >
                  <span>Browse by Sectors</span>
                </a>
                <a
                  className="text-decoration-none"
                  href="login"
                  onClick={() => {
                    this.props.history.push("/login");
                  }}
                >
                  <span>Sign In</span>
                </a>
              </div>
              <Nav className="topnavs">
                <a
                  target="_blank"
                  href="https://www.investwindsoressex.com/en/about-us/about-us.aspx"
                >
                  About Us
                </a>
                <a
                  target="_blank"
                  href="https://www.investwindsoressex.com/en/about-us/media.aspx"
                >
                  Media
                </a>
                <a
                  target="_blank"
                  href="https://www.investwindsoressex.com/Modules/News/en"
                >
                  News
                </a>
                <a
                  target="_blank"
                  href="https://www.investwindsoressex.com/en/about-us/contact-us.aspx"
                >
                  Contact Us
                </a>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </div>
        <div className="MainImg">
          <div
            className={`bannerheader ${
              this.state.navbar ? "fixed-banner" : "bg-transperent"
            }`}
          >
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-4 logoimg p-0">
                  <img
                    src={`${
                      this.state.navbar
                        ? "/assets/images/weedc_new_logo.svg"
                        : "/assets/images/weedc_logo_white.svg"
                    } `}
                    alt=""
                  />
                </div>
                <div className="col-lg-8 d-flex justify-content-end p-0">
                  <a href="" className="text-decoration-none">
                    <span
                      href="/listings"
                      className={`h5 bottomBorder font-weight-bold mr-5 ${
                        this.state.navbar ? "text-dark" : "text-white"
                      }`}
                      onClick={() => {
                        this.props.history.push("/listings?0");
                      }}
                      style={{
                        fontSize: "20px",
                        fontWeight: "700"
                      }}
                    >
                      Browse by Municipalities
                    </span>
                  </a>
                  <a href="" className="text-decoration-none">
                    <span
                      href="/listings"
                      className={`h5 bottomBorder font-weight-bold mr-5 ${
                        this.state.navbar ? "text-dark" : "text-white"
                      }`}
                      onClick={() => {
                        this.props.history.push("/listings?1");
                      }}
                      style={{
                        fontSize: "20px",
                        fontWeight: "700"
                      }}
                    >
                      Browse by Sectors
                    </span>
                  </a>
                  <a href="" className="text-decoration-none">
                    <span
                      href="login"
                      className={`h5 text-decoration-none bottomBorder font-weight-bold mr-5 ${
                        this.state.navbar ? "text-dark" : "text-white"
                      }`}
                      onClick={() => {
                        this.props.history.push("/login");
                      }}
                      style={{
                        fontSize: "20px",
                        fontWeight: "700"
                      }}
                    >
                      {" "}
                      Sign In
                    </span>
                  </a>
                  <a
                    onClick={() => this.setState({ show: true })}
                    className="searchbtn"
                  >
                    <span
                      href="login"
                      className={`h5 text-decoration-none bottomBorder font-weight-bold mr-2 ${
                        this.state.navbar ? "text-dark" : "text-white"
                      }`}
                      style={{ cursor: "pointer" }}
                    >
                      <i className="pi pi-search" />
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <Modal show={this.state.show} onHide={close} className="search-modal">
            <Modal.Body>
              <span
                onClick={close}
                className="pi pi-times"
                style={{ cursor: "pointer" }}
              ></span>
              <div className="serchbox-ml">
                <form onSubmit={this.globalSearch}>
                  <i className="pi pi-search" />
                  <InputText
                    type="search"
                    placeholder="What are you looking for?"
                    className="serchinput"
                    onChange={(e) => {
                      this.setState({
                        globalSearch: e.target.value
                      });
                    }}
                  />
                  <button type="submit" className="btn btn-primary">
                    Search
                  </button>
                </form>
              </div>
            </Modal.Body>
          </Modal>
          <div className="windsopreser">
            <div className="container">
              <div className="row">
                {/* <div className="container-fluid"> */}
                <div className="col-lg-12  d-flex flex-column justify-content-end">
                  <h1 className="text-white" style={{ fontSize: "3rem" }}>
                    <strong>Source WindsorEssex</strong>
                  </h1>
                  <p className="text-white h6" style={{ marginBottom: "35px" }}>
                    <strong>
                      <a
                        href="https://www.investwindsoressex.com/en/index.aspx"
                        target="_blank"
                        className="text-white font-weight-bold"
                      >
                        Home
                      </a>
                    </strong>{" "}
                    <span
                      className="font-weight-light"
                      style={{
                        color: "#a6a6a6",
                        textShadow: "0 5px 12px rgb(0 0 0 / 54%)"
                      }}
                    >
                      / Sourcewindsoressex
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="source-search">
          <div className="container">
            <div className="row">
              {/* <div className="container-fluid"> */}
              <div className="col-lg-12 col-md-12">
                {/* <div className="container"> */}
                <p
                  className="h5 fontForHomePage "
                  style={{
                    // marginLeft: "50px",
                    wordSpacing: "2px",
                    lineHeight: "25px",
                    // textAlign: "center",
                    paddingBottom: "20px",
                    paddingTop: "20px"
                    // paddingLeft: "75px",
                  }}
                >
                  Source WindsorEssex is a regional database connecting you to
                  businesses across key sectors to find suppliers, explore
                  regional capabilities and collaborate on innovative projects.
                </p>
                {/* </div> */}
                <form>
                  <div className="row">
                    <div className="col-md-5">
                      <div className="form-group">
                        <Select
                          options={sectorData}
                          onChange={(e) => {
                            this.setState({ sector: e.value });
                          }}
                          placeholder="Sector"
                        />
                      </div>
                    </div>
                    <div className="col-md-5">
                      <div className="form-group">
                        <Select
                          options={municipalitiesData}
                          onChange={(e) => {
                            this.setState({ location: e.value });
                          }}
                          placeholder="Municipalities"
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <button
                        type="button"
                        className="btn btn-primary btn-block "
                        onClick={this.handleSearch}
                      >
                        Search
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              {/* </div> */}
            </div>
          </div>
        </div>
        {/* <UncontrolledCarousel items={items} /> */}
        <div className="card card-background mb-0">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <h3 className="mt-5 headline centered margin-bottom-45">
                  <strong className="headline-with-separator color-white">
                    Featured Companies
                  </strong>
                </h3>
                <Carousel
                  value={this.state.companiesData}
                  numVisible={4}
                  numScroll={4}
                  responsiveOptions={this.responsiveOptions}
                  className="custom-carousel my-custom-carousel"
                  circular
                  itemTemplate={this.companyTemplate}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="clearFix"></div>
        {/* <div className="card card-background mb-0">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <h3 className="mt-5 headline centered margin-bottom-45">
                  <strong className="headline-with-separator color-white">
                    Company Announcements
                  </strong>
                </h3>
                <Carousel
                  value={this.state.highlightsData}
                  numVisible={4}
                  numScroll={4}
                  responsiveOptions={this.responsiveOptions}
                  className="custom-carousel my-custom-carousel"
                  circular
                  itemTemplate={this.highlightTemplate}
                />
              </div>
            </div>
          </div>
        </div> */}
        <FooterForHome />
        <Dialog
          header={`Annoucement for ${annoucementInfoForParticularInfo?.companies?.demographics?.companyTitle} `}
          visible={this.state.announcementDialog}
          style={{ width: "90vw" }}
          onHide={() => {
            this.setState({ announcementDialog: false });
          }}
        >
          {" "}
          <div className="company-info-details">
            <div className="company-info-box p-2">
              <h4 className="py-2">Announcement Type</h4>
              <p>{annoucementInfoForParticularInfo.highlightType}</p>
            </div>

            <div className="company-info-box p-2">
              <h4 className="py-2">Headline</h4>
              <p>{annoucementInfoForParticularInfo.headline}</p>
            </div>

            <div className="company-info-box p-2">
              <h4 className="py-2">Email Address</h4>
              <p>{annoucementInfoForParticularInfo.emailAddress}</p>
            </div>
            {/* <div className="company-info-box p-2">
              <h4 className="py-2">Point Of Contact</h4>
              <p>{annoucementInfoForParticularInfo.pointOfContact}</p>
            </div> */}

            <div className="company-info-box p-2">
              <h4 className="py-2">Media Contact</h4>
              <p>{annoucementInfoForParticularInfo.pressContact}</p>
            </div>
            <div className="company-info-box p-2">
              <h4 className="py-2">Details</h4>
              <p>{annoucementInfoForParticularInfo.bodyCopy}</p>
            </div>
            <div className="company-info-box p-2">
              <h4 className="py-2">Phone Number</h4>
              <p>{annoucementInfoForParticularInfo.phoneNumber}</p>
            </div>

            <div className="company-info-box p-2">
              <h4 className="py-2">Created</h4>
              <p>
                {moment(annoucementInfoForParticularInfo.createdAt).format(
                  "MM/DD/YYYY hh:mm a"
                )}
              </p>
            </div>
          </div>
        </Dialog>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
